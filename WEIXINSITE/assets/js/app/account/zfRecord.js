define(['common', 'util', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;


    var resultTable = $('#List').table({
        tableClass: 'table-condensed',
        url: '../Account/GetTxRecordList',
        data: function () {
            return {

                keyword: $('#keyword').val(),

            };
        },
        resizable: false,
        colOptions: [{
            name: '真实姓名',
            field: 'realName',
            width: 100

        }, {
            name: '电话',
            field: 'phone',
            width: 100

        }, {
            name: '提现金额',
            width: 100,
            field: 'CashValue'
        }, {
            name: '操作时间',
            field: 'operateTimeExp',
            width: 220
        }, {
            name: '银行卡',
            field: 'BankCard',
            name: '备注',
            field: 'Remark'
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


    $('#query').on('click', function (e) {

        resultTable.table('reload');


    });
});