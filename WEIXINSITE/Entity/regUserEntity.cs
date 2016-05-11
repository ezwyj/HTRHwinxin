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

        public string showId { get; set; }

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

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string tjr { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string tjrnickName { get; set; }

        public Int16 OpenState { get; set; }

        public Int16 BindState { get; set; }

        public Int16 InMoneyState { get; set; }

        public Int16 SaleState { get; set; }
    }
}
