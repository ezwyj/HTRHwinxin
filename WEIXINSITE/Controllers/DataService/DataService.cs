using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WEIXINSITE.Entity;
using Senparc.Weixin.MP.Entities;
using Senparc.Weixin.MP.AdvancedAPIs.OAuth;
using Senparc.Weixin.MP.AdvancedAPIs.QrCode;
using System.Configuration;
using Senparc.Weixin.MP.CommonAPIs;
using System.Net;
using System.IO;
using Senparc.Weixin.MP.AdvancedAPIs;

namespace WEIXINSITE.Controllers.DataService
{
    public class DataService
    {
        private static string appId = ConfigurationManager.AppSettings["TenPayV3_AppId"];
        private static string secret = ConfigurationManager.AppSettings["TenPayV3_AppSecret"];




        public static string AddNewUser(OAuthUserInfo userInfo,string tjr)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");

                regUserEntity user = new regUserEntity();
                user.weixinOpenId = userInfo.openid;
                user.nickName = userInfo.nickname;
                user.regTime = DateTime.Now;
                user.tjr = tjr;

                if (!db.Exists<regUserEntity>("weixinOpenId=@0", user.weixinOpenId))
                {
                    //判断是否是首次

                    CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(AccessTokenContainer.TryGetAccessToken(appId, secret), userInfo.openid);
                    user.QrCodeURL = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);

                    //GetPicture(user.QrCodeURL, user.weixinOpenId);

                    db.Insert("RegUser", "weixinOpenId", user);
                }

                db.CloseSharedConnection();
                return "";

            }
            catch(Exception e){
                return e.Message;
            }
        }
               

    }
}