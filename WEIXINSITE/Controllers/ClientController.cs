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
using System.Web.Configuration;
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

        private OAuthAccessTokenResult GetOAuthAccessTokenResult(string code, string state, out string msg)
        {
            if (string.IsNullOrEmpty(code))
            {
                msg = "no Code";
                return null ;
            }

            if (state != "JeffreySu")
            {
                //这里的state其实是会暴露给客户端的，验证能力很弱，这里只是演示一下
                //实际上可以存任何想传递的数据，比如用户ID，并且需要结合例如下面的Session["OAuthAccessToken"]进行验证
                msg = "no state";
                return null;
            }

            OAuthAccessTokenResult result = null;

            //通过，用code换取access_token
            try
            {
                result = OAuthApi.GetAccessToken(appId, secret, code);
            }
            catch (Exception ex)
            {
                msg = ex.Message;
                return null;
            }
            if (result.errcode != ReturnCode.请求成功)
            {
                msg = "错误：" + result.errmsg;
                return null;
            }
            //下面2个数据也可以自己封装成一个类，储存在数据库中（建议结合缓存）
            //如果可以确保安全，可以将access_token存入用户的cookie中，每一个人的access_token是不一样的
            Session["OAuthAccessTokenStartTime"] = DateTime.Now;
            Session["OAuthAccessToken"] = result;
            msg = "OK";
            return result;
        }

        public ActionResult Index(string code, string state)
        {
            
            string msg="OK";
            //因为第一步选择的是OAuthScope.snsapi_userinfo，这里可以进一步获取用户详细信息
            try
            {
                OAuthAccessTokenResult result = GetOAuthAccessTokenResult(code, state, out msg);
                OAuthUserInfo userInfo = OAuthApi.GetUserInfo(result.access_token, result.openid);

                UserModel retModel = new UserModel();
                retModel.WeixinUserInfo = userInfo;

                if (result != null)
                {

                    if (!DataService.DataService.ExistUser(result.openid, out msg))
                    {
                        ///添加用户
                        retModel.RegUser = new RegisterUserEntity();
                        retModel.RegUser.headImage = userInfo.headimgurl;
                        retModel.RegUser.nickName = userInfo.nickname;
                        retModel.RegUser.weixinOpenId = result.openid;
                        retModel.RegUser.OpenState = 0;
                        retModel.RegUser.SaleState = 0;
                        retModel.RegUser.InMoneyState = 0;
                        retModel.RegUser.BindState = 0;
                        retModel.RegUser.regTime = DateTime.Now;
                        retModel.WeixinUserInfo = userInfo;

                        bool stateAdd = DataService.DataService.AddNewUser(retModel.RegUser,  out msg);

                        Units.GetPictureHead(retModel.RegUser.headImage, retModel.WeixinUserInfo.openid);

                        CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, userInfo.openid);
                        retModel.RegUser.QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);
                        Units.GetPictureQrCode(retModel.RegUser.QrCodeURL, retModel.WeixinUserInfo.openid);

                        retModel.RegUser = DataService.DataService.GetUserBaseDetail(result.openid, out msg);
                    }
                    else
                    {
                        retModel = DataService.DataService.GetUserDetial(userInfo.openid, out msg);

                    }
                }
                ViewBag.Count = DataService.DataService.GetLevel0Count(userInfo.openid) + DataService.DataService.GetLevel1Count(userInfo.openid) + DataService.DataService.GetLevel2Count(userInfo.openid);
                ViewBag.ErrMsg = msg;
                ViewBag.AppId = appId;
                ViewBag.BaseUnit = WebConfigurationManager.AppSettings["baseUnit"];
                ViewBag.BaseUrl = WebConfigurationManager.AppSettings["baseUrl"];
                return View(retModel);
                
            }
            catch (ErrorJsonResultException ex)
            {
                ViewBag.Error = ex.Message;
                return Content(ex.Message);
            }
        }
       
        private bool SavePicture(string name,out string msg)
        {
            try
            {
                MemoryStream front = new MemoryStream();
                Senparc.Weixin.MP.AdvancedAPIs.MediaApi.Get(AccessTokenContainer.TryGetAccessToken(appId, secret), name, front);


                var accessToken = AccessTokenContainer.TryGetAccessToken(appId,secret);
                string fileName = name + ".jpg";
                string savePath = Server.MapPath("~/Download/") + fileName;
                FileStream writer = new FileStream(savePath, FileMode.OpenOrCreate, FileAccess.Write);
                front.WriteTo(writer);
                writer.Close();
                writer.Dispose();
                msg = string.Empty;
                return true;
            }
            catch(Exception e)
            {
                msg = e.Message;
                return false; 
            }
        }
        public ActionResult team(string openid)
        {
            UserModel retModel = new UserModel();

            retModel.Level1 = DataService.DataService.GetLevel1User(openid);
            retModel.Level2 = DataService.DataService.GetLevel2User(openid);


            return View(retModel);
        }

        public ActionResult perOpenAccount()
        {
            return View();
        }

        public ActionResult shenqingtx(string code, string state)
        {
            string msg = "";
            //因为第一步选择的是OAuthScope.snsapi_userinfo，这里可以进一步获取用户详细信息
            OAuthAccessTokenResult result = GetOAuthAccessTokenResult(code, state, out msg);
            OAuthUserInfo userInfo = OAuthApi.GetUserInfo(result.access_token, result.openid);

                UserModel retModel = new UserModel();
                retModel.WeixinUserInfo = userInfo;
                retModel.RegUser = DataService.DataService.GetUserBaseDetail(userInfo.openid, out msg);

                retModel.JsSdkPackage = JSSDKHelper.GetJsSdkUiPackage(appId, secret, Request.Url.AbsoluteUri);
                ViewBag.ErrMsg = msg;
                return View(retModel);

        }

        [HttpPost]
        public JsonResult shenqingtx(string dataJson)
        {
            string msg = string.Empty;
            bool state = false;
            //申请提现
            UserApply retModel = Serializer.ToObject<UserApply>(dataJson);
            retModel.ApplyTime = DateTime.Now;
            state = DataService.DataService.InsertTX(retModel, out msg);
            
            return new JsonResult { Data = new { state = state, msg = msg } };

        }


        [HttpPost]
        public JsonResult OpenAccount(string dataJson)
        {
            string msg = string.Empty;
            bool state = false;
            //存库和取图片
            UserModel retModel = Serializer.ToObject<UserModel>(dataJson);

            state = SavePicture(retModel.RegUser.CardPicFront,out msg);
            state = SavePicture(retModel.RegUser.CardPicBackground,out msg);
            state = SavePicture(retModel.RegUser.BankCardPic,out msg);


            state = DataService.DataService.UpdateUserInfo (retModel.RegUser, out msg);
            return new JsonResult { Data = new { state = state, msg = msg } };

        }

        public ActionResult OpenAccount(string code,string state)
        {
            string msg = "";
            //因为第一步选择的是OAuthScope.snsapi_userinfo，这里可以进一步获取用户详细信息
            try
            {
                OAuthAccessTokenResult result = GetOAuthAccessTokenResult(code, state, out msg);
                OAuthUserInfo userInfo = OAuthApi.GetUserInfo(result.access_token, result.openid);

                UserModel retModel = new UserModel();
                retModel.WeixinUserInfo = userInfo;

                if (result != null)
                {

                    if (!DataService.DataService.ExistUser(result.openid, out msg))
                    {
                        ///添加用户
                        retModel.RegUser = new RegisterUserEntity();
                        retModel.RegUser.headImage = userInfo.headimgurl;
                        retModel.RegUser.nickName = userInfo.nickname;
                        retModel.RegUser.weixinOpenId = result.openid;
                        retModel.RegUser.OpenState = 0;
                        retModel.RegUser.SaleState = 0;
                        retModel.RegUser.InMoneyState = 0;
                        retModel.RegUser.BindState = 0;
                        retModel.RegUser.regTime = DateTime.Now;
                        retModel.WeixinUserInfo = userInfo;

                        bool stateAdd = DataService.DataService.AddNewUser(retModel.RegUser,  out msg);

                        Units.GetPictureHead(retModel.RegUser.headImage, retModel.WeixinUserInfo.openid);

                        CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, userInfo.openid);
                        retModel.RegUser.QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);
                        Units.GetPictureQrCode(retModel.RegUser.QrCodeURL, retModel.WeixinUserInfo.openid);

                        retModel.RegUser = DataService.DataService.GetUserBaseDetail(result.openid, out msg);
                    }
                    else
                    {
                        retModel = DataService.DataService.GetUserDetial(userInfo.openid, out msg);
                    }
                }
                retModel.JsSdkPackage = JSSDKHelper.GetJsSdkUiPackage(appId, secret, Request.Url.AbsoluteUri);
                ViewBag.ErrMsg = msg;
                ViewBag.OpenAccountMessage = WebConfigurationManager.AppSettings["openAccountMessage"];
                return View(retModel);

            }
            catch (ErrorJsonResultException ex)
            {
                ViewBag.Error = ex.Message;
                return Content(ex.Message);
            }

        }

        public ActionResult Share()
        {
            var jssdkUiPackage = JSSDKHelper.GetJsSdkUiPackage(appId, secret, Request.Url.AbsoluteUri);
            ViewData["JsSdkUiPackage"] = jssdkUiPackage;
            ViewData["AppId"] = appId;
            ViewData["Timestamp"] = jssdkUiPackage.Timestamp;
            ViewData["NonceStr"] = jssdkUiPackage.NonceStr;
            ViewData["Signature"] = jssdkUiPackage.Signature;


            //取照片和信息

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
            string msg = string.Empty;
            string openid = "omNkGw8B26YHssM2Acwm_3GYjgjI";

            #region xxx
            //////通过扫描关注
            ////try
            ////{
            ////    Entity.RegisterUserEntity userinfo = new Entity.RegisterUserEntity();

            ////    userinfo.weixinOpenId = openid;
            ////    var user = Senparc.Weixin.MP.CommonAPIs.CommonApi.GetUserInfo(appId, openid);
            ////    userinfo.nickName = user.nickname;
            ////    userinfo.headImage = user.headimgurl;
            ////    userinfo.regTime = DateTime.Now;
            ////    bool state = false;
                
            ////    if (!string.IsNullOrEmpty(openid))
            ////    {
            ////        var userTJR = Senparc.Weixin.MP.CommonAPIs.CommonApi.GetUserInfo(appId, "omNkGw63zJaKGM1B8bI9LIoVsnv8");

            ////        bool haveUser = DataService.DataService.ExistUser(openid, out msg);
            ////        if (!haveUser)
            ////        {
            ////            state = DataService.DataService.AddNewUser(userinfo, "omNkGw63zJaKGM1B8bI9LIoVsnv8", out msg);
            ////            CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, userinfo.weixinOpenId);
            ////            string QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);
            ////            Units.GetPictureQrCode(QrCodeURL, openid);
            ////            Units.GetPictureHead(user.headimgurl, user.openid);
            ////        }
            ////        //responseMessage.Content = string.Format(Subscribe, userinfo.nickName, userTJR.nickname);

            ////    }
            ////    else
            ////    {
            ////        bool haveUser = DataService.DataService.ExistUser(openid, out msg);
            ////        if (string.IsNullOrEmpty(msg))
            ////        {
            ////            //responseMessage.Content = msg;
            ////        }
            ////        if (!haveUser)
            ////        {
            ////            state = DataService.DataService.AddNewUser(userinfo, "", out msg);
            ////            CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, userinfo.weixinOpenId);
            ////            string QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);
            ////            Units.GetPictureQrCode(QrCodeURL, openid);
            ////        }
            ////        //responseMessage.Content = string.Format(Subscribe, userinfo.nickName, "");
            ////    }

            ////    //Senparc.Weixin.MP.AdvancedAPIs.CustomApi.SendText(appId,requestMessage.FromUserName, "关注者为");

            ////}
            ////catch (Exception e)
            ////{
            ////    //responseMessage.Content = e.Message;
            ////}
            ////Units.BuildSharePicture(openid, "军222", out msg);
            #endregion

            //因为第一步选择的是OAuthScope.snsapi_userinfo，这里可以进一步获取用户详细信息

                
                var userInfo = Senparc.Weixin.MP.CommonAPIs.CommonApi.GetUserInfo(appId,openid);
                OAuthUserInfo oUser = new OAuthUserInfo();
                oUser.openid = userInfo.openid;
                oUser.nickname = userInfo.nickname;
                oUser.headimgurl = userInfo.headimgurl;

                UserModel retModel = new UserModel();

                
                retModel.WeixinUserInfo = oUser;

                if (oUser != null)
                {

                    if (!DataService.DataService.ExistUser(oUser.openid, out msg))
                    {
                        ///添加用户
                        retModel.RegUser = new RegisterUserEntity();
                        retModel.RegUser.headImage = userInfo.headimgurl;
                        retModel.RegUser.nickName = userInfo.nickname;
                        retModel.RegUser.weixinOpenId = oUser.openid;
                        retModel.RegUser.OpenState = 0;
                        retModel.RegUser.SaleState = 0;
                        retModel.RegUser.InMoneyState = 0;
                        retModel.RegUser.BindState = 0;
                        retModel.RegUser.regTime = DateTime.Now;
                        retModel.WeixinUserInfo = oUser;

                        bool stateAdd = DataService.DataService.AddNewUser(retModel.RegUser, out msg);

                        Units.GetPictureHead(retModel.RegUser.headImage, retModel.WeixinUserInfo.openid);

                        CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, userInfo.openid);
                        retModel.RegUser.QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);
                        Units.GetPictureQrCode(retModel.RegUser.QrCodeURL, retModel.WeixinUserInfo.openid);

                        retModel.RegUser = DataService.DataService.GetUserBaseDetail(oUser.openid, out msg);
                    }
                    else
                    {
                        retModel = DataService.DataService.GetUserDetial(userInfo.openid, out msg);
                    }
                }
                ViewBag.ErrMsg = msg;
                return View(retModel);
            return View();
            
        }

        [HttpPost]
        public JsonResult Debug(string dataJson)
        {
            string msg = string.Empty;
            bool state = false;
            //存库和取图片
            UserModel retModel = Serializer.ToObject<UserModel>(dataJson);
            state = SavePicture(retModel.RegUser.CardPicFront,out msg);
            if (state)
            {
                state = DataService.DataService.UpdateUser(retModel.RegUser, out msg);
            }

            
            return new JsonResult { Data = new { state = state, msg = msg } };
            
        }

    }
}
