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

        public static bool InsertTX(UserApply tx,out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");
                db.Insert("UserApply", tx);


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


        public static bool AddNewUser(RegisterUserEntity userInfo,out string msg)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");

                if (!db.Exists<RegisterUserEntity>("weixinOpenId=@0", userInfo.weixinOpenId))
                {
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
        public static int GetLevel1Count(string openId)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");



                var sql = PetaPoco.Sql.Builder.Append("select count(*) from [RegUser] where OpenState=1 and tjr=@0", openId);
                int count = db.ExecuteScalar<int>(sql);

                db.CloseSharedConnection();
                return count;

            }
            catch (Exception e)
            {
                return -1;
            }
        }
        public static int  GetLevel2Count(string openId)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select count(*) from [RegUser] where OpenState=1 and  tjr in (select weixinOpenId from [RegUser] where tjr=@0)";
                int count = db.ExecuteScalar<int>(sql, openId);

                db.CloseSharedConnection();
                return count;

            }
            catch (Exception e)
            {
                return -1;
            }
        }

        public static int GetLevel0Count(string openId)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select count(*) from [RegUser] where OpenState=1 and weixinOpenId='" + openId + "'";
                int count = db.ExecuteScalar<int>(sql, openId);

                db.CloseSharedConnection();
                return count;

            }
            catch (Exception e)
            {
                return -1;
            }
        }

        public static List<RegisterUserEntity> GetLevel2User(string openId)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select * from [RegUser] where OpenState=1 and BindState=1 and InMoneyState=1 and SaleState=1 and  tjr in (select weixinOpenId from [RegUser] where tjr=@0)";
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql, openId);

                db.CloseSharedConnection();
                return list;

            }
            catch (Exception e)
            {
                return new List<RegisterUserEntity>();
            }
        }
        public static List<RegisterUserEntity> GetLevel0User(string openId)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select * from [RegUser] where OpenState=1 and BindState=1 and InMoneyState=1 and SaleState=1 and weixinOpenId='" + openId + "'";
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql, openId);

                db.CloseSharedConnection();
                return list;

            }
            catch (Exception e)
            {
                return new List<RegisterUserEntity>();
            }
        }
        public static List<RegisterUserEntity> GetLevel1User(string openId)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");



                var sql = PetaPoco.Sql.Builder.Append("select * from [RegUser] where OpenState=1 and BindState=1 and InMoneyState=1 and SaleState=1 and tjr=@0", openId);
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql);

                db.CloseSharedConnection();
                return list;

            }
            catch (Exception e)
            {
                return new List<RegisterUserEntity>();
            }
        }

        public static List<RegisterUserEntity> GetUserTree()
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select * from [RegUser] where tjr is null or tjr=''";
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql);

                db.CloseSharedConnection();
                return list;

            }
            catch (Exception e)
            {
                return new List<RegisterUserEntity>();
            }
        }
        public static List<RegisterUserEntity> GetUser(string name )
        {
           try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select * from [RegUser] ";
               if (name.Length>0) {
                   sql = sql + " where realName like '%"+name+"%' or nickName like '%"+ name + "%'";
               }
               sql = sql + " order by realname desc";
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

                retModel.Level0 = GetLevel0User(weixinId);
                retModel.Level1 = GetLevel1User(weixinId);
                retModel.Level2 = GetLevel2User(weixinId);

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

                msg = "OK";
                return UserRegInfo.QrCodeURL;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return null;
            }
        }

        internal static List<UserApply> GetApplyCash(string openid,out string msg)
        {
            //取得历史申请取现记录
            try
            {

                var db = new PetaPoco.Database("DefaultConnection");
                string sql = "select * from [UserApply] where weixinOpenId=@0";
                List<UserApply> UserApplyInfos = db.Fetch<UserApply>(sql, openid);


                db.CloseSharedConnection();

                msg = "";
                return UserApplyInfos;
            }
            catch (Exception e)
            {
                msg = e.Message;
                return null;
            }
            throw new NotImplementedException();
        }

        internal static List<RegisterUserEntity> GetUserTree(string parent)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select * from [RegUser] where tjr=@0";
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql,parent);

                db.CloseSharedConnection();
                return list;

            }
            catch (Exception e)
            {
                return new List<RegisterUserEntity>();
            }
        }



        internal static int GetUserCount()
        {

            var db = new PetaPoco.Database("DefaultConnection");


            string sql = "select count(*)+1 from [RegUser] ";
            int count = db.ExecuteScalar<int>(sql);

            db.CloseSharedConnection();
            return count;

        }

        internal static List<UserApply> GetUserApply(string keyword)
        {
            try
            {
                var db = new PetaPoco.Database("DefaultConnection");


                string sql = "select * from [UserApply] ";
                if (keyword.Length > 0)
                {
                    sql = sql + " where realName like '%" + keyword + "%' or phone like '%" + keyword + "%'";
                }
                sql = sql + " order by realname desc";
                List<UserApply> list = db.Fetch<UserApply>(sql);

                db.CloseSharedConnection();
                return list;

            }
            catch (Exception e)
            {
                return new List<UserApply>();
            }
        }

        internal static List<RegisterUserEntity> GetUserOrder()
        {
            try
            {
                List<RegisterUserEntity> retList = new List<RegisterUserEntity>();

                var db = new PetaPoco.Database("DefaultConnection");
                string sql = "select weixinOpenId,nickName,headImage from [RegUser] where OpenState=1 and BindState=1 and InMoneyState=1 and SaleState=1 ";
                List<RegisterUserEntity> list = db.Fetch<RegisterUserEntity>(sql);

                foreach (RegisterUserEntity item in list)
                {
                    item.MoneyOrder = DataService.GetLevel0User(item.weixinOpenId).Count * 30 + DataService.GetLevel1User(item.weixinOpenId).Count * 200 + DataService.GetLevel2User(item.weixinOpenId).Count * 30;
                }

                db.CloseSharedConnection();
                var query = from u in list orderby u.MoneyOrder descending select u;
                retList = query.ToList();
                return retList;

            }
            catch (Exception e)
            {
                return new List<RegisterUserEntity>();
            }
        }
    }
}