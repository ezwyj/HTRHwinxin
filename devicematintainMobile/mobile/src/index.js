/**
 * 入口
 */

'use strict';

import 'babel-polyfill';
import Vue from 'vue';
import ElementUI from 'element-ui';
import router from './router';
import bus from './bus';
import http from 'mpit-utils/libs/http';
import './libs/element-ui-setting';
import components from 'mpit-utils/components';

Vue.use(ElementUI, { size: 'small' });
Vue.use(components);

// 样式
import './styles/main.scss';

// 登录失效时跳转到登录页面
http.interceptors.response.use(function (response) {
	//if (!response.data.State && response.data.Code === 401) {
	//	if (router.currentRoute.path === '/login') return response;
	//	bus.userInfo = {};
	//	router.replace('/login?returnUrl=' + encodeURIComponent(window.location.href));
	//}
	return response;
});

new Vue({
	el: '#app',
	router,
	render: h => h('router-view')
});