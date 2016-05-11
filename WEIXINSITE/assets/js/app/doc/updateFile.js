define(['common', 'util', 'tlayer', 'uploadify'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;
    var fileInfo = OP_CONFIG.fileInfo;

    var uploadOpt = {
        swf: rootUrl + 'assets/js/lib/uploadify.swf',
        uploader: rootUrl + 'Common/UploadFile',
        fileSizeLimit: '100 MB',
        onSelect: function (file) {
            var queue = $('#' + this.settings.queueID).empty();
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
                    fileId: file.id,
                    fileName: fileInfo.FileName,
                    filePath: fileInfo.FileAddress,
                    fileIcon: util.getFileIcon(file.name),
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

    //文件
    var fileOpt = $.extend(true, {}, uploadOpt, {
        multi: false,
        uploadDesc: '<span style="color: red;">（文件不能超过100MB）</span>',
        onInit: function (swfuploadify) {
            var queue = $('#' + swfuploadify.settings.queueID);
            var html = '<div id="#{fileId}" class="finish-queue-item" data-filepath="#{filePath}" data-filename="#{fileName}">' +
                            '<span class="icon #{fileIcon}"></span>' +
                            '<span class="file-name" title="#{fileName}">#{fileName}</span>' +
                        '</div>';

            var fileData = {
                fileId: 'file_' + fileInfo.FileId,
                fileName: fileInfo.FileName + '.' + fileInfo.FileType,
                filePath: fileInfo.FileAddress,
                fileIcon: util.getFileIcon('.' + fileInfo.FileType)
            }

            queue.append(util.parseTpl(html, fileData));
        }
    });
    $('#select-file').uploadify(fileOpt);

    //提交更新
    $('#submit-update').on('click', function () {
        var data = {
            FileId: fileInfo.FileId,
            FileName: $('#select-file-queue .finish-queue-item').data('filename'),
            FileAddress: $('#select-file-queue .finish-queue-item').data('filepath'),
            UpdateNote: $('[name="UpdateNote"]').val()
        }

        if (!data.FileAddress) {
            $.tips('文件不能为空！');
            return false;
        }

        if (data.FileAddress == fileInfo.FileAddress) {
            $.tips('请上传新文件！');
            return false;
        }

        if (data.UpdateNote == '') {
            $.tips('更新说明不能为空！');
            return false;
        }

        $.loading('更新中...');
        $.post(rootUrl + 'Doc/SubmitUpdateFile', { dataJson: JSON.stringify(data) }, function (res) {
            $.tLayer('close');

            if (res.state) {
                if (OP_CONFIG.instanceId) {
                    window.location.href = rootUrl + 'Doc/Detail?instanceId=' + OP_CONFIG.instanceId;
                } else {
                    window.location.href = rootUrl + 'Doc/Preview?fileId=' + res.data;
                }
            } else {
                $.tips(res.msg, 0);
            }
        });
    });
});