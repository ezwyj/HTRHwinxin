define(['common', 'util', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;

    $('#pendList').table({
        tableClass: 'table-condensed',
        url: rootUrl + 'Doc/GetPendList',
        resizable: false,
        paging: {
            enable: false
        },
        colOptions: [{
            name: '文件名称',
            field: 'MainFile',
            handler: function (value, data) {
                var icon = '';
                var createTime = new Date(data.CreateTimeExp).getTime();
                var now = new Date().getTime();
                var fileName = value.FileName + '.' + value.FileType;

                if (now - createTime < 259200000) {
                    icon = '<span class="file-state-icon"></span>';
                }

                return '<a href="' + rootUrl + 'Doc/Detail?instanceId=' + data.InstanceId + '" title="' + fileName + '">' +
                            '<span class="icon ' + util.getFileIcon(fileName) + '"></span>' +
                            '<span class="doc-item-text">' + fileName + '</span>' +
                        '</a>' + icon;
            }
        }, {
            width: 70,
            name: '项目概述',
            field: 'ProjectSummary',
            handler: function (value) {
                return '<span class="view-more" data-toggle="tooltip" data-placement="bottom" title="' + value + '">查看概述</span>';
            }
        }, {
            width: 120,
            name: '项目阶段',
            field: 'ProjectStageExp'
        }, {
            width: 180,
            name: '版本号',
            field: 'ProjectCode'
        }, {
            width: 110,
            name: '任务进度',
            field: 'NodeName'
        }, {
            width: 80,
            name: '创建时间',
            field: 'CreateTimeExp',
            handler: function (value) {
                return value.split(' ')[0];
            }
        }, {
            width: 70,
            name: '创建人',
            field: 'CreatorExp'
        }],
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

    var submitListTable = $('#submitList').table({
        tableClass: 'table-condensed',
        url: rootUrl + 'Doc/GetSubmitList',
        resizable: false,
        colOptions: [{
            name: '文件名称',
            field: 'MainFile',
            handler: function (value, data) {
                var fileName = value.FileName + '.' + value.FileType;

                return '<a href="' + rootUrl + 'Doc/Detail?instanceId=' + data.InstanceId + '" title="' + fileName + '">' +
                            '<span class="icon ' + util.getFileIcon(fileName) + '"></span>' +
                            '<span class="doc-item-text">' + fileName + '</span>' +
                        '</a>';
            }
        }, {
            width: 70,
            name: '项目概述',
            field: 'ProjectSummary',
            handler: function (value) {
                return '<span class="view-more" data-toggle="tooltip" data-placement="bottom" title="' + value + '">查看概述</span>';
            }
        }, {
            width: 120,
            name: '项目阶段',
            field: 'ProjectStageExp'
        }, {
            width: 180,
            name: '版本号',
            field: 'ProjectCode'
        }, {
            width: 110,
            name: '任务进度',
            field: 'NodeName'
        }, {
            width: 80,
            name: '创建时间',
            field: 'CreateTimeExp',
            handler: function (value) {
                return value.split(' ')[0];
            }
        }, {
            width: 70,
            name: '当前审批人',
            field: 'Approvers',
            handler: function (value) {
                return '<div class="text-ellipsis" title="' + value + '">' + value + '</div>';
            }
        }],
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

    var handleListTable = $('#handleList').table({
        tableClass: 'table-condensed',
        url: rootUrl + 'Doc/GetHandleList',
        resizable: false,
        colOptions: [{
            name: '文件名称',
            field: 'MainFile',
            handler: function (value, data) {
                var fileName = value.FileName + '.' + value.FileType;

                return '<a href="' + rootUrl + 'Doc/Detail?instanceId=' + data.InstanceId + '" title="' + fileName + '">' +
                            '<span class="icon ' + util.getFileIcon(fileName) + '"></span>' +
                            '<span class="doc-item-text">' + fileName + '</span>' +
                        '</a>';
            }
        }, {
            width: 70,
            name: '项目概述',
            field: 'ProjectSummary',
            handler: function (value) {
                return '<span class="view-more" data-toggle="tooltip" data-placement="bottom" title="' + value + '">查看概述</span>';
            }
        }, {
            width: 120,
            name: '项目阶段',
            field: 'ProjectStageExp'
        }, {
            width: 180,
            name: '版本号',
            field: 'ProjectCode'
        }, {
            width: 110,
            name: '任务进度',
            field: 'NodeName'
        }, {
            width: 80,
            name: '创建时间',
            field: 'CreateTimeExp',
            handler: function (value) {
                return value.split(' ')[0];
            }
        }, {
            width: 60,
            name: '创建人',
            field: 'CreatorExp'
        }, {
            width: 70,
            name: '当前审批人',
            field: 'Approvers',
            handler: function (value) {
                return '<div class="text-ellipsis" title="' + value + '">' + value + '</div>';
            }
        }],
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

    $('#searchSubmitList').on('keydown', function (e) {
        if (e.which == 13) {
            var type = $(this).parents('.search-widget').find('.dropdown-select').text();
            var keyword = $(this).val();

            submitListTable.table('reload', { type: type, keyword: keyword });
        }
    });

    $('#searchHandleList').on('keydown', function (e) {
        if (e.which == 13) {
            var type = $(this).parents('.search-widget').find('.dropdown-select').text();
            var keyword = $(this).val();

            handleListTable.table('reload', { type: type, keyword: keyword });
        }
    });
});