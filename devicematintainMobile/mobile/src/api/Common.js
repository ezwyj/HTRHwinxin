import http from 'mpit-utils/libs/http';

export default {
	login(badge) {
		return http.post('Common/Login', {
			badge
		});
	},
	logout() {
		return http.post('Common/Logout');
	},
	getUserInfo() {
		return http.get('Common/GetUserInfo');
	},
	getRoles() {
		return http.get('Common/GetRoles');
	}
};