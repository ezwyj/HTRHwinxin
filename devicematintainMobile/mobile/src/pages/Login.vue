<template>
	<el-form 
		style="width: 400px; margin: 0 auto; padding-top: 200px;"
		label-width="100px"
		@submit.native.prevent="login">
		<el-form-item label="用户名">
			<el-input v-model.trim="badge" autofocus></el-input>
		</el-form-item>
	</el-form>
</template>

<script>
import CommonApi from '../api/Common';

export default {
	data() {
		return {
			badge: '',
			returnUrl: this.$route.query.returnUrl
		};
	},
	methods: {
		async login() {
			if (!/\d{6}/.test(this.badge)) {
				alert('请输入六位工号');
				return;
			}
			const { data } = await CommonApi.login(this.badge);
			if (data.State) {
				location.href = this.returnUrl;
			}
		}
	}
};
</script>
