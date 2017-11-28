using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("Record")]
    [PetaPoco.PrimaryKey("Id")]
    public class Record
    {
        public int Id { get; set; }
        public string Phone { get; set; }
        public string WeixinOpenId { get; set; }

        public DateTime InputTime { get; set; }

        public string Name { get; set; }

        public DateTime Birthday { get; set; }

        [PetaPoco.Ignore]
        public string InputTimeExp
        {
            get { return InputTime.ToString(); }
        }
      
    }
}