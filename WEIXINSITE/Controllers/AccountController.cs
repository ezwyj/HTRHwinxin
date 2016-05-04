using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WEIXINSITE.Entity;

namespace WEIXINSITE.Controllers
{
    public class AccountController : Controller
    {
        //
        // GET: /Account/

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult List()
        {
            return View();
        }

        public ActionResult Tree()
        {
            return View();
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
                    retUser.Add(new zTreeNode { name = item.nickName, pid = item.weixinOpenId, isParent = true, icon = "/UpFile/head_"+item.weixinOpenId+".jpg" });
                }
               

                
                

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
