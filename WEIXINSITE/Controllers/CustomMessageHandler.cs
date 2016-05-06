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
            var responseMessage = base.CreateResponseMessage<ResponseMessageText>();

           
            
            if (requestMessage.Content == "2")
            {
                var openResponseMessage = requestMessage.CreateResponseMessage<ResponseMessageNews>();
                openResponseMessage.Articles.Add(new Article()
                {
                    Title = "上海文交所简介",
                    Description = @"2009年6月15日，上海文化产权交易所正式揭牌，成为国内成立的首家文化产权交易所，是上海市人民政府批准设",
                    Url = "http://mp.weixin.qq.com/s?__biz=MzI3MjAwNjA0MA==&mid=504318861&idx=1&sn=ec0f280e0bab2ae8d6011e31866a1cd1#rd"
                });
                return openResponseMessage;
            }
            if (requestMessage.Content == "1")
            {
                var openResponseMessage = requestMessage.CreateResponseMessage<ResponseMessageNews>();
                openResponseMessage.Articles.Add(new Article()
                {
                    Title = "【上海文交所】百万奖金等你拿！",
                    Description = @"上海文交所委托我机构发展会员 特推出百万奖金等你拿活动。 只需要你有丰富的人脉和靠谱的执行力 诚邀你成为我司本项目战略合伙人。",
                    Url = "http://mp.weixin.qq.com/s?__biz=MzI3MjAwNjA0MA==&mid=504318804&idx=1&sn=9bc1414b70126318da08e6581ab95774#rd"
                });
                return openResponseMessage;
            }
            if (requestMessage.Content == "3")
            {
                responseMessage.Content =
                    @"点击进入<a href=""https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxff617bb17b7d884b&redirect_uri=http%3A%2F%2Fwww.deviceiot.top%2Fclient%2FopenAccount&response_type=code&scope=snsapi_userinfo&state=JeffreySu&connect_redirect=1#wechat_redirect"">“开户界面”</a>";
            }
            else
            {
                responseMessage.Content = "您好，感谢您关注汇通融合机构。邀请您参加目前火热开展的百万奖金等你拿活动。回复数字1了解 活动详情（回复活动规则链接）回复数字2 了解 上海文交所简介 回复数字3 我要开户";
            }
            
            return responseMessage;
        }



        public override IResponseMessageBase DefaultResponseMessage(IRequestMessageBase requestMessage)
        {
            var responseMessage = this.CreateResponseMessage<ResponseMessageText>();
            responseMessage.Content = "您好，感谢您关注汇通融合机构。邀请您参加目前火热开展的百万奖金等你拿活动。回复数字1了解 活动详情（回复活动规则链接）回复数字2 了解 上海文交所简介 回复数字3 我要开户";
            return responseMessage;
        }
    }

}
