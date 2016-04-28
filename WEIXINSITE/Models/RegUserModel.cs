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
        public RegisterUserEntity RegUser { get; set; }

        public List<RegUserOpenAccountEntity> OpenAccounts { get; set; }

        public List<UserValueEntity> UserValue { get; set; }
    }
}