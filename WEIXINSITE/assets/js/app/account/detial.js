define(['common', 'util', 'zTree', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;


    $('#submit').on('click', function (e) {
        $.confirm('确定保存吗？', function (result) {
            if (result) {
                
                var data = {
                    weixinOpenId: $('#weixinOpenId').val(),
                    OpenState:  $('#openState').is(':checked')?1:0 ,
                    BindState: $('#bindState').is(':checked')?1:0,
                    InMoneyState: $('#inMoneyState').is(':checked')?1:0,
                    SaleState: $('#saleState').is(':checked')?1:0
                }


                $.tLayer('close');
                $.loading('提交中，请稍后...');
                $.post(rootUrl + 'Account/Detial', {
                    weixinOpenId: data.weixinOpenId,
                    postData: JSON.stringify(data)
                }, function (res) {
                    $.tLayer('close');

                    if (res.state) {
                        $.tips('提交成功', 3, function () {
                            window.location = rootUrl + 'account/list';
                        });
                    } else {
                        $.tips('提交失败：' + res.msg);
                    }
                });
            }
        });
    });

    $('#submitTx').on('click', function (e) {


        $.confirm('确定保存吗？', function (result) {
            if (result) {

                var data = {
                    weixinOpenId: $('#weixinOpenId').val(),
                    CashValue: $('#cashRecord').val(),
                    phone:$('#phone').val(),
                    BankCard: $('#bank').val(),
                    Remark: $('#remark').val(),
                    UserApplyId:$('#UserApplyId').val(),
                    realName: $('#realName').val()
                }


                $.tLayer('close');
                $.loading('提交中，请稍后...');
                $.post(rootUrl + 'Account/SaveTx', {
                    weixinOpenId: data.weixinOpenId,
                    postData: JSON.stringify(data)
                }, function (res) {
                    $.tLayer('close');

                    if (res.state) {
                        $.tips('提交成功', 3, function () {
                            window.location = rootUrl + 'account/shengqingtx';
                        });
                    } else {
                        $.tips('提交失败：' + res.msg);
                    }
                });
            }
        });
    });
});