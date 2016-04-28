using PetaPoco;
using Senparc.Weixin;
using Senparc.Weixin.Exceptions;
using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.AdvancedAPIs.OAuth;
using Senparc.Weixin.MP.AdvancedAPIs.QrCode;
using Senparc.Weixin.MP.CommonAPIs;
using Senparc.Weixin.MP.Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WEIXINSITE.Entity;
using WEIXINSITE.Models;

namespace WEIXINSITE.Controllers
{
    public class ClientController : Controller
    {
        //
        // GET: /Client/
        private string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private string secret = ConfigurationManager.AppSettings["WeixinAppSecret"];

      

        public ActionResult Index(string code, string state)
        {
            if (string.IsNullOrEmpty(code))
            {
                return Content("您拒绝了授权！");
            }

            if (state != "JeffreySu")
            {
                //这里的state其实是会暴露给客户端的，验证能力很弱，这里只是演示一下
                //实际上可以存任何想传递的数据，比如用户ID，并且需要结合例如下面的Session["OAuthAccessToken"]进行验证
                return Content("验证失败！请从正规途径进入！");
            }

            OAuthAccessTokenResult result = null;

            //通过，用code换取access_token
            try
            {
                result = OAuthApi.GetAccessToken(appId, secret, code);
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
            if (result.errcode != ReturnCode.请求成功)
            {
                return Content("错误：" + result.errmsg);
            }
            //下面2个数据也可以自己封装成一个类，储存在数据库中（建议结合缓存）
            //如果可以确保安全，可以将access_token存入用户的cookie中，每一个人的access_token是不一样的
            Session["OAuthAccessTokenStartTime"] = DateTime.Now;
            Session["OAuthAccessToken"] = result;

            //因为第一步选择的是OAuthScope.snsapi_userinfo，这里可以进一步获取用户详细信息
            try
            {
                OAuthUserInfo userInfo = OAuthApi.GetUserInfo(result.access_token, result.openid);

                

                RegUserModel retModel = new RegUserModel();
                retModel.RegUser = new regUserEntity();
                retModel.WeixinUserInfo = userInfo;


                var db = new PetaPoco.Database("DefaultConnection");

                regUserEntity user = new regUserEntity();
                user.weixinOpenId = userInfo.openid;
                user.nickName = userInfo.nickname;
                user.regTime = DateTime.Now;


                if (!db.Exists<regUserEntity>("weixinOpenId='{0}'", user.weixinOpenId))
                {
                    //判断是否是首次

                    //CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, userInfo.openid);
                    //retModel.RegUser.QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);

                    //GetPicture(retModel.RegUser.QrCodeURL, retModel.WeixinUserInfo.openid);

                    db.Insert("RegUser", "weixinOpenId", user);
                }
                else
                {
                    Sql sqlOpen=Sql.Builder;
                    sqlOpen.Select("*").From("UserOpenAccount").Where("RegsisUserWeixinOpenId='{0}'",user.weixinOpenId);

                    List<RegUserOpenAccountEntity> openAccount = db.Fetch<RegUserOpenAccountEntity>(sqlOpen);

                    retModel.OpenAccounts = openAccount;

                    Sql sqlValue = Sql.Builder;
                    sqlValue.Select("*").From("UserValue").Where("",user.weixinOpenId);

                    List<UserValueEntity> userValue = db.Fetch<UserValueEntity>(sqlValue);

                    retModel.UserValue = userValue;
                }

                    


                return View(retModel);
            }
            catch (ErrorJsonResultException ex)
            {
                ViewBag.Error = ex.Message;
                return Content(ex.Message);
            }
        }
        private bool GetPicture(string picUrl,string weixinId)
        {
            try
            {
                WebRequest request = WebRequest.Create(picUrl);
                WebResponse response = request.GetResponse();
                Stream reader = response.GetResponseStream();
                
                string fileName = weixinId + ".jpg";
                string savePath = Server.MapPath("~/Download/") + fileName ;
                FileStream writer = new FileStream(savePath, FileMode.OpenOrCreate, FileAccess.Write);
                byte[] buff = new byte[512];
                int c = 0; //实际读取的字节数
                while ((c = reader.Read(buff, 0, buff.Length)) > 0)
                {
                    writer.Write(buff, 0, c);
                }
                writer.Close();
                writer.Dispose();

                reader.Close();
                reader.Dispose();
                response.Close();
                return true;
            }
            catch
            {
                return false;
            }

           
        }

        public ActionResult Test()
        {
            var jssdkUiPackage = JSSDKHelper.GetJsSdkUiPackage(appId, secret, Request.Url.AbsoluteUri);
            ViewData["JsSdkUiPackage"] = jssdkUiPackage;
            ViewData["AppId"] = appId;
            ViewData["Timestamp"] = jssdkUiPackage.Timestamp;
            ViewData["NonceStr"] = jssdkUiPackage.NonceStr;
            ViewData["Signature"] = jssdkUiPackage.Signature;

            return View(jssdkUiPackage);
        }

        public ActionResult TestQrCode()
        {
            CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, "omNkGw-0KdSriLortK49vKBQi6tw");
            ViewBag.Pic =  QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);
            return View();
        }

        public ActionResult Debug()
        {
           

            return View();
        }

    }
}
