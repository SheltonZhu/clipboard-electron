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
          <el-row class="row vertically-center">
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

          <el-row class="row vertically-center">
            <el-col :span="12">
              <div class="type">标签字体颜色</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-color-picker
                  v-model="labelFontColor"
                  show-alpha
                  :predefine="predefineLabelFontColors"
                >
                </el-color-picker>
              </div>
            </el-col>
          </el-row>

          <el-row class="row vertically-center">
            <el-col :span="12">
              <div class="type">标签选中时字体颜色</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-color-picker
                  v-model="labelFontColorSelect"
                  show-alpha
                  :predefine="predefineLabelFontColorsSelect"
                >
                </el-color-picker>
              </div>
            </el-col>
          </el-row>

          <el-row class="row vertically-center">
            <el-col :span="12">
              <div class="type">标签选中时背景颜色</div>
            </el-col>
            <el-col :span="12">
              <div class="switch">
                <el-color-picker
                  v-model="labelBgColorSelect"
                  show-alpha
                  :predefine="predefineLabelBgColorsSelect"
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
          <el-row class="row vertically-center">
            <el-col :span="12">
              <div class="type">历史记录容量</div>
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

        <!--    快捷键    -->
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
            <el-row class="row">
              <el-col :span="12">
                <div class="type">搜索</div>
              </el-col>
              <el-col :span="12" class="shortcut">
                Alt + S
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!--    规则    -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-marketing"></i> 规则 </span>
          <div style="text-align: center">
            自定义关键字（正则）
            <div
              style="background: #fff;height: 300px;overflow-y: scroll;margin: 10px 0;"
            >
              <regex-input
                v-for="(regex, idx) in regexList"
                :key="idx"
                :index="idx"
                :data="regex"
              >
              </regex-input>
            </div>
            <div>
              <el-button @click="addRegex" class="el-icon-plus"></el-button>
            </div>
          </div>
        </el-tab-pane>

        <!--    关于    -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-info"></i> 关于 </span>
          <div style="text-align: center">
            <el-row class="row" style="display:flex;align-items:center;">
              <el-image
                src="/default_icon.png"
                @click="openGithub"
                fit="center"
                style="margin: 0px 20px 10px 50px;cursor: pointer"
              />
              <div style="font-size: 30px;font-weight: bold">{{ appName }}</div>
              <div style="margin: 10px 0 0 10px;">{{ appVersion }}</div>
              <el-badge
                v-if="hasUpdate"
                @click.native="downloadNewVersion"
                value="new"
                style="cursor: pointer"
              />
            </el-row>

            <el-row class="row" v-for="(p, idx) in about" :key="idx">
              <el-col :span="6">
                <div class="type">{{ p.split(": ")[0] }}</div>
              </el-col>
              <el-col :span="18">
                <div class="shortcut">{{ p.split(": ")[1] }}</div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TitleBar from "@/renderer/components/TitleBar";
import RegexInput from "@/renderer/components/RegexInput";
import pkg from "@/../package.json";

export default {
  name: "Settings",
  components: { TitleBar, RegexInput },
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
      labelFontColor: "rgba(44, 62, 80, 1)",
      predefineLabelFontColors: [
        "#2c3e50",
        "#fff",
        "#000",
        "rgba(99, 145, 230, 1)",
        "rgba(249, 252, 44, 1)",
        "rgba(239, 38, 85, 1)",
        "rgba(202, 38, 239, 1)"
      ],
      labelFontColorSelect: "rgba(255, 255, 255, 1)",
      predefineLabelFontColorsSelect: ["rgba(255, 255, 255, 1)"],
      labelBgColorSelect: "rgba(185,185,185,0.82)",
      predefineLabelBgColorsSelect: ["rgba(185, 185, 185, 0.82)"],
      autoBoot: false,
      directPaste: true,
      hideWhenBlur: false,
      imageUrl: "/bg/default.png",
      trayIcon: true,
      iconEnable: true,
      historyCapacity: 1,
      activeColor: "#15bbf9",
      inactiveColor: "#aaabab",
      regexList: [],
      hasUpdate: false,
      downloadUrl: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    about() {
      let about = this.$electron.remote
        .getGlobal("config")
        .get("about")
        .split("\n");
      return about;
    },
    appName() {
      return pkg.productName;
    },
    appVersion() {
      return pkg.version;
    }
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
    labelFontColor() {
      this.$electron.ipcRenderer.send("settings", {
        key: "labelFontColor",
        value: this.labelFontColor
      });
    },
    labelFontColorSelect() {
      this.$electron.ipcRenderer.send("settings", {
        key: "labelFontColorSelect",
        value: this.labelFontColorSelect
      });
    },
    labelBgColorSelect() {
      this.$electron.ipcRenderer.send("settings", {
        key: "labelBgColorSelect",
        value: this.labelBgColorSelect
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
    },
    regexList() {
      this.$electron.ipcRenderer.send("settings", {
        key: "regexList",
        value: this.regexList
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
      this.labelFontColor = config.get("labelFontColor");
      this.labelFontColorSelect = config.get("labelFontColorSelect");
      this.labelBgColorSelect = config.get("labelBgColorSelect");
      this.autoBoot = config.get("autoBoot");
      this.directPaste = config.get("directPaste");
      this.trayIcon = config.get("trayIcon");
      this.hideWhenBlur = config.get("hideWhenBlur");
      this.iconEnable = config.get("iconEnable");
      this.historyCapacity = config.get("historyCapacity");
      this.regexList = config.get("regexList");
      this.$electron.ipcRenderer.once("update", (e, url) => {
        window.log.info("has update url: ", url);
        this.hasUpdate = true;
        this.downloadUrl = url;
      });
    },
    changeNum() {
      this.$electron.ipcRenderer.send("settings", {
        key: "historyCapacity",
        value: this.historyCapacity
      });
    },
    selectBg(e) {
      const url = e.target.src;
      if (this.isLocalBg(url)) this.imageUrl = "/bg/" + url.split("/").pop();
      else this.imageUrl = url;
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
    },
    addRegex() {
      this.regexList.unshift("新规则");
    },
    isLocalBg(url) {
      return url.startsWith("http://localhost:8080/bg/");
    },
    downloadNewVersion() {
      if (this.downloadUrl)
        this.$electron.remote.shell.openExternal(this.downloadUrl);
    },
    openGithub() {
      this.$electron.remote.shell.openExternal(
        this.$electron.remote.getGlobal("config").get("github")
      );
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

.clear-history,
.check-update {
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

.vertically-center {
  display: flex;
  align-items: center;
}
</style>
