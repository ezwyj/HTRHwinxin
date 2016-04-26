using Senparc.Weixin;
using Senparc.Weixin.Exceptions;
using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.AdvancedAPIs.OAuth;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
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
        private string appId = ConfigurationManager.AppSettings["TenPayV3_AppId"];
        private string secret = ConfigurationManager.AppSettings["TenPayV3_AppSecret"];

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
                retModel.WeixinUserInfo = userInfo;

                //var db=new PetaPoco.Database("DefaultConnection");

                //regUserEntity user = new regUserEntity();
                //user.weixnOpenId = userInfo.openid;
                //user.nickName = userInfo.nickname;


                

                //判断是否是首次
                //if(db.IsNew(user)){
                //        //注册用户
                //    //UserValue uv = new UserValue();
                //    //uv.
                //    db.Insert(user);
                //}
                     


                return View(retModel);
            }
            catch (ErrorJsonResultException ex)
            {
                return Content(ex.Message);
            }
        }

        public ActionResult New(int id)
        {
            return View();
        }

    }
}
