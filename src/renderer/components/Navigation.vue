<template>
  <div class="nav">
    <div class="nav-content">
      <el-input
        ref="searchBar"
        placeholder="请输入内容"
        size="small"
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
      <div class="clipboard-tag">
        <el-button :class="{ 'is-selected': this.table === 'historyData' }">
          <spot color="#aaabab" />
          剪贴板历史
        </el-button>
        <el-button>
          <spot color="#ff625c" />
          实用链接
        </el-button>
      </div>
      <el-button class="el-icon-plus add-btn"></el-button>
      <el-button
        @click="more"
        class="el-icon-more-outline more-btn"
      ></el-button>
    </div>
  </div>
</template>

<script>
import Spot from "@/renderer/components/Spot";

import { mapState } from "vuex";

export default {
  name: "Navigation",
  components: { Spot },
  data: () => {
    return {
      activeIndex: "/",
      searchValue: "",
      selectType: "",
      isSearching: false
    };
  },
  mounted() {},
  watch: {
    selectType() {
      this.changeType();
    }
  },
  computed: mapState(["clipboardData", "query", "table", "searchType"]),
  methods: {
    doSearch() {
      this.execSearch();
    },
    changeType() {
      this.execSearch();
    },
    execSearch() {
      this.$store.commit("updateQuery", this.searchValue.trim());
      this.$store.commit("updateSearchType", this.selectType);
      this.$electron.remote
        .getGlobal("db")
        .readAll(this.table, this.query, this.searchType)
        .then(ret => {
          this.$store.commit("updateClipboardData", ret);
        });
    },
    more() {
      this.$confirm("清空剪贴板历史?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const numRemoved = await this.$electron.remote
          .getGlobal("db")
          .removeAll(this.table);
        this.$store.commit("updateClipboardData", []);
        this.$message({
          message: `${numRemoved} 条已删除！`,
          type: "success"
        });
      });
    }
  }
};
</script>

<style scoped>
.nav {
  margin: 15px 0;
}

.nav .clipboard-tag {
  display: inline-flex;
}

.nav .el-button {
  color: #2c3e50;
  background: #ffffff00;
  border: 1px solid #ffffff00;
  font-weight: bold !important;
  padding: 8px 10px !important;
}

.input-with-select {
  width: 350px;
  margin: 0 35px;
}

.clipboard-tag .el-button {
  margin: 0 5px;
}

.clipboard-tag .el-button:hover {
  color: #fff;
  background: #b9b9b9d1 !important;
}

.clipboard-tag .is-selected {
  color: #fff;
  background: #b9b9b9d1 !important;
}

.add-btn,
.search-btn,
.more-btn {
  border-radius: 50%;
  padding: 0 9px;
}

.more-btn {
  float: right;
}

.el-select-dropdown__item.selected,
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #b9b9b9d1;
  color: #fff;
}
</style>
<style>
/*.el-input-group__append,*/
/*.el-input--suffix,*/
.el-select-dropdown {
  background-color: rgba(255, 255, 255, 0.72) !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.input-with-select > .el-input__inner {
  background-color: rgba(255, 255, 255, 0.72);
}

.el-message--success {
  background-color: #f0f9ebbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}
</style>
