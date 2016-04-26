using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("UserValue")]
    public class UserValue
    {
        public int id { get; set; }

        public string weixinOpenId { get; set; }

        public int userValue { get; set; }

        public DateTime GetValueTime { get; set; }

        public int userLevel { get; set;  }
        
    }
}