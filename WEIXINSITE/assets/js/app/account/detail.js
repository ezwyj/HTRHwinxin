require(['common', 'util', 'plugins', 'uploadify', 'datepicker'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;
    var instanceId = $('[name="InstanceId"]').val();
    //////////////////////
    //页面初始化
    //////////////////////
    //上传附件
    $('#uploadFile').uploadify({
        swf: rootUrl + 'assets/js/lib/uploadify.swf',
        uploader: rootUrl + 'Common/UploadFile'
    });

    //日起选择
    $('.datepicker').datepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: 'zh-CN'
    });

    //////////////////////
    //事件绑定
    //////////////////////

});