using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace WEIXINSITE
{
    /// <summary>
    /// HandlerUpload 的摘要说明
    /// </summary>
    public class HandlerUpload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            HttpFileCollection files = context.Request.Files;
            string msg = string.Empty;
            string error = string.Empty;
            string imgurl;
            if (files.Count > 0)
            {
                files[0].SaveAs(context.Server.MapPath("/upFile/") + System.IO.Path.GetFileName(files[0].FileName));
                msg = " 成功! 文件大小为:" + files[0].ContentLength;
                imgurl = "/" + files[0].FileName;
                string res = "{ error:'" + error + "', msg:'" + msg + "',imgurl:'" + imgurl + "'}";
                context.Response.Write(res);
                context.Response.End();
            }

        }
        

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        
    }
}