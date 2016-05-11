require(['common', 'plugins'], function ($) {
	var rootUrl = OP_CONFIG.rootUrl;
	var idx = 0;


	var submitListTable = $('#submitList').table({
	    tableClass: 'table-condensed',
	    url: rootUrl + 'npi/GetSubmitList',
	    resizable: false,
	    colOptions: [{
	        name: '序号',
	        field: 'Id',
	        width: 50,
	        align: 'center'
	    }, {
	        name: '缺陷摘要',
	        field: 'zy',
	        width: 400

	    }, {
	        name: '缺陷等级',
	        field: 'qxdj',
	        width: 80
	    }, {
	        name: '缺陷分类',
	        field: 'qxlb',
	        width: 80
	    }, {
	        name: '缺陷状态',
	        field: 'State',
	        width: 80
	    }, {
	        name: '提交日期',
	        field: 'createtime',
	        width: 90
	    }, {
	        name: '产品线',
	        field: 'cpx',
	        width: 90
	    }, {
	        name: '项目代码',
	        field: 'XMDM',
	        width: 90
	    }, {
	        name: '物品编码',
	        field: 'WPBM',
	        width: 100
	    }, {
	        name: '物品型号',
	        field: 'WPXH',
	        width: 150
	    }, {
	        name: '提交人',
	        field: 'tjr',
	        width: 60
	    }, {
	        name: '操作',
	        width: 100,
	        handler: function (value, data) {
	            //var stage = data.ApproveStage || 0;
	            //var other = '';
	            return '<a href="' + rootUrl + 'npi/Detail?InstanceId=' + data.InstanceId + '" target="_blank">审批</a>';
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
	    url: rootUrl + 'NPI/GetHandleList',
	    resizable: false,
	    colOptions: [{
	        name: '序号',
	        field: 'Id',
	        width: 50,
	        align: 'center'
	    }, {
	        name: '缺陷摘要',
	        field: 'zy',
	        width: 400

	    }, {
	        name: '缺陷等级',
	        field: 'qxdj',
	        width: 80
	    }, {
	        name: '缺陷分类',
	        field: 'qxlb',
	        width: 80
	    }, {
	        name: '缺陷状态',
	        field: 'State',
	        width: 80
	    }, {
	        name: '提交日期',
	        field: 'createtime',
	        width: 90
	    }, {
	        name: '产品线',
	        field: 'cpx',
	        width: 90
	    }, {
	        name: '项目代码',
	        field: 'XMDM',
	        width: 90
	    }, {
	        name: '物品编码',
	        field: 'WPBM',
	        width: 100
	    }, {
	        name: '物品型号',
	        field: 'WPXH',
	        width: 150
	    }, {
	        name: '提交人',
	        field: 'tjr',
	        width: 60
	    }, {
	        name: '操作',
	        width: 100,
	        handler: function (value, data) {
	            //var stage = data.ApproveStage || 0;
	            //var other = '';
	            return '<a href="' + rootUrl + 'npi/Detail?InstanceId=' + data.InstanceId + '" target="_blank">审批</a>';
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

	$('#pendList').table({
	    url: rootUrl + 'NPI/GetPendList',
		resizable: false,
		paging: {
		    enable: false
		},
		tableClass: 'table-condensed',
		colOptions: [{
		    name: '序号',
		    field: 'Id',
		    width: 50,
		    align: 'center'
		}, {
		    name: '缺陷摘要',
		    field: 'zy',
		    width: 400
		    
		}, {
		    name: '缺陷等级',
		    field: 'qxdj',
		    width: 80
		}, {
		    name: '缺陷分类',
		    field: 'qxlb',
		    width: 80
		}, {
		    name: '缺陷状态',
		    field: 'State',
		    width: 80
		}, {
		    name: '提交日期',
		    field: 'createtime',
		    width: 90
		}, {
		    name: '产品线',
		    field: 'cpx',
		    width: 90
		}, {
		    name: '项目代码',
		    field: 'XMDM',
		    width: 90
		}, {
		    name: '物品编码',
		    field: 'WPBM',
		    width: 100
		}, {
		    name: '物品型号',
		    field: 'WPXH',
		    width: 150
		}, {
		    name: '提交人',
		    field: 'tjr',
		    width: 60
		}, {
			name: '操作',
			width: 100,
			handler: function (value, data) {
			    //var stage = data.ApproveStage || 0;
			    //var other = '';
			    return '<a href="' + rootUrl + 'npi/Detail?InstanceId=' + data.InstanceId + '" target="_blank">审批</a>';
			}
		}]
	});
});