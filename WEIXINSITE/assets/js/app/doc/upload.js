define(['common', 'util', 'uploadify', 'zTree', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;
    var isEdit = OP_CONFIG.isEdit;
    var preCatalogId = OP_CONFIG.preCatalogId;
    var otherCatalogId = OP_CONFIG.otherCatalogId;

    //ztree设置
    var zSettings = {
        async: {
            enable: true,
            type: 'get',
            url: rootUrl + 'Doc/GetChildCatalogList',
            autoParam: ['Id=parentCatId'],
            dataFilter: function (treeId, parentNode, res) {
                var data;

                if (res.state) {
                    //将预审文档也其他文档分开选择
                    if (!parentNode.ParentId) {
                        res.data.forEach(function (item) {
                            if ((isPreApproveDoc() && item.Id == preCatalogId) ||
                                (!isPreApproveDoc() && item.Id == otherCatalogId)) {
                                item.nocheck = true;
                                data = [item];
                                return false;
                            }
                        });
                    } else {
                        data = res.data;
                    }
                } else {
                    $.tips(res.msg, 0);
                    data = [];
                }

                return data;
            }
        },
        data: {
            simpleData: {
                enable: true,
                idKey: 'Id',
                pIdKey: 'ParentId'
            },
            key: {
                name: 'Name'
            }
        },
        check: {
            enable: true,
            chkStyle: 'radio',
            radioType: 'all'
        }
    };

    var uploadOpt = {
        swf: rootUrl + 'assets/js/lib/uploadify.swf',
        uploader: rootUrl + 'Common/UploadFile',
        fileSizeLimit: '100 MB',
        onSelect: function (file) {
            var queue = $('#' + this.settings.queueID);
            var html = '<div id="#{fileId}" class="uploadify-queue-item">' +
                            '<span class="icon #{fileIcon}"></span>' +
                            '<span class="file-name" title="#{fileName}">#{fileName}</span>' +
                            '<div class="uploadify-progress">' +
                                '<div class="uploadify-progress-bar">&nbsp;</div>' +
                            '</div>' +
                            '<span class="data">Waiting</span>' +
                        '</div>';

            var fileData = {
                fileId: file.id,
                fileName: file.name,
                fileIcon: util.getFileIcon(file.name)
            }

            if (this.settings.id == 'select-mainfile') {
                queue.empty();
            }

            queue.append(util.parseTpl(html, fileData));
        },
        onUploadSuccess: function (file, res) {
            res = JSON.parse(res);

            if (res.state) {
                var fileInfo = res.data[0];
                var html = '<div id="#{fileId}" class="finish-queue-item" data-filepath="#{filePath}" data-filename="#{fileName}">' +
                                '<span class="icon #{fileIcon}"></span>' +
                                '<span class="file-name" title="#{fileName}">#{fileName}</span>' +
                                '<span class="file-size">#{fileSize}</span>' +
                                '<a class="file-operate file-del" href="#">删除</a>' +
                            '</div>';
                var fileData = {
                    filePath: fileInfo.FileAddress,
                    fileId: file.id,
                    fileIcon: util.getFileIcon(file.name),
                    fileName: fileInfo.FileName,
                    fileSize: util.getFileSize(file.size)
                }

                $('#' + file.id).replaceWith(util.parseTpl(html, fileData));

                //删除
                $('#' + file.id).on('click', '.file-del', function () {
                    $('#' + file.id).remove();
                    return false;
                });
            } else {
                $('#' + file.id).addClass('error-queue-item');
                $('#' + file.id).find('.uploadify-progress, .data').remove();
                $('#' + file.id).append('<span class="error-msg">' + res.msg + '</span>');
            }
        }
    }

    //主文件
    var mainfileOpt = $.extend(true, {}, uploadOpt, {
        multi: false,
        uploadDesc: '<span style="color: red;">（主文件只能包含一个文件，且文件不能超过100MB）</span>'
    });
    $('#select-mainfile').uploadify(mainfileOpt);

    //附件
    var attachmentOpt = $.extend(true, {}, uploadOpt, {
        uploadDesc: '<span style="color: red;">（附件可以包含多个文件，每个文件不能超过100MB）</span>'
    });
    $('#select-attachment').uploadify(attachmentOpt);

    //根据文档类型决定上传字段
    $('[name="DocType"]').on('change', function () {
        var val = $(this).val();

        $('[class*="DocType-"]').hide();
        $('.DocType-' + val).show();

        $('.upload-select-result').html('');
        $('[name="ProjectCode"]').val('');
        $('[name="SourceSolution"]').val('');
        $('[name="Catalog"]').val('');
    });

    //选择版本号
    $('#select-projectCode').on('click', function () {
        var resultContainer = $(this).next('.upload-select-result');
        var selectResult = isPreApproveDoc() ? '' :
                        '<div class="row" id="selectResult">' +
                            '<div class="col-md-2">' +
                                '<button class="btn btn-xs btn-info" id="addSelect">加入选择</button>' +
                            '</div>' +
                            '<div class="col-md-10" id="selectedProject"></div>' +
                        '</div>'

        $.content({
            theme: 'blue',
            top: 100,
            header: '选择版本号',
            content: {
                html: '<div class="input-group">' +
                            '<input class="form-control" id="keyword" type="text" placeholder="输入关键字搜索" />' +
                            '<span class="input-group-btn" id="searchProject">' +
                                '<button class="btn btn-warning">' +
                                    '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>' +
                                '</button>' +
                            '</span>' +
                        '</div>' +
                        '<div id="projectList" style="max-height: 300px; overflow: auto;">' +
                            '<table class="table table-hover table-condensed">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th width="30"></th>' +
                                        '<th>版本号</td>' +
                                        '<th>项目代号</td>' +
                                        '<th>项目名称</td>' +
                                        '<th width="100">项目完成时间</td>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody></tbody>' +
                            '</table>' +
                        '</div>' +
                        '<div id="projectPager"></div>' + selectResult
            },
            footer: [{
                text: "确定",
                style: 'primary',
                callback: function () {
                    if (isPreApproveDoc()) {
                        var projectCode = $('#projectList input:checked').parents('tr').data('code');

                        if (!projectCode) {
                            $.tips('没有选中任何项目！');
                            return false;
                        }

                        resultContainer.html(projectCode);
                        $('[name="ProjectCode"]').val(projectCode);
                    } else {
                        var selectedCode = $('#selectedProject').data('code');

                        if (!selectedCode || selectedCode.length == 0) {
                            $.tips('没有选中任何项目！');
                            return false;
                        }

                        resultContainer.html(selectedCode.join());
                        $('[name="ProjectCode"]').val(selectedCode.join());
                    }                   
                }
            }, {
                text: "取消"
            }],
            onInit: function () {
                searchProject();
            }
        });
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

    //单击行选中
    $(document).on('click', '#projectList tbody tr', function (e) {
        $(this).find('input').click();
    });
    $(document).on('click', '#projectList input', function (e) {
        e.stopPropagation();
    });

    //加入选择
    $(document).on('click', '#addSelect', function (e) {
        var selectedCode = $('#selectedProject').data('code') || [];

        $('#projectList input:checked').each(function () {
            var projectCode = $(this).parents('tr').data('code');

            if (selectedCode.inArray(projectCode) == -1) {
                selectedCode.push(projectCode);
                $('#selectedProject').append('<span class="tag-item" data-code="' + projectCode + '">' + projectCode + '<a class="tag-del">×</a></span>');
            }
        });

        $('#selectedProject').data('code', selectedCode);
    });

    //删除选择
    $(document).on('click', '.tag-del', function (e) {
        var selectedCode = $('#selectedProject').data('code');
        var tagItem = $(this).parent();

        selectedCode.removeOf(tagItem.data('code'));
        tagItem.remove();
    });

    //项目阶段
    $(document).on('change', '[name="ProjectStage"]', function () {
        var currStage = +$(this).data('curr-stage');

        if (isNaN(currStage)) {
            return;
        }

        if ($(this).val() == 0) {
            $('#past-stage').hide();
        } else {
            if (currStage == 2) {
                $('#past-stage').show();
            }
        }
    });

    //选择目录
    $('#select-catalog').on('click', function () {
        var resultContainer = $(this).next('.upload-select-result');
        var catTree;

        $.get(rootUrl + 'Doc/GetRootCatalog', function (res) {
            if (res.state) {
                $.content({
                    theme: 'blue',
                    header: '选择目录',
                    content: {
                        height: 400,
                        html: '<div id="catTree" class="ztree"></div>'
                    },
                    footer: [{
                        text: '确定',
                        style: 'primary',
                        callback: function () {
                            var node = catTree.getCheckedNodes()[0];

                            if (!node) {
                                $.tips('未选择任何目录！');
                                return;
                            }

                            var path = node.Name;
                            var p = node.getParentNode();

                            while (p != null) {
                                path = p.Name + '>>' + path;
                                p = p.getParentNode();
                            }

                            resultContainer.text(path);
                            $('[name="Catalog"]').val(node.Id).data('text', node.Name);
                        }
                    }, {
                        text: '取消'
                    }],
                    onInit: function () {
                        //最外层去掉选择框
                        res.data.nocheck = true;
                        catTree = $.fn.zTree.init($('#catTree'), zSettings, [res.data]);
                        var defaultNode = catTree.getNodes()[0];
                        catTree.expandNode(defaultNode);
                    }
                });
            } else {
                $.tips(res.msg, 0);
            }
        });
    });

    //提交
    $('#submit-upload').on('click', function () {
        if (isPreApproveDoc()) {
            submitPreApproveDoc();
        } else {
            submitOtherDoc();
        }
    });

    //废弃文档
    $('#delete-upload').on('click', function () {
        $.confirm('确定要废弃该文档吗？', function (result) {
            if (result) {
                var docId = $('[name="DocId"]').val();
                $.get(rootUrl + 'Doc/Delete?id=' + docId, function (res) {
                    if (res.state) {
                        window.location.href = rootUrl + 'Doc/List';
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });        
    });

    //搜索项目
    function searchProject() {
        var keyword = $('#keyword').val();
        var $tbody = $('#projectList tbody').empty();

        $('#projectPager').pager({
            url: rootUrl + 'Doc/GetProjectList',
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

    //是否是预审文件
    function isPreApproveDoc() {
        return $('[name="DocType"]:checked').val() == "1";
    }

    //上传预审文件
    function submitPreApproveDoc() {
        var data = {
            Doc: {
                DocType: $('[name="DocType"]:checked').val(),
                ProjectCode: $('[name="ProjectCode"]').val(),
                SourceSolution: $('[name="SourceSolution"]').val(),
                ProjectStage: $('[name="ProjectStage"]').val(),
                ProjectSummary: $('[name="ProjectSummary"]').val()
            },
            CatId: $('[name="Catalog"]').val(),
            CatName: $('[name="Catalog"]').data('text')
        }

        if (data.Doc.ProjectCode == '' && data.Doc.SourceSolution == '') {
            $.tips('项目号和解决方案不能都为空！');
            return false;
        }

        if (data.Doc.ProjectSummary == '') {
            $.tips('项目概述不能为空！');
            return false;
        }

        if (data.CatId == '' || data.CatName == '') {
            $.tips('目录不能为空！');
            return false;
        }

        //编辑页面docId需要传回去
        if (isEdit) {
            data.Doc.Id = $('[name="DocId"]').val();
        } else {
            data.MainFile = {
                FileName: $('#select-mainfile-queue .finish-queue-item').data('filename'),
                FileAddress: $('#select-mainfile-queue .finish-queue-item').data('filepath')
            },
            data.SubFiles = [];

            $('#select-attachment-queue .finish-queue-item').each(function () {
                data.SubFiles.push({
                    FileName: $(this).data('filename'),
                    FileAddress: $(this).data('filepath')
                });
            });

            if (!data.MainFile || !data.MainFile.FileName) {
                $.tips('主文件不能为空！');
                return false;
            }
        }

        $.confirm('确定要提交审批吗？', function (result) {
            if (result) {
                $.tLayer('close');
                $.loading('提交中，请稍后...');

                $.post(rootUrl + 'Doc/SubmitUpload', { dataJson: JSON.stringify(data) }, function (res) {
                    $.tLayer('close');

                    if (res.state) {
                        if (data.Doc.Id) {
                            window.location.href = rootUrl + 'Doc/List';
                        } else {
                            $.content({
                                closeBtn: false,
                                theme: 'blue',
                                header: '提示',
                                content: {
                                    html: '上传成功，是否跳转到审批任务页？'
                                },
                                footer: [{
                                    text: '跳转页面',
                                    style: 'success',
                                    callback: function () {
                                        window.location.href = rootUrl + 'Doc/List';
                                    }
                                }, {
                                    text: '继续上传',
                                    style: 'info',
                                    callback: function () {
                                        window.location.reload();
                                    }
                                }]
                            });
                        }
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });
    }

    //上传其他文件
    function submitOtherDoc() {
        var data = {
            Doc: {
                DocType: $('[name="DocType"]:checked').val(),
                ProjectCode: $('[name="ProjectCode"]').val(),
                SourceSolution: $('[name="SourceSolution"]').val()
            },
            CatId: $('[name="Catalog"]').val(),
            CatName: $('[name="Catalog"]').data('text'),
            MainFile: {
                FileName: $('#select-mainfile-queue .finish-queue-item').data('filename'),
                FileAddress: $('#select-mainfile-queue .finish-queue-item').data('filepath')
            },
            SubFiles: []
        }

        if (data.CatId == '' || data.CatName == '') {
            $.tips('目录不能为空！');
            return false;
        }

        $('#select-attachment-queue .finish-queue-item').each(function () {
            data.SubFiles.push({
                FileName: $(this).data('filename'),
                FileAddress: $(this).data('filepath')
            });
        });

        if (!data.MainFile || !data.MainFile.FileName) {
            $.tips('主文件不能为空！');
            return false;
        }

        $.confirm('确定要提交吗？', function (result) {
            if (result) {
                $.tLayer('close');
                $.loading('提交中，请稍后...');

                $.post(rootUrl + 'Doc/SubmitOtherDoc', { dataJson: JSON.stringify(data) }, function (res) {
                    $.tLayer('close');

                    if (res.state) {
                        $.content({
                            closeBtn: false,
                            theme: 'blue',
                            header: '提示',
                            content: {
                                html: '上传成功，是否跳转到首页？'
                            },
                            footer: [{
                                text: '跳转页面',
                                style: 'success',
                                callback: function () {
                                    window.location.href = rootUrl + 'Home/Index';
                                }
                            }, {
                                text: '继续上传',
                                style: 'info',
                                callback: function () {
                                    window.location.reload();
                                }
                            }]
                        });
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });
    }
});