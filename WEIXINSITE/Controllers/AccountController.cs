using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WEIXINSITE.Entity;
using WEIXINSITE.Models;

namespace WEIXINSITE.Controllers
{
    public class AccountController : Controller
    {
        //
        // GET: /Account/
        public ActionResult Index()
        {
            string badge = HttpContext.User.Identity.Name;

            if (badge=="admin")
            {
                Response.Redirect("~/Account/Tree", true);
                return null;
            }

            return View();
        }

        public ActionResult Main()
        {
            return View();
        }

        public ActionResult Chart()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string username, string password)
        {
            Session.Clear();

            //System.Web.Security.FormsAuthentication.SetAuthCookie(username, true);
            //System.Web.Security.FormsAuthentication.RedirectFromLoginPage(username, false);
            //return null;

            if (!(string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password)))
            {
                string msg = string.Empty;
                bool result = false;


                result = username=="admin"&&password=="000000";

                if (result)
                {
                    System.Web.Security.FormsAuthentication.SetAuthCookie(username, true);
                    
                    Response.Redirect("/Account/Tree"); 
                    return null;
                }
                else
                {
                    msg = "用户名密码错误";
                    ViewBag.errorMsg = msg;
                }
            }
            else
            {
                ViewBag.errorMsg = "用户名、密码不能为空！";
                return View();
            }

            return View();

        }
        public ActionResult Logout()
        {
            Session.Clear();
            System.Web.Security.FormsAuthentication.SignOut();

            return new RedirectResult("~/Account/Login");
        }
        public ActionResult List()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Detial(string weixinOpenId)
        {
            string msg=string.Empty;
            return View(DataService.DataService.GetUserDetial(weixinOpenId,out msg));
        }
        [HttpPost]
        public JsonResult Detial(string weixinOpenId, string postData)
        {
            bool state = true;
            string msg = string.Empty;

            try
            {
                

                RegisterUserEntity userPost = Serializer.ToObject<RegisterUserEntity>(postData);
                RegisterUserEntity user = DataService.DataService.GetUserBaseDetail(weixinOpenId, out msg);

                user.OpenState = userPost.OpenState;
                user.BindState = userPost.BindState;
                user.InMoneyState = userPost.InMoneyState;
                user.SaleState = userPost.SaleState;

                state = DataService.DataService.UpdateUser(user,out msg);

            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }

            return new JsonResult { Data = new { state = state, msg = msg } };
        }

        public ActionResult Tree()
        {
            return View();
        }



        public FileResult ExportExcel()
        {
            var sbHtml = new StringBuilder();
            sbHtml.Append("<table border='1' cellspacing='0' cellpadding='0'>");
            sbHtml.Append("<tr>");
            var lstTitle = new List<string> { "昵称", "姓名", "电话", "一级下线数量","一级下线名称","二级下线数量","二级下线名称" };
            foreach (var item in lstTitle)
            {
                sbHtml.AppendFormat("<td style='font-size: 14px;text-align:center;background-color: #DCE0E2; font-weight:bold;' height='25'>{0}</td>", item);
            }
            sbHtml.Append("</tr>");

            List<RegisterUserEntity> users = DataService.DataService.GetUser();
            foreach(RegisterUserEntity user in users)
            {
                sbHtml.Append("<tr>");
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>", user.nickName);
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>", user.realName);
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>", user.phone);
                List<RegisterUserEntity> level0User =  DataService.DataService.GetLevel0User(user.weixinOpenId);
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>",level0User.Count  );
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>", string.Join(",",level0User.ToList()));
                List<RegisterUserEntity> level1User =  DataService.DataService.GetLevel1User(user.weixinOpenId);
                
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>",level1User.Count  );
                sbHtml.AppendFormat("<td style='font-size: 12px;height:20px;'>{0}</td>", string.Join(",", level1User.ToList()));
                 
                sbHtml.Append("</tr>");
            }
            sbHtml.Append("</table>");

            //第一种:使用FileContentResult
            byte[] fileContents = Encoding.UTF8.GetBytes(sbHtml.ToString());

            var fileStream = new MemoryStream(fileContents);
            return File(fileStream, "application/octet-stream", "fileStream.xls");


        }

        public JsonResult GetTreeNode(string pid)
        {
            bool state = true;
            string msg = string.Empty;
            int total = 0;
            List<RegisterUserEntity> List = null;
            List<zTreeNode> retUser = new List<zTreeNode>();
            try
            {
                if (string.IsNullOrEmpty(pid))
                {
                    pid = "";
                }
                List = DataService.DataService.GetUserTree(pid);
                foreach (var item in List)
                {
                    retUser.Add(new zTreeNode { name = item.nickName, pid = item.weixinOpenId, isParent = true, icon =item.headImage });
                }
               

                
                

            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { state = state, msg = msg, data = retUser, total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        public JsonResult GetUserModel(string weixinId)
        {
            bool state = true;
            string msg = string.Empty;
            int total = 0;
            UserModel retUser = null;
          
            try
            {
                retUser = DataService.DataService.GetUserDetial(weixinId, out msg);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { state = state, msg = msg, data = retUser, total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public JsonResult GetTree(string parent)
        {
            bool state = true;
            string msg = string.Empty;
            int total = 0;
            List<RegisterUserEntity> List = null;

            try
            {
                List = DataService.DataService.GetUserTree(parent);
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { state = state, msg = msg, data = List, total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public JsonResult GetList(int pageIndex=1, int pageSize=20, string type="", string keyword="")
        {
            bool state = true;
            string msg = string.Empty;
            int total = 0;
            List<RegisterUserEntity> List = null;

            try
            {
                
                List = DataService.DataService.GetUser();

                //switch (type)
                //{
                //    case "文件名":
                //        submitList = submitList.FindAll(a => a.MainFile.FileName.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) > -1);
                //        break;
                //    case "版本号":
                //        submitList = submitList.FindAll(a => a.ProjectCode.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) > -1);
                //        break;
                //    case "发起人":
                //        submitList = submitList.FindAll(a => a.Creator.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) > -1 || a.CreatorExp.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) > -1);
                //        break;
                //}

                total = List.Count;
                List = List.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
                
            }
            catch (Exception e)
            {
                state = false;
                msg = e.Message;
            }
            return new JsonResult { Data = new { state = state, msg = msg, data = List, total = total }, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
    }
}
