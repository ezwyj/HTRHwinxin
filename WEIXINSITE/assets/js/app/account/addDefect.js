require(['common', 'util', 'plugins', 'uploadify'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;

    //////////////////////
    //页面初始化
    //////////////////////
    //上传附件
    $('#uploadFile').uploadify({
        swf: rootUrl + 'assets/js/lib/uploadify.swf',
        uploader: rootUrl + 'Common/UploadFile'
    });

    //////////////////////
    //事件绑定
    //////////////////////

});