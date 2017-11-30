using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WEIXINSITE.Entity
{
    [PetaPoco.TableName("RegUser")]
    public class RegisterUserEntity
    {
        /// <summary>
        /// 设计：weixinOpen
        ///         
        /// 
        /// </summary>
        public string weixinOpenId { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string nickName { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        
        public string headImage { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string realName { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string phone { get; set; }
        public DateTime regTime { get; set; }



        /// <summary>
        /// 身份证正面
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CardPicFront { get; set; }


        /// <summary>
        /// 身份证背面
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CardPicBackground { get; set; }
        /// <summary>
        /// 银行卡照片
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string BankCardPic { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string QrCodeURL { get; set; }

        
        public string tjr { get; set; }
        
        public string tjrnickName { get; set; }

      
    }
}
