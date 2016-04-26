using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("UserOpenAccount")]
    [PetaPoco.PrimaryKey("Id")]
    public class RegUserOpenAccountEntity
    {
        public int Id { get; set; }
        /// <summary>
        /// 注册用户
        /// </summary>
        public string RegsisUserWeixinOpenId { get; set; }
        /// <summary>
        /// 目标开户机构
        /// </summary>
        public string OpenUnit { get; set; }

        public string OpenState { get; set; }
        /// <summary>
        /// 推荐人ID
        /// </summary>
        public string TJRID { get; set; }
    }
} 