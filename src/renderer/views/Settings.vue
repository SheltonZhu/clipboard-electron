<template>
  <div id="settings">
    <div class="title-bar"></div>
    <div class="content">
      <el-tabs type="border-card">
        <!--    个性化    -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-magic-stick"></i> 个性化 </span>
          <el-row class="row">
            <el-col :span="8">
              <div class="type">背景虚化：</div>
            </el-col>
            <el-col :span="2">
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
            <el-col :span="8">
              <div class="type">背景图：</div>
            </el-col>
            <el-col :span="8">
              <div class="switch">
                <el-switch
                  v-model="bgPic"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="text"></div>
            </el-col>
          </el-row>
          <el-row v-if="bgPic">
            <el-col :offset="8">
              <!--       背景图       -->
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="8">
              <div class="type">背景颜色：</div>
            </el-col>
            <el-col :span="8">
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
            <el-col :span="8">
              <div class="type">开机启动：</div>
            </el-col>
            <el-col :span="2">
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
            <el-col :span="8">
              <div class="type">开启 Direct Paste：</div>
              <div class="tip">自动插入片段到当前应用</div>
            </el-col>
            <el-col :span="8">
              <div class="switch">
                <el-switch
                  v-model="directPaste"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="text"></div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="8">
              <div class="type">窗口失焦隐藏剪贴板：</div>
            </el-col>
            <el-col :span="8">
              <div class="switch">
                <el-switch
                  v-model="hideWhenBlur"
                  :active-color="activeColor"
                  :inactive-color="inactiveColor"
                >
                </el-switch>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="text"></div>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col :span="8">
              <div class="type">在通知区域显示图标：</div>
            </el-col>
            <el-col :span="8">
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
            <el-col :span="8">
              <div class="type">历史记录容量：</div>
            </el-col>
            <el-col :span="16">
              <div class="text">
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
            <el-col :offset="8" :span="16">
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
          快捷键
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-marketing"></i> 规则 </span>
          规则
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data: () => {
    return {
      bgBlur: true,
      bgPic: true,
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
      trayIcon: true,
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
    }
  },
  methods: {
    init() {
      const config = this.$electron.remote.getGlobal("config");
      this.bgBlur = config.get("bgBlur");
      this.bgPic = config.get("bgPic");
      this.bgColor = config.get("bgColor");
      this.autoBoot = config.get("autoBoot");
      this.directPaste = config.get("directPaste");
      this.trayIcon = config.get("trayIcon");
      this.hideWhenBlur = config.get("hideWhenBlur");
      this.historyCapacity = config.get("historyCapacity");
    },
    changeNum() {
      this.$electron.ipcRenderer.send("settings", {
        key: "historyCapacity",
        value: this.historyCapacity
      });
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

.text {
  text-align: left;
}

.tip {
  text-align: right;
  color: #aaabab;
  font-size: smaller;
  margin-top: 2px;
}
.clear-history {
  margin-top: 10px;
  padding: 2px 20px;
}
</style>
