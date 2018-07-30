/**
 * 总线
 * 保存跨页面的数据或一些公用数据，如用户信息和权限信息等
 */ 

'use strict';

import Vue from 'vue';
import CommonApi from './api/Common';
import { isObject } from 'mpit-utils/libs/utils';

export default new Vue({
	data() {
		return {
			userInfo: {},
			userRights: {},
			loading: false,
			asideCollapse: false,
			activeMenu: '',
			pageNav: ''
		};
	},
	methods: {
		// 更新字段值
		updateFields(payload) {
			for (let key in payload) {
				let data = this;
				let keys = key.split('.');
				let keysLength = keys.length;
		
				keys.forEach((k, idx) => {
					if (idx + 1 < keysLength) {				
						if (!isObject(data)) {
							throw new Error(`${key} is not illegal`);
						}
						data = data[k];
					} else {
						data[k] = payload[key];
					}
				});
			}
		},
		getUserInfo() {
			return new Promise(async (resolve, reject) => {			
				if (this.userInfo.Badge) {
					resolve();
					return;
				}
				//const { data } = await CommonApi.getUserInfo();
				if (true) {
					this.userInfo = '管理员';
					 const rights = {};
					 //data.Data.Rights.forEach(right => {
					 //	(rights[right.ObjectName] = rights[right.ObjectName] || {})[right.OperationName] = right.IsHaveRight;
					 //});
					this.userRights = rights;
					resolve();
				} else {
					reject();
				}
			});
		}
	}
});