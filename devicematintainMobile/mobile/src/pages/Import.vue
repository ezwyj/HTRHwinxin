<template>
	<div>
		<h1>VueWebTemplate</h1>
		<el-table :data="list">
			<el-table-column label="Key" prop="Key"></el-table-column>
			<el-table-column label="Value" prop="Value"></el-table-column>
		</el-table>
	</div>
</template>

<script>
	import bus from '../bus';
	import WorkApi from '../api/Work';

	export default {
		data() {
			return {
				msg: '数据绑定示例',
				list: []
			};
		},
		created() {
			bus.pageNav = '首页';
			this.getList();
		},
		methods: {
			async getList() {
				const { data } = await WorkApi.getList();
				if (data.State) {
					this.list = data.Data;
				}
			}
		}
	};
</script>
