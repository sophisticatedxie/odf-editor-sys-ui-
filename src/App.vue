<template>
  <div
    id="app"
    style="height: 99%;"
    v-loading="$store.getters.GET_LOADING"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!-- <a-spin :spinning="true" style="height:100%"> -->
    <router-view />
    <!-- </a-spin> -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
</style>
