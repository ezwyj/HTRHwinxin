using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WEIXINSITE.Entity;


namespace WEIXINSITE.Models
{
    public class UserModel
    {
        public Senparc.Weixin.MP.AdvancedAPIs.OAuth.OAuthUserInfo WeixinUserInfo { get; set; }

        public Senparc.Weixin.MP.Helpers.JsSdkUiPackage JsSdkPackage { get; set; }
        public RegisterUserEntity RegUser { get; set; }




       
    }
}