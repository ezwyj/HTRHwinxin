using Senparc.Weixin.MP.AdvancedAPIs;
using Senparc.Weixin.MP.AdvancedAPIs.QrCode;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace WEIXINSITE.Controllers
{
    public static class Units
    {
        private static string appId = ConfigurationManager.AppSettings["WeixinAppId"];
        private static string appSecret = ConfigurationManager.AppSettings["WeixinAppSecret"];
        private static string  GetPicture(string picUrl, string weixinId)
        {
            try
            {
                WebRequest request = WebRequest.Create(picUrl);
                WebResponse response = request.GetResponse();
                Stream reader = response.GetResponseStream();

                string fileName = weixinId + ".jpg";
                string savePath = HttpContext.Current.Request.MapPath("~/upFile/") + fileName;
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
        public static string  BuilderQrCode(string openid)
        {
            try
            {
                CreateQrCodeResult qrResult = Senparc.Weixin.MP.AdvancedAPIs.QrCodeApi.CreateByStr(appId, openid);
                string qrcodeUrl = QrCodeApi.GetShowQrCodeUrl(qrResult.ticket);

                string file= GetPicture(qrcodeUrl, openid);
                Senparc.Weixin.MP.AdvancedAPIs.Media.UploadTemporaryMediaResult mediaResult = new Senparc.Weixin.MP.AdvancedAPIs.Media.UploadTemporaryMediaResult();
                if (file != "error")
                {
                    var accessToken = Senparc.Weixin.MP.CommonAPIs.AccessTokenContainer.TryGetAccessToken(appId, appSecret);
                    mediaResult = Senparc.Weixin.MP.AdvancedAPIs.MediaApi.UploadTemporaryMedia(accessToken, Senparc.Weixin.MP.UploadMediaFileType.image, file);
                    return mediaResult.media_id;

                }
                return file;
            }
            catch (Exception e)
            {
                return e.Message;
            }
            
           
        }
    }
}