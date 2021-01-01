<template>
  <div class="nav">
    <el-button class="el-icon-search search-btn" circle></el-button>
    <router-link to="/">Clipboard History</router-link>
    <router-link to="/">剪贴板历史</router-link>
  </div>
</template>

<script>
export default {
  name: "Navigation"
};
</script>

<style scoped>
.nav .el-button {
  background: #ffffff00;
  border: 1px solid #ffffff00;
}
</style>
