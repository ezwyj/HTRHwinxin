define(['common', 'util', 'uploadify', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;
    var instanceId = $('[name="InstanceId"]').val();
    var fileId = $('[name="FileId"]').val();

    //如果没有激活pane，则默认激活第一个
    $('.main-content .nav').each(function () {
        if ($('li.active', this).length == 0) {
            $('li:first', this).addClass('active');
            $(this).next().find('.tab-pane:first').addClass('active in');
        }
    });

    //panel展开/收起
    $(document).on('click', '[data-expand] .panel-heading', function () {
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

    //按钮事件冒泡阻止
    $(document).on('click', '.panel-option', function (e) {
        e.stopPropagation();
    });

    //选择领域
    $('#selectRepresents').on('click', function () {
        $.get(rootUrl + 'System/GetFieldList', function (res) {
            if (res.state) {
                var fieldList = res.data;
                var listHtml = '';
                var oldRepresents = [];

                $('#represent-list .tag-item').each(function () {
                    oldRepresents.push($(this).data('badge'));
                });

                fieldList.forEach(function (item, idx) {
                    if (!item.IsEnable) {
                        return true;
                    }

                    var checkboxHtml = '';

                    item.RepresentsExp.forEach(function (represent) {
                        checkboxHtml += '<label class="represent"><input type="checkbox" value="' + represent.Badge + '" data-username="' + represent.Name + '" data-fieldid="' + item.Id + '" data-fieldname="' + item.Name + '"' + (oldRepresents.inArray(represent.Badge) > -1 ? 'checked' : '') + ' />' + represent.Name + '</label>';
                    });

                    if (idx % 2 == 0) {
                        listHtml += '<li class="border-right">\
                                        <span class="field">' + item.Name + '</span>\
                                        ' + checkboxHtml + '\
                                    </li>';
                    } else {
                        listHtml += '<li>\
                                        <span class="field">' + item.Name + '</span>\
                                        ' + checkboxHtml + '\
                                    </li>';
                    }
                });

                $.content({
                    theme: 'blue',
                    header: '选择领域委员',
                    content: {
                        html: '<div class="select-all"><label><input type="checkbox" />全选</label></div>' +
                                '<ul class="item-list" id="select-represent-list">' +
                                    '<li class="list-head"><span class="field">领域</span><span class="person">委员</span></li>' +
                                    '<li class="list-head"><span class="field">领域</span><span class="person">委员</span></li>' +
                                    listHtml +
                                '</ul>'
                    },
                    footer: [{
                        text: '确定',
                        style: 'primary',
                        callback: function () {
                            var fieldObj = {};

                            $('#select-represent-list input:checked', this).each(function () {
                                var field = $(this).data('fieldid');

                                if (!fieldObj[field]) {
                                    fieldObj[field] = [];
                                }

                                var obj = {
                                    Badge: this.value,
                                    Name: $(this).data('username')
                                }

                                fieldObj[field].FieldName = $(this).data('fieldname');
                                fieldObj[field].push(obj);
                            });

                            $('#represent-list .tag-container').remove();

                            for (var i in fieldObj) {
                                var field = $('<div class="tag-container" data-fieldid="' + i + '"><label class="field">' + fieldObj[i].FieldName + '</label></div>').appendTo('#represent-list');

                                fieldObj[i].forEach(function (represent) {
                                    field.append('<span class="tag-item" data-badge="' + represent.Badge + '">' + represent.Name + '<a class="tag-del">×</a></span>');
                                });
                            }
                        }
                    }, {
                        text: '取消',
                        style: 'default'
                    }]
                });
            } else {
                $.tips(res.msg, 0);
            }
        });
    });
    
    //修改领域
    $('#updateRepresents').on('click', function () {
        $.get(rootUrl + 'System/GetFieldList', function (res) {
            if (res.state) {
                var fieldList = res.data;
                var listHtml = '';
                var oldRepresents = [];

                $('#represent-list .tag-item').each(function () {
                    oldRepresents.push($(this).data('badge'));
                });

                fieldList.forEach(function (item, idx) {
                    if (!item.IsEnable) {
                        return true;
                    }

                    var checkboxHtml = '';

                    item.RepresentsExp.forEach(function (represent) {
                        checkboxHtml += '<label class="represent"><input type="checkbox" value="' + represent.Badge + '" data-username="' + represent.Name + '" data-fieldid="' + item.Id + '" data-fieldname="' + item.Name + '"' + (oldRepresents.inArray(represent.Badge) > -1 ? 'checked' : '') + ' />' + represent.Name + '</label>';
                    });

                    if (idx % 2 == 0) {
                        listHtml += '<li class="border-right">\
                                        <span class="field">' + item.Name + '</span>\
                                        ' + checkboxHtml + '\
                                    </li>';
                    } else {
                        listHtml += '<li>\
                                        <span class="field">' + item.Name + '</span>\
                                        ' + checkboxHtml + '\
                                    </li>';
                    }
                });

                $.content({
                    theme: 'blue',
                    header: '修改领域委员',
                    content: {
                        html: '<div class="select-all"><label><input type="checkbox" />全选</label></div>' +
                                '<ul class="item-list" id="select-represent-list">' +
                                    '<li class="list-head"><span class="field">领域</span><span class="person">委员</span></li>' +
                                    '<li class="list-head"><span class="field">领域</span><span class="person">委员</span></li>' +
                                    listHtml +
                                '</ul>'
                    },
                    footer: [{
                        text: '确定',
                        style: 'primary',
                        callback: function () {
                            $.tLayer('close');

                            var fields = [];

                            $('#select-represent-list input:checked', this).each(function () {
                                var item;
                                var badge = $(this).val();
                                var field = $(this).data('fieldid');
                                var idx = fields.inArray(field, 'Field');

                                if (idx > -1) {
                                    item = fields[idx];
                                    item.Approvers += ',' + badge;
                                } else {
                                    fields.push({
                                        Field: field,
                                        Approvers: badge
                                    });
                                }
                            });

                            if (!fields.length) {
                                $.tips('请选择领域委员！', 0);
                                return false;
                            }

                            $.confirm('确定要修改领域委员吗？', function (result) {
                                if (result) {
                                    $.tLayer('close');
                                    $.loading('提交中，请稍后...');

                                    var approveData = {
                                        instanceId: instanceId,
                                        fields: JSON.stringify(fields)
                                    }

                                    $.post(rootUrl + 'Doc/UpdateDistribute', approveData, function (res) {
                                        $.tLayer('close');

                                        if (res.state) {
                                            $.tips('修改成功', 3, function () {
                                                window.location.reload();
                                            });
                                        } else {
                                            $.tips('修改失败：' + res.msg);
                                        }
                                    });
                                }
                            });
                        }
                    }, {
                        text: '取消',
                        style: 'default'
                    }]
                });
            } else {
                $.tips(res.msg, 0);
            }
        });
    });

    //全选
    $(document).on('change', '.select-all input:checkbox', function () {
        $(this).parent().parent().next().find('input:checkbox').prop('checked', $(this).prop('checked'));
    });

    //删除领域
    $(document).on('click', '.tag-del', function (e) {
        var tagItem = $(this).parent();
        var tagContainer = tagItem.parent();

        tagItem.remove();

        if (tagContainer.find('.tag-item').length == 0) {
            tagContainer.remove();
        }
    });

    //提交领域委员
    $('#submit-distribute').on('click', function (e) {
        var tagContainers = $('#represent-list .tag-container');

        if (tagContainers.length == 0) {
            $.tips('未选择任何领域委员！', 0);
            return;
        }

        $.confirm('确定提交所选的领域委员吗？', function (result) {
            if (result) {
                var fields = [];

                tagContainers.each(function () {
                    var approvers = [];

                    $('.tag-item', this).each(function () {
                        approvers.push($(this).data('badge'));
                    });

                    fields.push({
                        Field: $(this).data('fieldid'),
                        Approvers: approvers.join()
                    });
                });

                var approveData = {
                    instanceId: instanceId,
                    fields: JSON.stringify(fields)
                }

                $.tLayer('close');
                $.loading('提交中，请稍后...');
                $.post(rootUrl + 'Doc/SubmitDistribute', approveData, function (res) {
                    $.tLayer('close');

                    if (res.state) {
                        $.tips('提交成功', 3, function () {
                            window.location = rootUrl + 'Doc/List';
                        });
                    } else {
                        $.tips('提交失败：' + res.msg);
                    }
                });                
            }
        });
    });

    //驳回到发起人
    $('#return-distribute').on('click', function () {
        $.content({
            theme: 'blue',
            header: '驳回',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"></textarea>'
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('驳回意见不能为空！', 0);
                        return false;
                    }

                    $.tLayer('close');
                    $.loading('驳回中，请稍后...');
                    $.post(rootUrl + 'Doc/ReturnApproveToBegin', {
                        instanceId: instanceId,
                        remark: remark
                    }, function (res) {
                        $.tLayer('close');

                        if (res.state) {
                            $.tips('驳回成功！', 3, function () {
                                window.location = rootUrl + 'Doc/List';
                            });                            
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }]
        });
    });

    //预审要点
    $('#mainPoint').on('click', function () {
        var url = $(this).data('url');

        if (url != '') {
            $.content({
                theme: 'blue',
                header: '预审要点',
                content: {
                    width: 800,
                    height: 500,
                    src: rootUrl + 'Doc/GetMainPointFile?filePath=' + url
                },
                footer: [{
                    text: '确定'
                }]
            });
        } else {
            $.content({
                theme: 'blue',
                header: '预审要点',
                content: {
                    html: '<h3>对不起，当前阶段没有上传预审要点文档！<h3>'
                },
                footer: [{
                    text: '确定'
                }]
            });
        }        
    });

    //提问
    $('#raise-question').on('click', function () {
        var qaTab = $(this).parents('.tab-pane');
        var qaList = qaTab.find('> .qa-list');

        $.content({
            theme: 'blue',
            header: '提问',
            content: {
                html: '<textarea class="form-control" placeholder="提问内容" style="height: 100px;"></textarea>'
            },
            footer: [{
                text: '提交',
                style: 'success',
                callback: function () {
                    var questionData = {
                        InstanceId: instanceId,
                        Field: qaTab.data('fieldid'),
                        Content: $('textarea', this).val()
                    }

                    if (questionData.Content == '') {
                        $.tips('提问内容不能为空', 0);
                        return false;
                    }

                    $.tLayer('close');
                    $.loading('正在提交问题，请稍后...');
                    submitQuestion(questionData, function (question) {
                        var html = '<li class="qa-item" data-questionid="' + question.Id + '">' +
                                        '<div class="qa-icon bg-danger">' +
                                            '<img src="' + rootUrl + 'assets/img/question.png" />' +
                                            '<span>进行中</span>' +
                                        '</div>' +
                                        '<div class="qa-content">' +
                                            '<p class="qa-userInfo">' +
                                                '<span class="qa-user">' + question.CreatorExp + '</span>' +
                                                '<span class="qa-time">' + question.CreateTimeExp + '</span>' +
                                                '<span class="qa-num">问题编号：' + question.Id + '</span>' +
                                            '</p>' +
                                            '<p class="qa-text">' + question.Content + '</p>' +
                                            '<a class="btn-link view-replies">回复(0)</a>' +
                                            '<ul class="qa-replies">' +
                                                '<li class="qa-reply-box">' +
                                                    '<div class="qa-reply-icon">' +
                                                        '<span>回复</span>' +
                                                    '</div>' +
                                                    '<div class="reply-content">' +
                                                        '<textarea class="form-control" placeholder="回复内容"></textarea>' +
                                                        '<div class="option-right">' +
                                                            '<button class="btn btn-primary btn-xs reply-question">回复</button> ' +
                                                            '<button class="btn btn-primary btn-xs close-question">关闭</button>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</li>' +
                                            '</ul>' +
                                        '</div>' +
                                    '</li>';
                        qaList.append(html);
                    });
                }
            }, {
                text: '取消'
            }]
        });
    });

    //查看回复
    $(document).on('click', '.view-replies', function () {
        $(this).next('.qa-replies').slideToggle('fast');
    });

    //回复
    $(document).on('click', '.reply-question', function () {
        var textarea = $(this).parent().prev('textarea');
        var replyBox = $(this).parents('.qa-reply-box');
        var replayNum = $(this).parents('.qa-replies').prev('.view-replies').find('.reply-num');
        var questionData = {
            Pid: $(this).parents('.qa-item').data('questionid'),
            InstanceId: instanceId,
            Field: $(this).parents('.tab-pane').data('fieldid'),
            Content: textarea.val()
        }

        if (questionData.Content == '') {
            $.tips('回复内容不能为空', 0);
            return false;
        }

        $.loading('正在提交回复，请稍后...');
        submitQuestion(questionData, function (question) {
            var html = '<li class="qa-reply-item" data-questionid="' + question.Id + '">' +
                            '<div class="qa-reply-icon">' +
                                '<span>回复</span>' +
                            '</div>' +
                            '<div class="qa-content">' +
                                '<p class="qa-userInfo">' +
                                    '<span class="qa-user">' + question.CreatorExp + '</span>' +
                                    '<span class="qa-time">' + question.CreateTimeExp + '</span>' +
                                '</p>' +
                                '<p class="qa-text">' + question.Content + '</p>' +
                            '</div>' +
                        '</li>';

            replyBox.before(html);
            textarea.val('');
            replayNum.text(+replayNum.text() + 1);
        });
    });

    //提交问题
    function submitQuestion(questionData, successCallback) {
        $.post(rootUrl + 'Doc/SubmitQuestion', { questionJson: JSON.stringify(questionData) }, function (res) {
            $.tLayer('close');

            if (res.state) {
                successCallback(res.data);
            } else {
                $.tips(res.msg, 0);
            }
        });
    }

    //关闭问题
    $(document).on('click', '.close-question', function () {
        var qaItem = $(this).parents('.qa-item');

        $.confirm('确定要关闭该问题吗？', function (result) {
            if (result) {
                $.get(rootUrl + 'Doc/CloseQuestion?id=' + qaItem.data('questionid'), function (res) {
                    if (res.state) {
                        $.tips('关闭成功', 3);
                        qaItem.find('.qa-icon').replaceWith('<div class="qa-icon bg-success"><img src="' + rootUrl + 'assets/img/solution.png" /><span>已关闭</span></div>');
                        qaItem.find('.qa-reply-box').remove();
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });        
    });

    //领域预审意见
    $('#submit-preOpinion').on('click', function () {
        var btn = $(this);
        var tabPane = btn.parents('.tab-pane');
        var arr = ['通过', '带风险通过', '驳回'];

        $.content({
            theme: 'blue',
            header: '领域预审意见',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"></textarea>'
            },
            footer: [{
                text: arr[0],
                style: 'success',
                callback: function () {
                    return setPreOpinion(1, $('textarea', this).val());
                }
            }, {
                text: arr[1],
                style: 'warning',
                callback: function () {
                    return setPreOpinion(2, $('textarea', this).val());
                }
            }, {
                text: arr[2],
                style: 'danger',
                callback: function () {
                    return setPreOpinion(3, $('textarea', this).val());
                }
            }]
        });

        function setPreOpinion(state, opinion) {
            if (opinion == '') {
                return false;
            }

            var data = {
                id: tabPane.data('id'),
                preState: state,
                preOpinion: opinion
            }

            $.tLayer('close');
            $.post(rootUrl + 'Doc/SubmitPreOpinion', data, function (res) {
                if (res.state) {
                    $.tips('操作成功！', 3, function () {
                        window.location = rootUrl + 'Doc/List';
                    });
                } else {
                    $.tips(res.msg, 0);
                }
            });
        }
    });

    //提交上会
    $('#submitMeeting').on('click', function () {
        $.confirm('确定要提交上会吗？', function (result) {
            if (result) {
                $.tLayer('close');
                $.loading('提交中，请稍后...');

                $.get(rootUrl + 'Doc/SubmitMeeting?instanceId=' + instanceId, function (res) {
                    $.tLayer('close');

                    if (res.state) {
                        $.tips('提交成功', 3, function () {
                            window.location = rootUrl + 'Doc/List';
                        });
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });
    });

    //保存领域最终意见
    $('.save-final-opinion').on('click', function () {
        var tabPane = $(this).parents('.tab-pane');
        var opinion = tabPane.find('textarea').val();

        if (opinion == '') {
            $.tips('领域终审意见不能为空！', 0);
            return;
        }

        $.post(rootUrl + 'Doc/SubmitFinalOpinion', {
            id: tabPane.data('id'),
            finalOpinion: opinion
        }, function (res) {
            if (res.state) {
                opinion = opinion.replace('\n', '<br>');
                tabPane.html('<p>' + opinion + '</p>');
            } else {
                $.tips(res.msg, 0);
            }
        });
    });

    //通过（终审）
    $('#finalPass').on('click', function () {
        $.confirm('确定要通过吗？', function (result) {
            if (result) {
                submitFinalState(1);
            }
        });
    });

    //带风险通过（终审）
    $('#finalPassWithDanger').on('click', function () {
        $.confirm('确定要带风险通过吗？', function (result) {
            if (result) {
                submitFinalState(2);
            }
        });
    });

    //驳回（终审）
    $('#finalReject').on('click', function () {
        $.confirm('确定要驳回吗？', function (result) {
            if (result) {
                submitFinalState(3);
            }
        });
    });

    //废弃（终审）
    $('#finalAbandon').on('click', function () {
        $.confirm('确定要废弃吗？', function (result) {
            if (result) {
                submitFinalState(4);
            }
        });
    });

    //设置终审结论
    function submitFinalState(state) {
        $.tLayer('close');

        $.post(rootUrl + 'Doc/SubmitFinalState', {
            instanceId: instanceId,
            finalState: state,
            isNeedMeeting: $('[name="IsNeedMeeting"]:checked').val()
        }, function (res) {
            if (res.state) {
                $.tips('操作成功！', 3, function () {
                    window.location = rootUrl + 'Doc/List';
                });
            } else {
                $.tips(res.msg, 0);
            }
        });
    }

    //主任通过
    $('#submitApprove').on('click', function () {
        var remark = $(this).parents('.panel').find('.panel-body textarea').val();

        if (remark == '') {
            $.tips('审批意见不能为空！');
            return;
        }

        $.confirm('确定要提交审批吗？', function (result) {
            if (result) {
                submitApprove(remark);
            }
        });        
    });

    //主任驳回
    $('#returnApprove').on('click', function () {
        var remark = $(this).parents('.panel').find('.panel-body textarea').val();

        returnToPreApprove(remark);
    });

    //提交审批
    function submitApprove(remark, isLast) {
        $.tLayer('close');

        $.post(rootUrl + 'Doc/SubmitApprove', {
            instanceId: instanceId,
            remark: remark,
            isLast: isLast
        }, function (res) {
            if (res.state) {
                $.tips('审批成功！', 3, function () {
                    window.location = rootUrl + 'Doc/List';
                });                
            } else {
                $.tips(res.msg, 0);
            }
        });
    }

    //驳回到预审阶段
    function returnToPreApprove(remark) {
        if (remark == '') {
            $.tips('驳回意见不能为空！');
            return;
        }

        $.confirm('确定要驳回吗？', function (result) {
            if (result) {
                $.tLayer('close');

                $.post(rootUrl + 'Doc/ReturnToPreApprove', {
                    instanceId: instanceId,
                    remark: remark
                }, function (res) {
                    if (res.state) {
                        $.tips('驳回成功！', 3, function () {
                            window.location = rootUrl + 'Doc/List';
                        });
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });        
    }

    //财务审批上传附件
    $('#select-attachment').uploadify({
        swf: rootUrl + 'assets/js/lib/uploadify.swf',
        uploader: rootUrl + 'Common/UploadAttachment',
        fileSizeLimit: '100 MB',
        uploadDesc: '<span style="color: red;">（单个文件不能超过100MB）</span>',
        onSelect: function (file) {
            var queue = $('#' + this.settings.queueID);
            var html =  '<div id="#{fileId}" class="uploadify-queue-item">' +
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

            queue.append(util.parseTpl(html, fileData));
        },
        onUploadSuccess: function (file, res) {
            res = JSON.parse(res);
            
            if (res.state) {
                var data = res.data[0];
                var html =  '<div id="#{fileId}" class="finish-queue-item" data-fileid="#{id}">' +
                                '<span class="icon #{fileIcon}"></span>' +
                                '<span class="file-name" title="#{fileName}">#{fileName}</span>' +
                                '<span class="file-size">#{fileSize}</span>' +
                                '<a class="file-operate file-del" href="#">删除</a>' +
                            '</div>';
                var fileData = {
                    id: data.Id,
                    fileId: file.id,
                    fileIcon: util.getFileIcon(file.name),
                    fileName: file.name,
                    fileSize: util.getFileSize(file.size)
                }

                $('#' + file.id).replaceWith(util.parseTpl(html, fileData));

                //删除
                $('#' + file.id).on('click', '.file-del', function () {
                    $('#' + file.id).remove();
                    return false;
                });
            } else {
                $.tips(res.msg);
            }
        }
    });

    //财务审批
    $('#submitApprove-finance').on('click', function () {
        var panel = $(this).parents('.panel');
        var remark = panel.find('.panel-body textarea').val();

        if (remark == '') {
            $.tips('审批意见不能为空！');
            return;
        }

        $.confirm('确定要提交审批吗？', function (result) {
            if (result) {
                var attachments = [];

                panel.find('.finish-queue-item').each(function () {
                    if ($(this).data('fileid')) {
                        attachments.push($(this).data('fileid'));
                    }
                });

                if (attachments.length > 0) {
                    $.post(rootUrl + 'Doc/SaveFinanceAttachment', {
                        instanceId: instanceId,
                        attachments: attachments.join()
                    }, function (res) {
                        if (res.state) {
                            submitApprove(remark);
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                } else {
                    submitApprove(remark);
                }                
            }
        });
    });

    //成果处审批
    $('#submitApprove-result').on('click', function () {
        var remark = $(this).parents('.panel').find('.panel-body textarea').val();

        if (remark == '') {
            $.tips('审批意见不能为空！');
            return;
        }

        $.confirm('确定要提交审批吗？', function (result) {
            if (result) {
                submitApprove(remark, true);
            }
        });
    });
});