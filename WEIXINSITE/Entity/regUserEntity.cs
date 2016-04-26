using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WEIXINSITE.Controllers
{
    [PetaPoco.TableName("RegUser")]
    [PetaPoco.PrimaryKey("weixinOpenId")]
    public class regUserEntity
    {
        /// <summary>
        /// 设计：weixinOpen
        ///         
        /// 
        /// </summary>
        public string weixnOpenId { get; set; }
        public string nickName { get; set; }

        public string realName { get; set; }
        public string phone { get; set; }
        public DateTime regTime { get; set; }

        /// <summary>
        /// 身份证正面
        /// </summary>
        public string CardPicFront { get; set; }


        /// <summary>
        /// 身份证背面
        /// </summary>
        public string CardPicBackground { get; set; }
        /// <summary>
        /// 银行卡照片
        /// </summary>
        public string BankCard { get; set; }
    }
}
