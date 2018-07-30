<template>
	<el-container id="app">
		<el-aside
			class="aside"
			:class="[asideCollapse ? 'collapsed' : '']"
			:width="asideCollapse ? '64px' : '230px'">
			<div class="logo">
				<router-link to="/">				
					<i class="fa-home"></i>
					<h1>VueWebTemplate</h1>
				</router-link>
			</div>
			<el-menu :default-active="activeMenu"
					 background-color="#001529"
					 text-color="rgba(255,255,255,.8)"
					 active-text-color="#F8E71C"
					 :collapse="asideCollapse"
					 router>
				<el-menu-item index="/">
					<i class="fa-dashboard"></i>
					<span slot="title">首页</span>
				</el-menu-item>
				<el-menu-item index="/right-test">
					<i class="fa-dashboard"></i>
					<span slot="title">测试权限</span>
				</el-menu-item>
				<el-menu-item index="/Matinatin">
					<i class="fa-dashboard"></i>
					<span slot="title">维护</span>
				</el-menu-item>
				<el-menu-item index="/Repair">
					<i class="fa-dashboard"></i>
					<span slot="title">维修</span>
				</el-menu-item>
			</el-menu>
		</el-aside>
		<el-container class="content">
			<header class="header">
				<i class="fa-outdent aside-trigger" @click="updateFields({ asideCollapse: !asideCollapse })"></i>
				<h2>{{pageNav}}</h2>
				<div class="user-info">
					<i class="fa-user"></i>
					<span>您好，{{userInfo.Name}}</span>
					<span class="logout" @click.prevent.stop="logout">退出</span>
				</div>
			</header>
			<main class="main">
				<router-view></router-view>
			</main>
		</el-container>
		<loading
			icon-top="200px"
			:value="loading"></loading>
	</el-container>
</template>

<script>
import bus from '../bus';

export default {
	computed: {
		userInfo() {
			return bus.userInfo;
		},
		loading() {
			return bus.loading;
		},
		asideCollapse() {
			return bus.asideCollapse;
		},
		activeMenu() {
			return bus.activeMenu;
		},
		pageNav() {
			return bus.pageNav;
		}
	},
	methods: {
		updateFields: bus.updateFields,
		logout() {
			this.$router.push('/logout?returnUrl=' + encodeURIComponent(window.location.href));
		}
	}
};
</script>

<style lang="scss">
#app {
	height: 100%;	

	.aside {
		transition: all .2s;
		background-color: #304152;
		box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
		position: relative;
		z-index: 20;

		a {
			color: inherit;
		}

		.logo {
			height: 60px;
			padding-left: 20px;
			line-height: 60px;
			white-space: nowrap;
			overflow: hidden;
			color: #fff;

			i, h1 {
				display: inline-block;
				vertical-align: middle;
			}
			i {
				font-size: 30px;
			}		
			h1 {
				margin: 0 0 0 10px;
				font-size: 20px;
			}
		}

		.el-menu {
			padding: 10px 0;
			border: 0;
			transition: width .2s;
		}

		.el-menu-item {
			height: 40px;
			line-height: 40px;

			i {
				width: 1.2em;
				color: inherit;
			}
		}

		&.collapsed {
			.logo {
				padding-left: 16px;

				h1 {
					display: none;
				}
			}

			.el-menu-item {
				font-size: 16px;

				span {
					display: none;
				}
			}
		}
	}	

	.content {
		flex-direction: column;
		overflow-y: auto;
	}

	.header {
		flex: 0 0 50px;
		display: flex;
		padding: 0;
		line-height: 50px;
		background-color: #fff;
		box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
		
		.aside-trigger {
			display: block;
			padding: 0 20px;
			margin-right: 20px;
			font-size: 18px;
			cursor: pointer;

			&:hover {
				color: #1890ff;
				background: #e6f7ff;
			}
		}

		> h2 {
			flex: 1;
			margin: 0;
			font-size: 16px;
			font-weight: 500;
		}

		.user-info {
			font-size: 14px;
		}

		.logout {
			display: inline-block;
			color: inherit;
			padding: 0 20px;
			cursor: pointer;

			&:hover {
				color: #1890ff;
				background: #e6f7ff;
			}
		}
	}

	.main {
		position: relative;
		padding: 20px;
		flex: 1;
	}

	@media only screen and (max-width: 992px) {
		.main {
			padding: 20px;
		}
	}
}
</style>