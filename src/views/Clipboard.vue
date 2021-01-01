<template>
  <div class="clipboard" @wheel.prevent="onMouseWheel" ref="clipboard">
    <el-card
      v-for="i in 20"
      :key="i"
      @keyup.enter.native="cardOnSelected"
      @dblclick.native="cardOnDblClick"
      class="box-card"
      tabindex="100"
      @keyup.right.native="$event.target.nextElementSibling.focus()"
      @keyup.left.native="$event.target.previousElementSibling.focus()"
    >
      <div slot="header" class="clearfix">
        <div class="type">
          <p class="type">Link</p>
        </div>
        <div class="time">
          <p class="time">{{ new Date().toLocaleString() }}</p>
        </div>
      </div>
      <div class="card-text">
        <p>
          -site:*csdn.net
        </p>
        <p>{{ i }}</p>
        <code>
          export default { data() { return { currentDate: new Date() }; } }
        </code>
        <code>
          export default { data() { return { currentDate: new Date() }; } }
        </code>
        <code>
          export default { data() { return { currentDate: new Date() }; } }
        </code>
        <code>
          export default { data() { return { currentDate: new Date() }; } }
        </code>
        <code>
          export default { data() { return { currentDate: new Date() }; } }
        </code>
        <p class="time">{{ new Date().toLocaleString() }}</p>

        <p class="time">{{ new Date().toLocaleString() }}</p>

        <p class="time">{{ new Date().toLocaleString() }}</p>
      </div>
      <div class="other-info">
        xxx
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Clipboard",
  components: {},
  data: () => {
    return {};
  },
  mounted() {},
  methods: {
    hideWin() {
      this.$electron.remote.getCurrentWindow().hide();
    },
    onMouseWheel(e) {
      // e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
    },
    cardOnSelected() {
      this.pasteAndHide();
    },
    cardOnDblClick() {
      this.pasteAndHide();
    },
    pasteAndHide() {
      this.$electron.remote.getCurrentWindow().hide();
    }
  }
};
</script>
<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.clipboard {
  height: 410px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

.clipboard .box-card {
  display: inline-block;
  width: 330px;
  height: 380px;
  margin-left: 20px;
  cursor: pointer;
}

.clipboard .box-card {
  border: 5px solid #ffffff00;
  background-clip: padding-box;
  outline: none;
}

.clipboard .box-card:focus {
  border: 5px solid #2480fc;
}

.box-card p.time {
  color: #fff;
  margin: 10px 0;
  font-size: smaller;
}

.box-card p.type {
  margin: 15px 0 5px 0;
  font-size: large;
  color: #fff;
}

.box-card .card-text {
  height: 275px;
  overflow: hidden;
  text-align: left;
  white-space: normal;
}

.box-card .other-info {
  color: #dbdbdb;
  font-size: smaller;
}
</style>
<style>
.clipboard .el-card__header {
  padding: 0 20px !important;
  text-align: left;
  background: aquamarine;
}

.el-card .el-card__body {
  padding: 10px 15px !important;
}

.clipboard .el-card {
  border-radius: 10px;
}
</style>
