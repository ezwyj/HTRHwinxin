define(['common', 'util', 'uploadify', 'zTree', 'plugins', 'bootstrap'], function ($, util) {
    var demoMsg = {
        async: "正在进行异步加载，请等一会儿再点击...",
        expandAllOver: "全部展开完毕",
        asyncAllOver: "后台异步加载完毕",
        asyncAll: "已经异步加载完毕，不再重新加载",
        expandAll: "已经异步加载完毕，使用 expandAll 方法"
    }
    var setting = {
        async: {
            enable: true,
            url: "GetTreeNode",
            autoParam: ["id", "pid", "level=lv"],
            dataFilter: filter
        },
        callback: {
            beforeAsync: beforeAsync,
            onAsyncSuccess: onAsyncSuccess,
            onAsyncError: onAsyncError,
            onClick: onClick
        }
    };

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;

        return childNodes.data;
    }

    function beforeAsync() {
        curAsyncCount++;
    }

    function onAsyncSuccess(event, treeId, treeNode, msg) {
        curAsyncCount--;

    }
    function onClick(event, treeId, treeNode) {

    };

    function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
        curAsyncCount--;

        if (curAsyncCount <= 0) {
            curStatus = "";
            if (treeNode != null) asyncForAll = true;
        }
    }

    var curStatus = "init", curAsyncCount = 0, asyncForAll = false,
    goAsync = false;
    function expandAll() {
        if (!check()) {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        if (asyncForAll) {
            $("#demoMsg").text(demoMsg.expandAll);
            zTree.expandAll(true);
        } else {
            expandNodes(zTree.getNodes());
            if (!goAsync) {
                $("#demoMsg").text(demoMsg.expandAll);
                curStatus = "";
            }
        }
    }
    function expandNodes(nodes) {
        if (!nodes) return;
        curStatus = "expand";
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        for (var i = 0, l = nodes.length; i < l; i++) {
            zTree.expandNode(nodes[i], true, false, false);
            if (nodes[i].isParent && nodes[i].zAsync) {
                expandNodes(nodes[i].children);
            } else {
                goAsync = true;
            }
        }
    }

    function asyncAll() {
        if (!check()) {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        if (asyncForAll) {
            $("#demoMsg").text(demoMsg.asyncAll);
        } else {
            asyncNodes(zTree.getNodes());
            if (!goAsync) {
                $("#demoMsg").text(demoMsg.asyncAll);
                curStatus = "";
            }
        }
    }
    function asyncNodes(nodes) {
        if (!nodes) return;
        curStatus = "async";
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        for (var i = 0, l = nodes.length; i < l; i++) {
            if (nodes[i].isParent && nodes[i].zAsync) {
                asyncNodes(nodes[i].children);
            } else {
                goAsync = true;
                zTree.reAsyncChildNodes(nodes[i], "refresh", true);
            }
        }
    }

    function reset() {
        if (!check()) {
            return;
        }
        asyncForAll = false;
        goAsync = false;
        $("#demoMsg").text("");
        $.fn.zTree.init($("#treeDemo"), setting);
    }

    function check() {
        if (curAsyncCount > 0) {
            $("#demoMsg").text(demoMsg.async);
            return false;
        }
        return true;
    }




});