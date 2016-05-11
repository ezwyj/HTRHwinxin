define(['common', 'util', 'zTree', 'plugins', 'uploadify'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;
    var projectCatalogId = OP_CONFIG.projectCatalogId;
    var rootCatalogId = OP_CONFIG.rootCatalogId;
    var catalogTree;

    //右键菜单初始化
    var rMenu = $.rightMenu({
        menu: [{
            id: 'createCatalog',
            text: '新建子目录',
            icon: '<span class="glyphicon glyphicon-plus"></span>',
            callback: function (e, treeId, node) {
                $.content({
                    theme: 'blue',
                    header: '新建子目录',
                    content: {
                        width: 400,
                        html: '<div class="item">' +
                                '<div class="item-name"><span class="required">*</span>目录名称：</div>' +
                                '<div class="item-value"><input type="text" class="form-control" /></div>' +
                            '</div>'
                    },
                    footer: [{
                        style: 'primary',
                        text: '确定',
                        callback: function () {
                            if (checkRequired(this)) {
                                return false;
                            }

                            var data = {
                                parentId: node.Id,
                                catName: $('input', this).val()
                            }
                            
                            $.post(rootUrl + 'Doc/CreateCatalog', data, function (res) {
                                if (res.state) {
                                    $.tips('创建成功！', 3);

                                    if ((!node.open && !node.isParent) || node.open) {
                                        var newNode = {
                                            Id: res.data,
                                            Name: data.catName,
                                            ParentId: node.Id
                                        }

                                        catalogTree.addNodes(node, newNode, false);
                                    }
                                } else {
                                    $.tips(res.msg, 0);
                                }
                            });
                        }
                    }, {
                        text: '取消'
                    }]
                });
            }
        }, {
            id: 'removeCatalog',
            text: '删除目录',
            icon: '<span class="glyphicon glyphicon-remove"></span>',
            callback: function (e, treeId, node) {
                $.confirm('确定要删除该目录吗？', function (result) {
                    if (result) {
                        $.get(rootUrl + 'Doc/DeleteCatalog?catId=' + node.Id, function (res) {
                            if (res.state) {
                                $.tips('删除成功！', 3);
                                catalogTree.removeNode(node);
                                var pNode = node.getParentNode();
                                catalogTree.selectNode(pNode);
                                catalogTree.setting.callback.onClick(null, catalogTree.setting.treeId, pNode);
                            } else {
                                $.tips(res.msg, 0);
                            }
                        });
                    }
                });
            }
        }, {
            id: 'renameCatalog',
            text: '重命名目录',
            icon: '<span class="glyphicon glyphicon-pencil"></span>',
            callback: function (e, treeId, node) {
                $.content({
                    theme: 'blue',
                    header: '重命名目录',
                    content: {
                        width: 400,
                        html: '<div class="item">' +
                                '<div class="item-name"><span class="required">*</span>目录名称：</div>' +
                                '<div class="item-value"><input type="text" class="form-control" value="' + node.Name + '" /></div>' +
                            '</div>'
                    },
                    footer: [{
                        style: 'primary',
                        text: '确定',
                        callback: function () {
                            if (checkRequired(this)) {
                                return false;
                            }

                            var data = {
                                catId: node.Id,
                                catName: $('input', this).val()
                            }

                            $.post(rootUrl + 'Doc/RenameCatalog', data, function (res) {
                                if (res.state) {
                                    node.Name = data.catName;

                                    catalogTree.updateNode(node);
                                } else {
                                    $.tips(res.msg, 0);
                                }
                            });
                        }
                    }, {
                        text: '取消'
                    }]
                });
            }
        }/*, {
            id: 'uploadFile',
            text: '上传文件',
            icon: '<span class="glyphicon glyphicon-upload"></span>',
            callback: function (e, treeId, node) {
                $.content({
                    theme: 'blue',
                    header: '上传文件',
                    content: {
                        height: 400,
                        html: '<button class="btn btn-sm btn-primary" id="selectFile">选择文件</button>'
                    },
                    footer: [{
                        style: 'primary',
                        text: '确定',
                        callback: function () {
                            if (checkRequired(this)) {
                                return false;
                            }

                            var data = {
                                Directory: $('input', this).val()
                            }
                        }
                    }, {
                        text: '取消'
                    }],
                    onInit: function () {
                        $('#selectFile').uploadify({
                            swf: rootUrl + 'assets/js/lib/uploadify.swf'
                        });
                    }
                });
            }
        }*/]
    });
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
                    data = res.data;
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
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                isCopy: false,
                isMove: true,
                prev: false,
                next: false
            }
        },
        callback: {
            onClick: function (e, treeId, node) {
                catalogTree.expandNode(node, true);
                showCatalogDetail(node);
            },
            onRightClick: function (e, treeId, node) {
                var pNodes = [];
                var p = node.getParentNode();

                while (p != null) {
                    pNodes.unshift(p);
                    p = p.getParentNode();
                }

                //项目文件目录下不能操作目录
                if (node.Id == projectCatalogId || pNodes[1] && pNodes[1].Id == projectCatalogId) {
                    return false;
                }
                                
                rMenu.show(e.clientX, e.clientY, treeId, node);
                rMenu.element.find('>li').show();

                if (node.Id == rootCatalogId) { //根目录不能删除文件夹和上传文件
                    $('#createCatalog, #removeCatalog, #uploadFile').hide();
                } else if (node.ParentId == rootCatalogId) {
                    $('#removeCatalog, #uploadFile').hide();
                }
            },
            beforeDrop: function (treeId, nodes, targetNode, moveType) {
                if (moveType == 'inner') {
                    $.ajax({
                        type: 'post',
                        url: rootUrl + 'Doc/MoveCatalog',
                        async: false,
                        data: {
                            catId: nodes[0].Id,
                            newParentId: targetNode.Id
                        },
                        success: function (res) {
                            if (res.state) {
                                return true;
                            } else {
                                $.tips(res.msg, 0);
                                return false;
                            }
                        }
                    });
                }
            }
        }
    };
    

    //获取根目录并初始化目录树
    $.get(rootUrl + 'Doc/GetRootCatalog', function (res) {
        if (res.state) {
            catalogTree = $.fn.zTree.init($('#catalog'), zSettings, [res.data]);
            var defaultNode = catalogTree.getNodes()[0];
            catalogTree.selectNode(defaultNode);
            catalogTree.setting.callback.onClick(null, catalogTree.setting.treeId, defaultNode);
        } else {
            $.tips(res.msg, 0);
        }
    });

    //显示对应目录下的文档内容
    function showCatalogDetail(node) {
        var catNav = $('#catalog-nav').empty();
        var nodeList = [node];
        var pNode = node.getParentNode();

        while (pNode != null) {
            nodeList.unshift(pNode);
            pNode = pNode.getParentNode();
        }

        nodeList.forEach(function (item, idx) {
            if (idx != nodeList.length - 1) {
                catNav.append('<li><a href="#" data-tid="' + item.tId + '">' + item.Name + '</a></li>');
            } else {
                catNav.append('<li class="active">' + item.Name + '</li>');
            }            
        });

        initContent(node.Id);
    }

    //初始化目录内容表格
    function initContent(catId) {
        $('#catalog-content').table({
            url: rootUrl + 'Doc/GetCatalogContent?catId=' + catId,
            tableClass: 'table-condensed',
            paging: {
                enable: true,
                localPage: true
            },
            rowParam: function (data) {
                return {
                    id: data.Id
                }
            },
            colOptions: [{
                name: '名称',
                field: 'Name',
                handler: function (value, data) {
                    var icon = '';

                    if (data.Type == 1) {
                        icon = 'icon-catalog';
                        return '<a href="#" class="catalog-item catalog-folder" data-id="' + data.Id + '" title="' + value + '">' +
                                    '<span class="icon icon-catalog"></span>' +
                                    '<span class="catalog-text">' + value + '</span>' +
                                '</a>';
                    } else {
                        var fileName = value + '.' + data.FileType;
                        return '<a href="' + rootUrl + 'Doc/Preview?fileId=' + data.Id + '" target="_blank" class="catalog-item" title="' + fileName + '">' +
                                '<span class="icon ' + util.getFileIcon(fileName) + '"></span>' +
                                '<span class="catalog-text">' + fileName + '</span>' +
                            '</a>';
                    }
                }
            }, {
                width: 100,
                name: '上传人',
                field: 'CreateUser'
            }, {
                width: 130,
                name: '上传时间',
                field: 'ReleaseTime'
            }, {
                width: 100,
                name: '操作',
                handler: function () {
                    return '<button class="btn btn-mini btn-danger del-file">删除</button>';
                }
            }],
            resultVerify: function (res) {
                return {
                    state: res.state,
                    msg: res.msg
                }
            }
        });
    }

    //目录导航点击
    $(document).on('click', '#catalog-nav a', function (e) {
        var tid = $(this).data('tid');
        var node = catalogTree.getNodeByTId(tid);
        catalogTree.selectNode(node);
        catalogTree.setting.callback.onClick(e, catalogTree.setting.treeId, node);
    });

    //进入子目录
    $('#catalog-content').on('click', '.catalog-folder', function (e) {
        var id = $(this).data('id');
        var node = catalogTree.getNodeByParam('Id', id);

        catalogTree.selectNode(node);
        catalogTree.setting.callback.onClick(e, catalogTree.setting.treeId, node);
        e.preventDefault();
    });

    //删除文件
    $(document).on('click', '.del-file', function () {
        var tr = $(this).parents('.table-tr');
        var id = tr.data('id');

        $.confirm('确定要删除该文件吗？', function (result) {
            if (result) {
                $.post(rootUrl + 'Doc/DeleteFile?id=' + id, function (res) {
                    if (res.state) {
                        $.tips('删除成功', 3);
                        tr.remove();
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });        
    });

    //检查必填项
    function checkRequired(thisObj) {
        var err = false;
        var names = [];

        $('.required', thisObj).each(function () {
            var item = $(this).parent().next('.item-value, item-text');
            var val = item.find('input[type="text"]').val();

            if (val === '') {
                var name = $(this).parent().text().substring(1);
                if (name[name.length - 1] == '：') {
                    name = name.substring(0, name.length - 1);
                }
                names.push(name);
            }
        });

        if (names.length > 0) {
            alert(names + ' 不能为空！');
            err = true;
        }

        return err;
    }
});