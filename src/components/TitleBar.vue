<template>
  <div class="fake-title-bar">
    <div class="handle-bar">
      <!-- 如果是windows系统 就加上模拟的操作按钮-->
      <!--        <i class="el-icon-minus" @click="minimizeWindow"></i>-->
      <el-button circle class="el-icon-close" @click="closeWindow"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleBar",
  methods: {
    closeWindow() {
      this.$electron.remote.getCurrentWindow().hide();
    }
  }
};
</script>

<style scoped>
.fake-title-bar {
  text-align: right;
}
.fake-title-bar .handle-bar {
  margin-right: 5px;
  margin-top: 4px;
}
.fake-title-bar .el-button {
  background: #ff6059;
  border: 1px solid #e28a8a;
  padding: 4px;
  font-weight: bold;
}
</style>
