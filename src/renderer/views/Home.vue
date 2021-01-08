<template>
  <div
    class="bg"
    :style="{
      'background-image': bgPic
        ? imageUrl
          ? 'url(' + imageUrl + ')'
          : 'url(' + defaultBg + ')'
        : 'none'
    }"
  >
    <div
      id="home"
      :class="{ 'blur-bg': bgBlur }"
      :style="{
        'background-color': bgColor
      }"
    >
      <el-header>
        <navigation />
      </el-header>
      <el-main>
        <clipboard :table="table" :clipboardData="this.clipboardData" />
      </el-main>
    </div>
  </div>
</template>
<script>
import Navigation from "@/renderer/components/Navigation";
import Clipboard from "@/renderer/components/Clipboard";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: { Navigation, Clipboard },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: mapState(["clipboardData", "query", "table"]),
  data: () => {
    return {
      bgPic: true,
      bgBlur: true,
      bgColor: "#ffffffbf",
      defaultBg: "/bg/default.png",
      imageUrl:
        "https://pbs.twimg.com/media/ErMIGO8UcAAQOkx?format=jpg&name=large"
    };
  },
  methods: {
    init() {
      this.initSettings();
      this.initData();
      this.initFileDragEvent();
    },
    initFileDragEvent() {
      let holder = document.getElementById("home");
      holder.ondragover = this.returnFalse;
      holder.ondragleave = this.returnFalse;
      holder.ondragend = this.returnFalse;
      holder.ondrop = this.onDrop;
    },
    initData() {
      this.$electron.remote
        .getGlobal("db")
        .readAll(this.table)
        .then(allData => {
          this.$store.commit("updateClipboardData", allData);
        });
    },
    initSettings() {
      const config = this.$electron.remote.getGlobal("config");
      this.$electron.ipcRenderer.on("change-settings", (event, args) => {
        window.log.info("settings: ", args);
        if (args.key === "clearHistory") {
          this.clearHistory();
        } else if (args.key === "historyCapacity") {
          const historyCapacityNumMap = {
            0: "10",
            1: "50",
            2: "100",
            3: "500",
            4: "∞"
          };
          config.set("historyCapacityNum", historyCapacityNumMap[args.value]);
          this.$electron.remote
            .getGlobal("db")
            .checkLimit()
            .then(removeNum => {
              window.log.info("limit! remove number: ", removeNum);
              this.initData();
            });
        } else {
          this[args.key] = args.value;
        }
      });
      this.bgPic = config.get("bgPic");
      this.bgBlur = config.get("bgBlur");
      this.bgColor = config.get("bgColor");
      this.defaultBg = config.get("defaultBg");
    },
    onDrop(e) {
      e.preventDefault();
      for (let f of e.dataTransfer.files) {
        console.log("File(s) you dragged here: ", f.path);
        console.log(f.name, f.type, f.size);
      }
      return false;
    },
    clearHistory() {
      this.$electron.remote
        .getGlobal("db")
        .removeAll("historyData")
        .then(numRemoved => {
          this.$store.commit("updateClipboardData", []);
          this.$message({
            message: `${numRemoved} 条已删除！`,
            type: "success",
            duration: 1000
          });
          window.log.info(`${numRemoved} clear.`);
        });
    },
    returnFalse() {
      return false;
    }
  }
};
</script>
<style>
body {
  margin: 0 auto;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-shadow: 3px -3px 10px 0 rgba(0, 0, 0, 0.1);
  /*margin-top: 3px;*/
  width: 100%;
  position: fixed;
}

.bg {
  height: 472px;
  background-size: cover;
}

.blur-bg {
  backdrop-filter: saturate(180%) blur(5px);
}

.el-main {
  padding: 0 20px !important;
  height: 410px;
}

.el-header {
  height: unset !important;
}

.el-message-box__wrapper {
  backdrop-filter: saturate(180%) blur(5px);
}

.el-message-box {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px);
}
</style>
