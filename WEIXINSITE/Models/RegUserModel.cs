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

        public List<RegUserOpenAccountEntity> OpenAccounts { get; set; }

        public UserApply ApplyCashValue { get; set; }

        public List<UserApply> HistoryApplyCash { get; set; }

        public List<RegisterUserEntity> Level0 { get; set; }

        public List<RegisterUserEntity> Level1 { get; set; }

        public List<RegisterUserEntity> Level2 { get; set; }


       
    }
}