using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    public class UserValue
    {
        public int id { get; set; }

        public string weixnOpenId { get; set; }

        public int userValue { get; set; }

        public DateTime GetValueTime { get; set; }

        public int level { get; set;  }
        
    }
}