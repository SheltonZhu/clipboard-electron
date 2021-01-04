<template>
  <div class="nav">
    <div class="nav-content">
      <el-input
        style="width: 500px;"
        placeholder="请输入内容"
        v-model="searchValue"
        class="input-with-select"
        @keyup.enter.native="doSearch"
      >
        <el-select
          style="width: 80px; "
          v-model="selectType"
          slot="prepend"
          placeholder="请选择"
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="文本" value="Text"></el-option>
          <el-option label="链接" value="Link"></el-option>
          <el-option label="图片" value="Image"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="doSearch"
        ></el-button>
      </el-input>
      <!--      <el-menu-->
      <!--        :default-active="activeIndex"-->
      <!--        class="el-menu-bar"-->
      <!--        mode="horizontal"-->
      <!--      >-->
      <!--        <i class="el-menu-item el-icon-search search-btn" tabindex="0"></i>-->
      <!--        <el-menu-item index="/">-->
      <!--          <spot color="#aaabab" />-->
      <!--          剪贴板历史-->
      <!--        </el-menu-item>-->
      <!--        <el-menu-item index="/useful">-->
      <!--          <spot color="#ff625c" />-->
      <!--          实用链接-->
      <!--        </el-menu-item>-->
      <!--        <i class="el-menu-item el-icon-plus add-btn" tabindex="0"></i>-->
      <!--        <i class="el-menu-item el-icon-more-outline more-btn" tabindex="0"></i>-->
      <!--      </el-menu>-->
    </div>
  </div>
</template>

<script>
// import Spot from "@/renderer/components/Spot";

import { mapState } from "vuex";

export default {
  name: "Navigation",
  // components: { Spot },
  data: () => {
    return {
      activeIndex: "/",
      searchValue: "",
      selectType: ""
    };
  },
  computed: mapState(["clipboardData", "query", "table", "searchType"]),
  methods: {
    doSearch() {
      if (
        this.query !== this.searchValue.trim() ||
        this.selectType !== this.searchType
      ) {
        this.$store.commit("updateQuery", this.searchValue.trim());
        this.$store.commit("updateSearchType", this.selectType);
        this.$electron.ipcRenderer.send("init", {
          table: this.table,
          query: this.query,
          selectType: this.searchType
        });
        this.$electron.ipcRenderer.once("init-data", (event, args) => {
          this.$store.commit("updateClipboardData", args);
        });
      }
    }
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

.el-menu-item:not(.add-btn):not(.search-btn):not(.more-btn):focus,
.el-menu-item:not(.add-btn):not(.search-btn):not(.more-btn):hover {
  color: #fff !important;
  background: #b9b9b9d1 !important;
}

.add-btn,
.search-btn,
.more-btn {
  border-radius: 50%;
  padding: 0 9px;
}

.add-btn:focus,
.search-btn:focus,
.more-btn:focus,
.add-btn:hover,
.search-btn:hover,
.more-btn:hover {
  color: #2c3e50 !important;
  background: none !important;
}

/*.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,*/
/*.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {*/
/*  color: #fff !important;*/
/*  background: #b9b9b9d1 !important;*/
/*}*/
</style>
