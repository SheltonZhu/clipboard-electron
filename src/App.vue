<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
body,
html {
  margin: 0 auto;
  background-image: url("https://www.apple.com/hk/iphone-12/images/overview/ios/widgets_static__bz9drr2nqvhy_medium_2x.jpg");
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
  backdrop-filter: saturate(180%) blur(20px);
  /*filter: saturate(180%) blur(20px);*/
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#nav {
  padding: 30px;
}
</style>
