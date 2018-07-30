/**
 * 路由配置
 */ 

'use strict';

import Vue from 'vue';
import Router from 'vue-router';
import bus from './bus';
import CommonApi from './api/Common';
import { isObject } from 'mpit-utils/libs/utils';

import Error403 from '@/pages/Error403';
import Error404 from '@/pages/Error404';
import Login from '@/pages/Login';
import Layout from '@/pages/Layout';
import Home from '@/pages/Home';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: OP_CONFIG.rootUrl,
	routes: [
		//{
		//	path: '/login',
		//	beforeEnter(to, from, next) {
		//		if (process.env.NODE_ENV === 'production') {
		//			location.href = OP_CONFIG.caUrl + 'Account/Login?returnUrl=' + encodeURIComponent(to.query.returnUrl);
		//			return;
		//		}
		//		next();
		//	},
		//	component: Login
		//},
		//{
		//	path: '/logout',
		//	async beforeEnter(to) {
		//		if (process.env.NODE_ENV === 'production') {
		//			location.href = OP_CONFIG.caUrl + 'Account/Logout?returnUrl=' + encodeURIComponent(to.query.returnUrl);
		//			return;
		//		}
		//		const { data } = await CommonApi.logout();
		//		if (data.State) {
		//			router.replace('/login?returnUrl=' + encodeURIComponent(to.query.returnUrl));
		//		}
		//	}
		//},
		{
			path: '',
			component: Layout,
			children: [
				{
					path: '/',
					component: Home
				},
				// 以下路由展示如何在前端路由控制权限
				{
					path: 'right-test',
					component: (cb) => {
						if (!bus.userRights['某某权限']) {
							return cb(Error403);
						}
						cb(Home);
					}
				},
				{
					path: '*',
					name: '404',
					component: Error404
				}
			],
			beforeEnter(to, from, next) {
				bus.loading = false;
				bus.getUserInfo()
					.then(next, () => {
						router.replace('/login?returnUrl=' + encodeURIComponent(window.location.href));
					});
			}
		}
	]
});

// 重写router.push功能，确保可以跳转到外链
const originPush = router.push;
router.push = function (location, onComplete, onAbort) {
	if (isObject(location) && location.outer) {
		window.open(location.path);
		return;
	}
	originPush.call(this, location, onComplete, onAbort);
};

export default router;
