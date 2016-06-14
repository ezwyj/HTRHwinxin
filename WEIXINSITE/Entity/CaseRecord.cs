using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("CaseRecord")]
    [PetaPoco.PrimaryKey("Id")]
    public class CaseRecord
    {
        public int Id { get; set; }
        public string phone { get; set; }
        public string weixinOpenId { get; set; }

        public string BankCard { get; set; }

        public float CashValue { get; set; }

        public string Remark { get; set; }

        [PetaPoco.Ignore]
        public string operateTimeExp
        {
            get { return OperateTime.ToString(); }
        }
        public DateTime OperateTime { get; set; }

        [PetaPoco.Ignore]
        public string UserApplyId { get; set; }
        public string realName { get; set; }
    }
}