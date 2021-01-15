<template>
  <div id="settings">
    <div class="title-bar" style="-webkit-app-region: drag">
      <title-bar />
    </div>
    <div class="content">
      <el-tabs type="border-card">
        <!--    个性化    -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-magic-stick"></i> 个性化 </span>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">背景虚化</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="bgBlur"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">背景图</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="bgPic"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="bgPic">
            <el-col :offset="12">
              <!--       背景图       -->
              <div class="bg-image-container">
                <el-image
                  :class="{ 'bg-selected': src === imageUrl }"
                  class="bg-image"
                  v-for="(src, idx) in bgList"
                  :key="idx"
                  :src="src"
                  fit="cover"
                  @click="selectBg"
                ></el-image>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">背景颜色</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-color-picker
                  v-model="bgColor"
                  show-alpha
                  :predefine="predefineColors"
                >
                </el-color-picker>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <!--    通用    -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-cpu"></i> 通用 </span>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">开机启动</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="autoBoot"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">开启 Direct Paste</div>
              <div class="tip">自动插入片段到当前应用</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="directPaste"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">窗口失焦隐藏剪贴板</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="hideWhenBlur"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">在通知区域显示图标</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="trayIcon"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type">卡片图标</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-switch
                  v-model="iconEnable"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="12">
              <div class="type" style="margin-top: 15px;">历史记录容量</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-slider
                  tooltip-class="capacity-slider"
                  :show-tooltip="false"
                  v-model="historyCapacity"
                  :min="0"
                  :max="4"
                  :step="1"
                  :marks="{ 0: '10', 1: '50', 2: '100', 3: '500', 4: '∞' }"
                  @change="changeNum"
                >
                </el-slider>
              </div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col
              class="warn-info"
              :offset="12"
              :span="12"
              v-if="historyCapacity === 4"
            >
              ⚠设置为无限会使用更多的存储，进而导致卡顿⚠
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :offset="12" :span="12">
              <div>
                <el-button class="clear-history" @click="clearHistory">
                  清除剪贴板历史
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-position"></i> 快捷键 </span>
          <div style="text-align: center">
            <el-row class="row">
              <el-col :span="12">
                <div class="type">激活剪贴板</div>
              </el-col>
              <el-col :span="12" class="shortcut">
                <div>
                  Alt + V
                </div>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="12">
                <div class="type">显示下一个标签</div>
              </el-col>
              <el-col :span="12" class="shortcut">
                Alt + ]
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="12">
                <div class="type">显示上一个标签</div>
              </el-col>
              <el-col :span="12" class="shortcut">
                Alt + [
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="12">
                <div class="type">快速粘贴</div>
              </el-col>
              <el-col :span="12" class="shortcut">
                <el-dropdown type="primary">
                  <span class="el-dropdown-link">
                    Alt<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>Ctrl</el-dropdown-item>
                    <el-dropdown-item>Shift</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                + 1..9
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-marketing"></i> 规则 </span>
          <div style="text-align: center">
            自定义关键字（正则）
            <div>
              <p>
                account
              </p>
            </div>
            <div>
              <el-button class="el-icon-plus"></el-button>
              <el-button class="el-icon-minus"></el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TitleBar from "@/renderer/components/TitleBar";
export default {
  name: "Settings",
  components: { TitleBar },
  data: () => {
    return {
      bgBlur: true,
      bgPic: true,
      bgList: [],
      bgColor: "rgba(255, 255, 255, 0.72)",
      predefineColors: [
        "rgba(255, 255, 255, 0.72)",
        "rgba(255,179,167, 0.72)",
        "rgba(255, 69, 0, 0.68)",
        "rgba(144, 240, 144, 0.5)",
        "hsla(209, 100%, 56%, 0.73)",
        "rgba(35, 37, 35, 0.71)",
        "rgb(255, 120, 0)",
        "hsl(181, 100%, 37%)",
        "rgba(250, 212, 0, 1)"
      ],
      autoBoot: false,
      directPaste: true,
      hideWhenBlur: false,
      imageUrl: "/bg/default.png",
      trayIcon: true,
      iconEnable: true,
      historyCapacity: 1,
      activeColor: "#15bbf9",
      inactiveColor: "#aaabab"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    bgBlur() {
      this.$electron.ipcRenderer.send("settings", {
        key: "bgBlur",
        value: this.bgBlur
      });
    },
    bgPic() {
      this.$electron.ipcRenderer.send("settings", {
        key: "bgPic",
        value: this.bgPic
      });
    },
    imageUrl() {
      this.$electron.ipcRenderer.send("settings", {
        key: "imageUrl",
        value: this.imageUrl
      });
    },
    bgColor() {
      this.$electron.ipcRenderer.send("settings", {
        key: "bgColor",
        value: this.bgColor
      });
    },
    autoBoot() {
      this.$electron.ipcRenderer.send("settings", {
        key: "autoBoot",
        value: this.autoBoot
      });
    },
    directPaste() {
      this.$electron.ipcRenderer.send("settings", {
        key: "directPaste",
        value: this.directPaste
      });
    },
    hideWhenBlur() {
      this.$electron.ipcRenderer.send("settings", {
        key: "hideWhenBlur",
        value: this.hideWhenBlur
      });
    },
    trayIcon() {
      this.$electron.ipcRenderer.send("settings", {
        key: "trayIcon",
        value: this.trayIcon
      });
    },
    iconEnable() {
      this.$electron.ipcRenderer.send("settings", {
        key: "iconEnable",
        value: this.iconEnable
      });
    }
  },
  methods: {
    init() {
      const config = this.$electron.remote.getGlobal("config");
      this.bgBlur = config.get("bgBlur");
      this.bgPic = config.get("bgPic");
      this.imageUrl = config.get("imageUrl");
      this.bgList = config.get("bgList");
      this.bgColor = config.get("bgColor");
      this.autoBoot = config.get("autoBoot");
      this.directPaste = config.get("directPaste");
      this.trayIcon = config.get("trayIcon");
      this.hideWhenBlur = config.get("hideWhenBlur");
      this.iconEnable = config.get("iconEnable");
      this.historyCapacity = config.get("historyCapacity");
    },
    changeNum() {
      this.$electron.ipcRenderer.send("settings", {
        key: "historyCapacity",
        value: this.historyCapacity
      });
    },
    selectBg(e) {
      this.imageUrl = "/bg/" + e.target.src.split("/").pop();
    },
    clearHistory() {
      this.$electron.remote.getGlobal("shortcut").unregisterEsc();
      this.$confirm("清空剪贴板历史?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$electron.ipcRenderer.send("settings", {
            key: "clearHistory",
            value: true
          });
        })
        .catch(() => {})
        .finally(() => {
          this.$electron.remote.getGlobal("shortcut").registerEsc();
        });
    }
  }
};
</script>

<style scoped>
.row {
  margin: 10px 5px;
}

.type {
  text-align: right;
}

.type:after {
  content: "：";
  text-align: left;
}
.tip {
  text-align: right;
  color: #aaabab;
  font-size: smaller;
  margin-top: 2px;
}
.tip:after {
  content: " ";
}
.switch {
  margin: 0 10px;
}
.warn-info {
  color: #ffc259;
}
.clear-history {
  margin-top: 10px;
  padding: 2px 20px;
}
.shortcut {
  text-align: left;
}

#settings {
  background: #fff;
}
.fake-title-bar {
  background: #d6d0d5;
  padding: 2px 0;
}

.el-tabs {
  box-shadow: none;
  border: none;
}
</style>
<style>
body {
  margin: 0 !important;
  background: #eae9ea;
}
.el-tabs__content {
  background: #eae9ea !important;
}
.el-tabs .el-tabs__header {
  background: #d6d0d5 !important;
  border-bottom: 1px solid #b5b1b5 !important;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #000 !important;
  border-left: #b8b6ba !important;
  border-right: #b8b6ba !important;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #000 !important;
  background-color: #b8b6ba !important;
  border-left: #b8b6ba !important;
  border-right: #b8b6ba !important;
}
.el-tabs__nav {
  left: 50%;
  transform: translateX(-50%) !important;
}
.switch .el-slider {
  margin: 0 10px;
}
.bg-image-container {
  display: flex;
  flex-direction: column;
}
.bg-image {
  flex: 1;
  margin-right: 5px;
  border: 2px solid #ffffff00;
  width: 160px;
  height: 50px;
}
.bg-selected {
  border: 2px solid #409eff;
}
</style>
