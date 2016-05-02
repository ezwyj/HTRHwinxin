using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("UserApply")]
    [PetaPoco.PrimaryKey("Id")]
    public class UserApply
    {
        public int Id { get; set; }
        public string WeixinOpenId { get; set; }

        public string RealName { get; set; }

        public DateTime ApplyTime { get; set; }

        public float CaseValue { get; set;  }
    }
}