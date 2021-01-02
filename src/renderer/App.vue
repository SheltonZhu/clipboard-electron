<template>
  <div id="app">
    <title-bar v-if="false" />
    <el-header>
      <navigation />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </div>
</template>
<script>
import Navigation from "@/renderer/components/Navigation";
import TitleBar from "@/renderer/components/TitleBar";

export default {
  name: "App",
  components: { Navigation, TitleBar }
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
