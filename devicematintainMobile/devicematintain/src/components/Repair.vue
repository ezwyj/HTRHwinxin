<template>
  <div>
    <mt-search v-model="value" cancel-text="取消"
               placeholder="搜索日期"></mt-search>
    <mt-cell title="标题文字"
             to="//github.com"
             is-link
             value="带链接">
    </mt-cell>
  </div>
</template>

<script>
  import MintUI from 'mint-ui';

export default {
  name: 'Repair',
  data () {
    return {
      SearchPara:''
    }
  }
}
</script>
<style>

</style>
