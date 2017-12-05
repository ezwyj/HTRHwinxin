/**
 * 公用js文件
 */
define('common', ['jquery', 'tlayer'], function ($) {
    //导航栏选中
    $('#menu-' + OP_CONFIG.module + '-' + OP_CONFIG.page).addClass('active');

    //设置弹出框图片路径
    $.tLayer('global', { imgPath: OP_CONFIG.rootUrl + 'assets/img/', theme: 'blue' });
    
    //panel展开/收起
    $(document).on('click', '.panel[data-expand] .panel-heading', function () {
        var panel = $(this).parent();
        var expand = panel.attr('data-expand');

        panel.find('.panel-body').slideToggle('fast', function () {
            if (expand == 'Y') {
                panel.attr('data-expand', 'N');
            } else {
                panel.attr('data-expand', 'Y');
            }
        });
    });

    return $;
});