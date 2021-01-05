<template>
  <div class="nav">
    <div class="nav-content">
      <el-input
        ref="searchBar"
        placeholder="请输入内容"
        size="small"
        v-model="searchValue"
        class="input-with-select"
        @keyup.native="doSearch"
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
        <el-button
          :class="{ 'is-selected': isSelected }"
          @click="mainLabelClick"
        >
          <spot color="#aaabab" />
          剪贴板历史
        </el-button>

        <favorite-label
          v-for="(labelData, idx) in labels"
          :key="idx"
          :label-data="labelData"
        />
        <div v-if="newLabelVisible">
          <el-button
            class="add-box is-selected"
            style="padding-top: 0 !important;padding-bottom: 0 !important;"
          >
            <spot color="#fe9700" />
            <el-input
              size="small"
              v-model="newLabelValue"
              style="width: 100px"
              @blur="doAddLabel"
              @keyup.enter.native="$event.target.blur"
              ref="newLabelInput"
            ></el-input>
          </el-button>
        </div>
      </div>

      <el-button
        class="el-icon-plus add-btn"
        @click="clickLabelAdder"
      ></el-button>

      <el-dropdown
        style="float: right;cursor: pointer"
        trigger="click"
        :tabindex="-1"
      >
        <el-button class="el-dropdown-link el-icon-more-outline more-btn">
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-delete" @click.native="clearClipboard"
            >清空剪贴板历史
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-setting" @click.native="openSettings"
            >设置
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-info"
            divided
            @click.native="openAbout"
            >关于
          </el-dropdown-item>
          <el-dropdown-item icon="el-icon-question" @click.native="openHelp"
            >帮助
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-s-promotion"
            divided
            @click.native="quitApp"
            >退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Spot from "@/renderer/components/Spot";
import FavoriteLabel from "@/renderer/components/FavoriteLabel";
import { mapState } from "vuex";
import config from "electron-cfg";

export default {
  name: "Navigation",
  components: { Spot, FavoriteLabel },
  data: () => {
    return {
      activeIndex: "/",
      searchValue: "",
      selectType: "",
      isSearching: false,
      labels: [],
      newLabelValue: "未命名",
      newLabelVisible: false
    };
  },
  mounted() {
    this.initLabels();
  },
  watch: {
    selectType() {
      this.changeType();
    },
    table() {
      this.searchValue = "";
      if (this.selectType) {
        this.selectType = "";
      } else {
        this.doSearch();
      }
    }
  },
  computed: {
    ...mapState(["clipboardData", "query", "table", "searchType"]),
    isSelected() {
      return this.table === "historyData";
    }
  },
  methods: {
    initLabels() {
      this.$electron.remote
        .getGlobal("labelDb")
        .readAll()
        .then(ret => {
          this.labels = ret;
          this.$store.commit("updateLabelsData", this.labels);
        });
    },
    clickLabelAdder() {
      this.newLabelVisible = true;
      this.$nextTick(() => {
        this.$refs.newLabelInput.focus();
      });
    },
    doAddLabel() {
      if (!this.newLabelValue.trim() || this.newLabelValue === "未命名") {
        this.newLabelValue = "未命名";
        this.newLabelVisible = false;
      } else {
        this.$electron.remote
          .getGlobal("labelDb")
          .create({
            name: this.newLabelValue,
            color: "#fe9700"
          })
          .then(ret => {
            this.labels.push(ret);
            this.newLabelVisible = false;
            window.log.info(`[renderer]: addOneLabel: ${JSON.stringify(ret)}.`);
            this.$store.commit("updateLabelsData", this.labels);
          });
      }
    },
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
    clearClipboard() {
      if (!this.clipboardData.length > 0) {
        return;
      }
      this.$electron.remote.globalShortcut.unregister("Esc");
      this.$confirm("清空剪贴板历史?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const numRemoved = await this.$electron.remote
            .getGlobal("db")
            .removeAll(this.table);
          this.$store.commit("updateClipboardData", []);
          this.$message({
            message: `${numRemoved} 条已删除！`,
            type: "success",
            duration: 1000
          });
        })
        .catch(() => {})
        .finally(() => {
          this.$electron.remote.globalShortcut.register("Esc", () => {
            this.$electron.remote.getCurrentWindow().hide();
          });
        });
    },
    mainLabelClick() {
      if (!this.isSelected) this.$store.commit("updateTable", "historyData");
    },
    quitApp() {
      this.$electron.remote.app.exit();
    },
    openAbout() {
      this.$electron.remote.dialog.showMessageBox({
        title: "Electron Clipboard",
        message: "Electron Clipboard",
        detail: config.get("about")
      });
    },
    openHelp() {
      this.$electron.remote.dialog.showMessageBox({
        title: "使用手册",
        message: "使用手册",
        detail: config.get("helpInfo")
      });
    },
    openSettings() {}
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

.input-with-select {
  width: 350px;
  margin: 0 35px;
}

.add-btn,
.more-btn {
  border-radius: 50%;
  padding: 0 9px;
}

.more-btn {
  float: right;
}

.el-select-dropdown__item.selected,
.el-select-dropdown__item:hover {
  background-color: #b9b9b9d1;
  color: #fff;
}

.el-dropdown-menu__item:hover,
.el-dropdown-menu__item.selected {
  background-color: #b9b9b9d1 !important;
  color: #fff !important;
}
</style>
<style>
.nav .el-button {
  color: #2c3e50 !important;
  background: #ffffff00 !important;
  border: none !important;
  font-weight: bold !important;
  padding: 8px 10px !important;
}

.clipboard-tag .el-button {
  margin: 0 5px;
}

.clipboard-tag .el-button:hover {
  color: #fff !important;
  background: #b9b9b9d1 !important;
}

.clipboard-tag .is-selected {
  color: #fff !important;
  background: #b9b9b9d1 !important;
}

/*.el-input-group__append,*/
/*.el-input--suffix,*/
.el-select-dropdown {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.input-with-select > .el-input__inner {
  background-color: #ffffffbf;
}

.el-message--success {
  background-color: #f0f9ebbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.el-dropdown-menu {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}
</style>
