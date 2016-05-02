using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("Config")]
    [PetaPoco.PrimaryKey("Id")]
    public class ConfigEntity
    {
        public int Id { get; set; }
        public string ItemKey { get; set; }
        public string ItemValue { get; set; }
    }
}