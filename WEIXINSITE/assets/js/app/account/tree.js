define(['common', 'util', 'zTree', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;

    var setting = {
        async: {
            enable: true,
            url: "GetTreeNode",
            autoParam: ["id", "pid", "level=lv"],
            dataFilter: filter
        },
        callback: {
            //beforeAsync: beforeAsync,
            //onAsyncSuccess: onAsyncSuccess,
            //onAsyncError: onAsyncError,
            onClick: onClick
        }
    };

    $(document).ready(function () {
        
        $.fn.zTree.init($("#treeDemo"), setting);

    });

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;

        return childNodes.data;
    }

    function onClick(event, treeId, treeNode) {
        $.get('GetUserModel?weixinId=' + treeNode.pid, function (res) {
            if (res.state) {
                var userModel = res.data;

                $('#nickName').val(userModel.RegUser.nickName);
                $('#realName').val(userModel.RegUser.realName)
                $('#phone').val(userModel.RegUser.phone);

                if (userModel.RegUser.OpenState == 1) { $('#openState').attr("checked", "checked"); } else { $('#openState').attr("checked", false); }
                if (userModel.RegUser.BindState == 1) { $('#bindState').attr("checked", "checked"); } else { $('#bindState').attr("checked", false);}
                if (userModel.RegUser.InMoneyState == 1) { $('#inMoneyState').attr("checked", "checked"); } else { $('#inMoneyState').attr("checked", false); }
                if (userModel.RegUser.SaleState == 1) { $('#saleState').attr("checked", "checked"); } else { $('#saleState').attr("checked", false) };

                if (userModel.RegUser.CardPicFront != null) {
                    picurl = "../Download/" + userModel.RegUser.CardPicFront + ".jpg";
                    $('#cardpicfronturl').attr("href", picurl);
                    $('#cardpicfrontimg').attr("src", picurl);
                }
                else
                {
                    $('#cardpicfronturl').attr("href", "");
                    $('#cardpicfrontimg').attr("src", "");
                }
                if (userModel.RegUser.BankCardPic != null) {

                    picurl = "../Download/" + userModel.RegUser.BankCardPic + ".jpg";
                    $('#BankCardPicurl').attr("href", picurl);
                    $('#BankCardPicimg').attr("src", picurl);
                }
                else
                {
                    $('#BankCardPicurl').attr("href", "");
                    $('#BankCardPicimg').attr("src", "");
                }
            } else {
                $.tips(res.msg, 0);
            }
        });
    };

});