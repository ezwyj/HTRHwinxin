if (typeof OP_CONFIG != 'undefined' && OP_CONFIG.module && OP_CONFIG.page) {
    require.config({
        baseUrl: OP_CONFIG.rootUrl + 'assets/js',
        paths: {
            'jquery': 'lib/jquery-1.11.3.min',
            'bootstrap': 'lib/bootstrap.min',
            'uploadify': 'lib/jquery.uploadify',
            'zTree': 'lib/jquery.ztree.all-3.5.min',
            'tlayer': 'lib/jquery.tlayer',
            'plugins': 'lib/jquery.plugins',
            'util': 'lib/util',
            'echarts': OP_CONFIG.rootUrl + 'assets/plugins/echarts',
            'datepicker': OP_CONFIG.rootUrl + 'assets/plugins/datepicker/bootstrap-datepicker.min'
        },
        shim: {
            'bootstrap': {
                deps: ['jquery']
            },
            'uploadify': {
                deps: ['jquery']
            },
            'zTree': {
                deps: ['jquery']
            },
            'tlayer': {
                deps: ['jquery']
            },
            'plugins': {
                deps: ['jquery']
            },
            'datepicker': {
                deps: ['jquery']
            }
        },
        urlArgs: 'bust=' + (new Date()).getTime()   //开发环境下禁用缓存，生成环境要移除
    });

    OP_CONFIG.proxyUrl = 'http://localhost:2478/';

    require(['app/' + OP_CONFIG.module + '/' + OP_CONFIG.page]);
}