define(['common', 'util', 'zTree', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;


    var resultTable = $('#List').table({
        tableClass: 'table-condensed',
        url: '../Account/GetList',
        data: function () {
            return {

                keyword: $('#keyword').val(),

            };
        },
        resizable: false,
        colOptions: [{
            name: '昵称',
            field: 'nickName',
            width: 200

        }, {
            name: '姓名',
            field: 'realName',
            width: 200

        }, {
            name: '电话',
            field: 'phone',
            width: 120
        }, {
            name: '身份证正面',
            field: '',
            width: 120,
            handler: function (value, data) {
                picurl = "../Download/" + data.CardPicFront + ".jpg";
                return '<a href=' + picurl + '  target="_blank"> <img src=' + picurl + ' width=90 height=30/></a>';
            }
        }, {
            name: '身份证背面',
            field: 'State',
            width: 120,
            handler: function (value, data) {
                picurl = "../Download/" + data.CardPicBackground + ".jpg";
                return '<a href=' + picurl + '  target="_blank"> <img src=' + picurl + ' width=90 height=30/></a>';
            }
        }, {
            name: '银行正面',
            field: 'createtime',
            width: 120,
            handler: function (value, data) {
                picurl = "../Download/" + data.BankCardPic + ".jpg";
                return '<a href=' + picurl + ' target="_blank"> <img src=' + picurl + ' width=90 height=30/></a>';
            }
        }, {
            name: '推荐人',
            field: 'tjrnickName',
            width: 190
        },
        {
            name: '操作',
            field: 'weixinOpenId',
             handler: function (value, data) {
                return '<a href="' + rootUrl + 'account/Detial?weixinOpenId=' + data.weixinOpenId + '">操作</a>';
            }
        }
        ],
        onInit: function () {
            $('[data-toggle="tooltip"]').tooltip({
                html: true
            });
        },
        resultVerify: function (res) {
            return {
                state: res.state,
                msg: res.msg
            }
        }
    });

    $('#export').on('click', function (e) {

        window.open('ExportExcel', 'newwindow', 'height=400,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')


    });

    $('#query').on('click', function (e) {

        resultTable.table('reload');


    });
});