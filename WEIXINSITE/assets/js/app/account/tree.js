﻿define(['common', 'util', 'zTree', 'plugins', 'bootstrap'], function ($, util) {
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
    var timer;

    function getScroll() {
        var bodyTop = 0;
        if (typeof window.pageYOffset != 'undefined') {
            bodyTop = window.pageYOffset;
        } else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
            bodyTop = document.documentElement.scrollTop;
        }
        else if (typeof document.body != 'undefined') {
            bodyTop = document.body.scrollTop;
        }
        return bodyTop
    }



    $(document).ready(function () {
        
        $.fn.zTree.init($("#treeDemo"), setting);
        $(window).scroll(function () {
            clearInterval(timer);
            var topScroll = getScroll();
            var topDiv = "200px";
            var top = topScroll + parseInt(topDiv);
            timer = setInterval(function () {
                //$(".test").css("top", top+"px");
                $(".panel-info").animate({ "top": top }, 200);
            }, 200)
        })
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
          
                for(var i=0;i<userModel.Level1.length;i++){
                    $('#myTabContentLevel1').append('<li>'+userModel.Level1[i].nickName+'</li>');
                }
                for (var i = 0; i < userModel.Level2.length; i++) {
                    $('#myTabContentLevel2').append('<li>' + userModel.Level2[i].nickName + '</li>');
                }
            } else {
                $.tips(res.msg, 0);
            }
        });
    };

});