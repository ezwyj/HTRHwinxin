using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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

        public JsonResult GetList()
        {
            return new JsonResult { Data = new { state = 's', msg = 'b' } };
        }
    }
}
