/**
 * 选择器js文件
 */
define('selector', ['jquery', 'tlayer'], function ($) {
    var options = {
        SinglePeople: {
            width: 880,
            height: 480,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/SinglePeople',
            title: '选择单人',
            callback: 'SinglePeopleCallback'
        },
        MultiPeople: {
            width: 880,
            height: 480,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/MultiPeople',
            title: '选择多人',
            callback: 'MultiPeopleCallback'
        },
        SingleDep: {
            width: 430,
            height: 380,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/SingleDep',
            title: '选择单部门',
            callback: 'SingleDepCallback'
        },
        MultiDep: {
            width: 780,
            height: 410,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/MultiDep',
            title: '选择多部门',
            callback: 'MultiDepCallback'
        },
        SingleJob: {
            width: 430,
            height: 380,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/SingleJob',
            title: '选择单职位',
            callback: 'SingleJobCallback'
        },
        MultiJob: {
            width: 780,
            height: 410,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/MultiJob',
            title: '选择多职位',
            callback: 'MultiJobCallback'
        },
        SingleJobList: {
            width: 780,
            height: 410,
            src: 'http://eipdev.maipu.com/MpSelector/Selector/SingleJobList',
            title: '选择单职位',
            callback: 'SingleJobListCallback'
        }
    };
    var targetInput;

    $('[data-selector] .btn').click(function () {
        var type = $(this).parents('.input-group').data('selector');
        var option = options[type];

        if (option) {
            var src = option.src + '?proxyPage=' + encodeURIComponent(OP_CONFIG.proxyUrl + 'Common/ProxyPage?callback=' + option.callback);

            targetInput = $(this).parent().prev();

            $.content({
                header: option.title,
                content: {
                    width: option.width,
                    height: option.height,
                    src: src
                }
            });
        }        
    });

    window.SinglePeopleCallback = function (data) {
        $.tLayer('close');
        targetInput.val(data.Name).data('data', data);
    }

    window.SingleDepCallback = function (data) {
        $.tLayer('close');
        targetInput.val(data.DepName).data('data', data);
    }
});