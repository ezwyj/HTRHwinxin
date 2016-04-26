using System.Web.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using Senparc.Weixin.MP.Agent;
using Senparc.Weixin.Context;
using Senparc.Weixin.MP.Entities;
using Senparc.Weixin.MP.Helpers;
using Senparc.Weixin.MP.MessageHandlers;
using Senparc.Weixin.MP.Entities.Request;
namespace WEIXINSITE.Controllers
{
    public partial class CustomMessageHandler : MessageHandler<CustomMessageContext>
    {
        private string appId = WebConfigurationManager.AppSettings["WeixinAppId"];
        private string appSecret = WebConfigurationManager.AppSettings["WeixinAppSecret"];

        public CustomMessageHandler(Stream inputStream, PostModel postModel, int maxRecordCount = 0)
            : base(inputStream, postModel, maxRecordCount)
        {
            //这里设置仅用于测试，实际开发可以在外部更全局的地方设置，
            //比如MessageHandler<MessageContext>.GlobalWeixinContext.ExpireMinutes = 3。
            WeixinContext.ExpireMinutes = 3;

            if (!string.IsNullOrEmpty(postModel.AppId))
            {
                appId = postModel.AppId;//通过第三方开放平台发送过来的请求
            }

            //在指定条件下，不使用消息去重
            base.OmitRepeatedMessageFunc = requestMessage =>
            {
                var textRequestMessage = requestMessage as RequestMessageText;
                if (textRequestMessage != null && textRequestMessage.Content == "容错")
                {
                    return false;
                }
                return true;
            };
        }

        public override void OnExecuting()
        {
            //测试MessageContext.StorageData
            if (CurrentMessageContext.StorageData == null)
            {
                CurrentMessageContext.StorageData = 0;
            }
            base.OnExecuting();
        }

        public override void OnExecuted()
        {
            base.OnExecuted();
            CurrentMessageContext.StorageData = ((int)CurrentMessageContext.StorageData) + 1;
        }

        /// <summary>
        /// 处理文字请求
        /// </summary>
        /// <returns></returns>
        public override IResponseMessageBase OnTextRequest(RequestMessageText requestMessage)
        {
            //方法四（v0.6+），仅适合在HandlerMessage内部使用，本质上是对方法三的封装
            //注意：下面泛型ResponseMessageText即返回给客户端的类型，可以根据自己的需要填写ResponseMessageNews等不同类型。

            var responseMessage = base.CreateResponseMessage<ResponseMessageText>();

            if (requestMessage.Content == null)
            {

            }
            else if (requestMessage.Content == "约束")
            {
                responseMessage.Content =
                    @"您正在进行微信内置浏览器约束判断测试。您可以：
<a href=""http://weixin.senparc.com/FilterTest/"">点击这里</a>进行客户端约束测试（地址：http://weixin.senparc.com/FilterTest/），如果在微信外打开将直接返回文字。
或：
<a href=""http://weixin.senparc.com/FilterTest/Redirect"">点击这里</a>进行客户端约束测试（地址：http://weixin.senparc.com/FilterTest/Redirect），如果在微信外打开将重定向一次URL。";
            }
            else if (requestMessage.Content == "测试" || requestMessage.Content == "退出")
            {

                if (requestMessage.Content == "测试")
                {
                    //进入APP测试
                    responseMessage.Content = "您已经进入的测试程序，请发送任意信息进行测试。发送文字【退出】退出测试对话。10分钟内无任何交互将自动退出应用对话状态。";
                }
                else
                {
                    //退出APP测试
                    responseMessage.Content = "您已经退出的测试程序。";
                }
            }
            else if (requestMessage.Content == "AsyncTest")
            {
                //异步并发测试（提供给单元测试使用）
                DateTime begin = DateTime.Now;
                int t1, t2, t3;
                System.Threading.ThreadPool.GetAvailableThreads(out t1, out t3);
                System.Threading.ThreadPool.GetMaxThreads(out t2, out t3);
                System.Threading.Thread.Sleep(TimeSpan.FromSeconds(4));
                DateTime end = DateTime.Now;
                var thread = System.Threading.Thread.CurrentThread;
                responseMessage.Content = string.Format("TId:{0}\tApp:{1}\tBegin:{2:mm:ss,ffff}\tEnd:{3:mm:ss,ffff}\tTPool：{4}",
                        thread.ManagedThreadId,
                        HttpContext.Current != null ? HttpContext.Current.ApplicationInstance.GetHashCode() : -1,
                        begin,
                        end,
                        t2 - t1
                        );
            }
            else if (requestMessage.Content == "open")
            {
                var openResponseMessage = requestMessage.CreateResponseMessage<ResponseMessageNews>();
                openResponseMessage.Articles.Add(new Article()
                {
                    Title = "开放平台微信授权测试",
                    Description = @"点击进入Open授权页面。

授权之后，您的微信所收到的消息将转发到第三方的服务器上，并获得对应的回复。

测试完成后，您可以登陆公众号后台取消授权。",
                    Url = "http://weixin.senparc.com/OpenOAuth/JumpToMpOAuth"
                });
                return openResponseMessage;
            }
            else if (requestMessage.Content == "错误")
            {
                var errorResponseMessage = requestMessage.CreateResponseMessage<ResponseMessageText>();
                //因为没有设置errorResponseMessage.Content，所以这小消息将无法正确返回。
                return errorResponseMessage;
            }
            else if (requestMessage.Content == "容错")
            {
                Thread.Sleep(1500);//故意延时1.5秒，让微信多次发送消息过来，观察返回结果
                var faultTolerantResponseMessage = requestMessage.CreateResponseMessage<ResponseMessageText>();
                faultTolerantResponseMessage.Content = string.Format("测试容错，MsgId：{0}，Ticks：{1}", requestMessage.MsgId,
                    DateTime.Now.Ticks);
                return faultTolerantResponseMessage;
            }
            else
            {
                var result = new StringBuilder();
                result.AppendFormat("您刚才发送了文字信息：{0}\r\n\r\n", requestMessage.Content);

                if (CurrentMessageContext.RequestMessages.Count > 1)
                {
                    result.AppendFormat("您刚才还发送了如下消息（{0}/{1}）：\r\n", CurrentMessageContext.RequestMessages.Count,
                        CurrentMessageContext.StorageData);
                    for (int i = CurrentMessageContext.RequestMessages.Count - 2; i >= 0; i--)
                    {
                        var historyMessage = CurrentMessageContext.RequestMessages[i];
                        result.AppendFormat("{0} 【{1}】{2}\r\n",
                            historyMessage.CreateTime.ToShortTimeString(),
                            historyMessage.MsgType.ToString(),
                            (historyMessage is RequestMessageText)
                                ? (historyMessage as RequestMessageText).Content
                                : "[非文字类型]"
                            );
                    }
                    result.AppendLine("\r\n");
                }

                result.AppendFormat("如果您在{0}分钟内连续发送消息，记录将被自动保留（当前设置：最多记录{1}条）。过期后记录将会自动清除。\r\n",
                    WeixinContext.ExpireMinutes, WeixinContext.MaxRecordCount);
                result.AppendLine("\r\n");
                result.AppendLine(
                    "您还可以发送【位置】【图片】【语音】【视频】等类型的信息（注意是这几种类型，不是这几个文字），查看不同格式的回复。\r\nSDK官方地址：http://weixin.senparc.com");

                responseMessage.Content = result.ToString();
            }
            return responseMessage;
        }






        /// <summary>
        /// 处理事件请求（这个方法一般不用重写，这里仅作为示例出现。除非需要在判断具体Event类型以外对Event信息进行统一操作
        /// </summary>
        /// <param name="requestMessage"></param>
        /// <returns></returns>
        public override IResponseMessageBase OnEventRequest(IRequestMessageEventBase requestMessage)
        {
            var eventResponseMessage = base.OnEventRequest(requestMessage);//对于Event下属分类的重写方法，见：CustomerMessageHandler_Events.cs
            //TODO: 对Event信息进行统一操作
            return eventResponseMessage;
        }

        public override IResponseMessageBase DefaultResponseMessage(IRequestMessageBase requestMessage)
        {
            /* 所有没有被处理的消息会默认返回这里的结果，
            * 因此，如果想把整个微信请求委托出去（例如需要使用分布式或从其他服务器获取请求），
            * 只需要在这里统一发出委托请求，如：
            * var responseMessage = MessageAgent.RequestResponseMessage(agentUrl, agentToken, RequestDocument.ToString());
            * return responseMessage;
            */

            //todo:取数据库记录



            var responseMessage = this.CreateResponseMessage<ResponseMessageText>();
            responseMessage.Content = "谢谢来信，我们将及时回复";
            return responseMessage;
        }
    }

}
