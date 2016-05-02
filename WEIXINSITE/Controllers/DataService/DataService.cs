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
using WEIXINSITE.Models;

namespace WEIXINSITE.Controllers.DataService
{
    public class DataService
    {
        private static string appId = ConfigurationManager.AppSettings["TenPayV3_AppId"];
        private static string secret = ConfigurationManager.AppSettings["TenPayV3_AppSecret"];

        public static string UpdateUserInfo(RegisterUserEntity user)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");
                if (db.Exists<RegisterUserEntity>("weixinOpenId=@0", user.weixinOpenId))
                {
                    user.regTime = DateTime.Now;
                    //db.Update( , "weixinOpenId", user);
                }


                db.CloseSharedConnection();
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        public static bool UpdateQrCode(string weixinOpenId,string qrCodeUrl, out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");
                db.Update("RegUser","weixinOpenId", new { QrCodeURL=qrCodeUrl },weixinOpenId);
                msg = "ok";
                return true;
                
            }
            catch (Exception e)
            {
                msg = e.Message;
                return true;
            }
        }
        public static bool ExistUserQrCode(string weixinOpenId, out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");

                if (db.Exists<RegisterUserEntity>("weixinOpenId=@0 and QrCodeURL is null", weixinOpenId))
                {
                    msg = "";
                    return true;
                }
                else
                {
                    msg = "";
                    return false;
                }
            }
            catch (Exception e)
            {
                msg = e.Message;
                return true;
            }
        }

        public static bool ExistUser(string weixinOpenId, out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");

                if (db.Exists<RegisterUserEntity>("weixinOpenId=@0", weixinOpenId))
                {
                    msg = "";
                    return true;
                }
                else
                {
                    msg = "";
                    return false;
                }
            }
            catch (Exception e)
            {
                msg = e.Message;
                return false;
            }
        }
        public static bool AddNewUser(RegisterUserEntity userInfo,string tjr,out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");

                if (!db.Exists<RegisterUserEntity>("weixinOpenId=@0", userInfo.weixinOpenId))
                {
                    userInfo.tjr = tjr;
                    db.Insert("RegUser", "weixinOpenId", userInfo);
                }

                db.CloseSharedConnection();
                msg = "";
                return true;

            }
            catch(Exception e){
                msg = e.Message;
                return false;
            }
        }



        public static List<RegisterUserEntity> GetUser()
        {
           try
            {
                var db = new PetaPoco.Database("DefaultConnection");

                
                string sql = "select * from [RegUser]";
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql);

                db.CloseSharedConnection();
                return list;

            }
            catch(Exception e){
                return new List<RegisterUserEntity>();
            }
        }
        public static bool UpdateUser(RegisterUserEntity user,out string  msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");
                db.BeginTransaction();
                db.Save("RegUser", "weixinOpenId", user);
                db.CompleteTransaction();
                db.CloseSharedConnection();
                msg="";
                return true;
            }
            catch(Exception e)
            {
                msg = e.Message;
                return false;
            }
        }
        public static bool UpdateUserInfo(RegisterUserEntity user, out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");
                db.BeginTransaction();
                //db.Update("articles", "article_id", new { title="New title" }, 123); 
                db.Update("RegUser", "weixinOpenId", new { realName = user.realName, phone = user.phone, cardPicFront = user.CardPicFront, cardPicBackground = user.CardPicBackground, bankCardPic = user.BankCardPic }, user.weixinOpenId);
                db.CompleteTransaction();
                db.CloseSharedConnection();
                msg = "";
                return true;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return false;
            }
        }
        public static RegisterUserEntity GetUserBaseDetail(string weixinId, out string msg)
        {
            try
            {

                var db = new PetaPoco.Database("DefaultConnection");
                string sql = "select * from [RegUser] where weixinOpenId=@0";
                RegisterUserEntity UserRegInfo = db.Single<RegisterUserEntity>(sql, weixinId);

                db.CloseSharedConnection();

                msg = "";
                return UserRegInfo;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return null;
            }
        }

        public static Models.UserModel GetUserDetial(string weixinId,out string msg)
        {
            try
            {
                UserModel retModel = new UserModel();
                var db = new PetaPoco.Database("DefaultConnection");
                string sql = "select * from [RegUser] where weixinOpenId=@0";
                RegisterUserEntity UserRegInfo = db.Single<RegisterUserEntity>(sql, weixinId);
                retModel.RegUser = UserRegInfo;

                db.CloseSharedConnection();

                msg = "";
                return retModel;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return null;
            }


        }


        internal static string GetUserQrCode(string weixinId,out string msg)
        {
            try
            {
               
                var db = new PetaPoco.Database("DefaultConnection");
                string sql = "select * from [RegUser] where weixinOpenId=@0";
                RegisterUserEntity UserRegInfo = db.Single<RegisterUserEntity>(sql, weixinId);
                

                db.CloseSharedConnection();

                msg = "";
                return UserRegInfo.QrCodeURL;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return null;
            }
        }
    }
}