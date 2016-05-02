using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.AdvancedAPIs.QrCode;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using WEIXINSITE.Entity;

namespace WEIXINSITE.Controllers
{
    public static class Units
    {
        private static string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private static string appSecret = ConfigurationManager.AppSettings["WeixinAppSecret"];
        //生成用户分享用二维码

        public static string GetPictureHead(string picUrl, string weixinId)
        {
            return GetPicture(picUrl, weixinId, "head");
        }

        public static string GetPictureQrCode(string picUrl, string weixinId)
        {
            return GetPicture(picUrl, weixinId, "qrcode");
        }
        private static string  GetPicture(string picUrl, string weixinId,string picType)
        {
            try
            {
                WebRequest request = WebRequest.Create(picUrl);
                WebResponse response = request.GetResponse();
                Stream reader = response.GetResponseStream();

                string fileName = weixinId + ".jpg";
                string savePath = HttpContext.Current.Request.MapPath("~/upFile/") +picType +"_" + fileName;
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
                return savePath;
            }
            catch
            {
                return "error";
            }


        }

       

        public static string BuildSharePicture(string weixinOpenId,out string msg)
        {
 
            try
            {
                Bitmap imgHard= new Bitmap(100,100);
                Bitmap imgQrCode ;
                if (File.Exists(HttpContext.Current.Server.MapPath("~/Upfile/head_") + weixinOpenId + ".jpg"))
                {
                  imgHard = (Bitmap)Image.FromFile(HttpContext.Current.Server.MapPath("~/Upfile/head_")+weixinOpenId+".jpg");
                }
                imgQrCode  = (Bitmap)Image.FromFile(HttpContext.Current.Server.MapPath("~/Upfile/qrcode_")+weixinOpenId+".jpg");
                msg = "";
                string fileName = HttpContext.Current.Server.MapPath("~/Upfile/user_") + weixinOpenId + ".jpg";
                Bitmap mybit = (Bitmap)Image.FromFile(HttpContext.Current.Server.MapPath("~/upfile/base.jpg"));
                using(Graphics g = Graphics.FromImage(mybit))
                {
                  //g.Clear(Color.White);
                    if (File.Exists(HttpContext.Current.Server.MapPath("~/Upfile/head_") + weixinOpenId + ".jpg")) g.DrawImage(imgHard, 29, 13, 95, 100);
                  g.DrawImage(imgQrCode, 150,500,180,187);
                }
                mybit.Save(fileName);
                return fileName;
            }
            catch
            {
                throw new Exception("生成图片错误");
            }
        }
        
    }
}