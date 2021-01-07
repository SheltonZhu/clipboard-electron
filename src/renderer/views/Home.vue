<template>
  <div id="home">
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
import Clipboard from "@/renderer/components/Clipboard";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: { Navigation, TitleBar, Clipboard },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: mapState(["clipboardData", "query", "table"]),
  data: () => {
    return {};
  },
  methods: {
    initData() {
      this.$electron.remote
        .getGlobal("db")
        .readAll(this.table)
        .then(allData => {
          this.$store.commit("updateClipboardData", allData);
        });
    },
    init() {
      this.$store.state.table = "historyData";
      this.$store.state.query = "";
      this.initData();
      let holder = document.getElementById("home");
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
body {
  margin: 0 auto;
  background-image: url("../../assets/bg.png");
  background-size: cover;
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
  background-color: #ffffffbf;
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

.el-message-box__wrapper {
  backdrop-filter: saturate(180%) blur(5px);
}
.el-message-box {
  background-color: #ffffffbf !important;
  backdrop-filter: saturate(180%) blur(5px);
}
</style>
