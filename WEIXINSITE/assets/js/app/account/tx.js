define(['common', 'util',  'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;


    var resultTable = $('#List').table({
        tableClass: 'table-condensed',
        url: '../Account/GetTxList',
        data: function () {
            return {

                keyword: $('#keyword').val(),

            };
        },
        resizable: false,
        colOptions: [{
            name: '真实姓名',
            field: 'RealName',
            width: 300

        }, {
            name: '电话',
            field: 'phone',
            width: 300

        }, {
            name: '提现金额',
            field: 'CaseValue'
        }, {
            name: '申请时间',
            field: 'ApplyTimeExp',
            width: 220
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