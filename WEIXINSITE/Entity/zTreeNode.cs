using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEIXINSITE.Entity
{
    public class zTreeNode
    {
        public string name { get; set; }
        public string pid { get; set; }
        public List<zTreeNode> children { get; set; }
        public bool isParent { get; set; }

        public string icon { get; set; }
    }
}