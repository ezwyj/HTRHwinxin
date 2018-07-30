<template>
  <div id="app">
    <mt-header fixed title="512B"></mt-header>
    <router-view />
    <mt-tabbar >
      <mt-tab-item id="one">
        <img slot="icon" src="assets/logo.png">
        首页
      </mt-tab-item>
      <mt-tab-item id="two">
        <img slot="icon" src="assets/logo.png">
        维
      </mt-tab-item>
      <mt-tab-item id="three">
        <img slot="icon" src="assets/logo.png">
        保
      </mt-tab-item>
      <mt-tab-item id="four">
        <img slot="icon" src="assets/logo.png">
        巡
      </mt-tab-item>
      <mt-tab-item id="five">
        <img slot="icon" src="./assets/logo.png">
        <router-link to="/home">配置</router-link>
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
