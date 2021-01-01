<template>
  <div class="nav">
    <!--    <el-button class="el-icon-search search-btn" circle></el-button>-->
    <!--    <router-link to="/">Clipboard History</router-link>-->
    <!--    <router-link to="/">剪贴板历史</router-link>-->

    <div class="nav-content">
      <el-menu
        :default-active="activeIndex"
        router="router"
        class="el-menu-bar"
        mode="horizontal"
      >
        <i class="el-menu-item el-icon-search search-btn" tabindex="0"></i>
        <el-menu-item index="/">
          <spot color="#aaabab" />
          剪贴板历史
        </el-menu-item>
        <el-menu-item index="/useful"
          ><spot color="#ff625c" />
          有用的链接
        </el-menu-item>
        <i class="el-menu-item el-icon-plus add-btn" tabindex="0"></i>
      </el-menu>
    </div>
  </div>
</template>

<script>
import Spot from "@/components/Spot";

export default {
  name: "Navigation",
  components: { Spot },
  comments: {
    Spot
  },
  data: () => {
    return {
      activeIndex: "/"
    };
  }
};
</script>

<style scoped>
.el-menu {
  background: #00000000;
  border-bottom: none !important;
}

.nav {
  margin: 20px 0;
}

.nav .el-button {
  background: #ffffff00;
  border: 1px solid #ffffff00;
}

.el-menu-bar {
  white-space: nowrap;
}

.el-menu-item {
  margin: 0 20px !important;
  color: #2c3e50 !important;
  border-radius: 5px;
  border-bottom: none !important;
  height: 30px !important;
  line-height: 30px !important;
  font-weight: bold;
  float: none !important;
  display: inline-block;
}

.el-menu-item.is-active {
  color: #fff !important;
  border-bottom: none;
  background: #b9b9b9d1;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: #fff !important;
  background: #b9b9b9d1;
}

.add-btn,
.search-btn {
  border-radius: 50%;
  padding: 0 9px;
}
</style>
