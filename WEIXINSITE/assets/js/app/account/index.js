require(['common', 'util', 'plugins', 'bootstrap', 'datepicker', 'selector'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;

    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        today: "今日",
        clear: "清除",
        format: "yyyy年mm月dd日",
        titleFormat: "yyyy年mm月",
        weekStart: 1
    };
    //////////////////////
    //页面初始化
    //////////////////////
    $('.datepicker').datepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: 'zh-CN'
    });
    var resultTable = $('#result-list').table({
        url: rootUrl + 'assets/js/data/defectList.js',
        dataField: null,
        data: function () {
            return {
                keyword: $('#keyword').val()
            };
        },
        paging: {
            enable: true,
            localPage: true,
            pageSize: 20
        },
        tableClass: 'table-condensed',
        colOptions: [{
            name: '序号',
            field: 'Id',
            width: 50,
            align: 'center'
        }, {
            name: '缺陷摘要',
            field: 'Summary',
            handler: function (value, data) {
                var stage = data.ApproveStage || 7;

                return '<a href="' + rootUrl + 'Home/Detail?approveStage=' + stage + '" target="_blank">' + value + '</a>';
            }
        }, {
            name: '缺陷等级',
            field: 'DefectLevel',
            width: 80
        }, {
            name: '缺陷分类',
            field: 'DefectType',
            width: 80
        }, {
            name: '缺陷状态',
            field: 'State',
            width: 80
        }, {
            name: '提交日期',
            field: 'Date',
            width: 90
        }, {
            name: '产品线',
            field: 'ProductLine',
            width: 70
        }, {
            name: '项目代码',
            field: 'ProjectCode',
            width: 80
        }, {
            name: '物品编码',
            field: 'Wpbm',
            width: 100
        }, {
            name: '物品型号',
            field: 'Wpxh',
            width: 150
        }, {
            name: '责任人',
            field: 'DutyPerson',
            width: 60
        }, {
            name: '责任部门',
            field: 'DutyDep',
            width: 100
        }, {
            name: '提交人',
            field: 'Creator',
            width: 60
        }]
    });

    //////////////////////
    //事件绑定
    //////////////////////
    $('#search-widget li').on('click', function (e) {
        $('#search-widget .dropdown-select').text($(this).text());

        e.preventDefault();
    });
    $('#query').on('click', function () {
        resultTable.table('reload');
    });

    //搜索项目
    $(document).on('click', '#searchProject', function () {
        searchProject();
    });

    //搜索项目
    $(document).on('keydown', '#keyword', function (e) {
        if (e.which == 13) {
            searchProject();
        }
    });


    //提交
    $('#submit-upload').on('click', function () {
        if (isPreApproveDoc()) {
            submitPreApproveDoc();
        } else {
            submitOtherDoc();
        }
    });



    //搜索项目
    function search() {
        var keyword = $('#keyword').val();
        var $tbody = $('#result-list tbody').empty();

        $('#projectPager').pager({
            url: rootUrl + 'Npi/SearchList',
            data: {
                keyword: keyword
            },
            pageInfo: true,
            success: function (res) {
                var data = res.data || [];
                var html = '';
                var checkHtml = '';

                for (var i = 0, l = data.length; i < l; i++) {
                    checkHtml = isPreApproveDoc() ? '<input type="radio" name="ProjectCodeRadio" />' : '<input type="checkbox" />';
                    html = '<tr data-code="' + data[i].ProjectCode + '">' +
                                '<td>' + checkHtml + '</td>' +
                                '<td>' + data[i].ProjectCode + '</td>' +
                                '<td>' + data[i].ProjectCodeAbbr + '</td>' +
                                '<td>' + data[i].ProjectName + '</td>' +
                                '<td>' + data[i].ProjectEndTime.split(' ')[0] + '</td>' +
                            '</tr>';

                    $(html).appendTo($tbody);
                }
            },
            resultVerify: function (res) {
                return {
                    state: res.state,
                    msg: res.msg
                }
            }
        });
    }
});