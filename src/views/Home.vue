<template>
  <div class="home">
    <img alt="Vue logo" @click="hideWin" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// import {BrowserWindow} from "electron";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  data: () => {
    return { win: null };
  },
  mounted() {
    // this.win = BrowserWindow.getAllWindows();
  },
  methods: {
    hideWin() {
      // this.win.hide();
    }
  }
};
</script>
