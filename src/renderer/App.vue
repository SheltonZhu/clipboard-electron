<template>
  <div id="app">
    <title-bar :table="table" v-if="false" />
    <el-header>
      <navigation />
    </el-header>
    <el-main>
      <clipboard :table="table" :clipboardData="this.clipboardData" />
    </el-main>
  </div>
</template>
<script>
import Navigation from "@/renderer/components/Navigation";
import TitleBar from "@/renderer/components/TitleBar";
import Clipboard from "@/renderer/views/Clipboard";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { Navigation, TitleBar, Clipboard },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: mapState(["clipboardData", "query", "table"]),
  data: () => {
    return {
      // table: "historyData",
      // query: "",
      // clipboardData: []
    };
  },
  methods: {
    initData() {
      this.$electron.ipcRenderer.send("init", {
        table: this.table,
        query: this.query
      });
      this.$electron.ipcRenderer.once("init-data", (event, arg) => {
        this.$store.commit("updateClipboardData", arg);
      });
    },
    init() {
      this.initData();
      let holder = document.getElementById("app");
      holder.ondragover = this.returnFalse;
      holder.ondragleave = this.returnFalse;
      holder.ondragend = this.returnFalse;
      holder.ondrop = this.onDrop;
    },
    onDrop(e) {
      e.preventDefault();
      for (let f of e.dataTransfer.files) {
        console.log("File(s) you dragged here: ", f.path);
        console.log(f.name, f.type, f.size);
      }
      return false;
    },
    returnFalse() {
      return false;
    }
  }
};
</script>
<style>
body,
html {
  margin: 0 auto;
  background-image: url("../assets/bg.png");
  background-size: cover;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-shadow: 3px -3px 10px 0 rgba(0, 0, 0, 0.1);
  /*margin-top: 3px;*/
  background-color: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(180%) blur(5px);
  width: 100%;
  position: fixed;
}

.el-main {
  padding: 0 20px !important;
  height: 410px;
}

.el-header {
  height: unset !important;
}
</style>
