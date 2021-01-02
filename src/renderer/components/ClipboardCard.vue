<template>
  <el-card
    @keyup.enter.native="
      () => {
        cardOnSelected(data.copyContent);
      }
    "
    @dblclick.native="
      () => {
        cardOnDblClick(data.copyContent);
      }
    "
    class="box-card"
    tabindex="100"
    @keyup.right.native="$event.target.nextElementSibling.focus()"
    @keyup.left.native="$event.target.previousElementSibling.focus()"
  >
    <div slot="header" class="clearfix">
      <div class="type">
        <p class="type">{{ data.copyType }}</p>
      </div>
      <div class="time">
        <p class="time">{{ new Date(data.copyTime).toLocaleTimeString() }}</p>
      </div>
    </div>
    <div class="card-text">
      <p>
        {{ data.copyContent }}
      </p>
    </div>
    <div class="other-info">
      {{ data.otherInfo }}
    </div>
  </el-card>
</template>
<script>
export default {
  name: "ClipboardCard",
  props: {
    color: {
      type: String,
      default: "#aaabab" //灰: #aaabab 红: #ff625c 绿: #84e162 紫: #d58fe6 黄: #ffd74a 蓝#15bbf9
    },
    data: {
      type: Object,
      default: null
    }
  },
  mounted() {},
  methods: {
    hideWin() {
      this.$electron.remote.getCurrentWindow().hide();
    },
    cardOnSelected(data) {
      this.pasteAndHide(data);
    },
    cardOnDblClick(data) {
      this.pasteAndHide(data);
    },
    pasteAndHide(data) {
      this.write2clipboard(data);
      this.$electron.remote.getCurrentWindow().hide();
    },
    write2clipboard(data) {
      // this.$electron.remote.clipboard.writeText(src);
      console.log(data);
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
.box-card {
  display: inline-block;
  width: 330px;
  height: 380px;
  margin-left: 20px;
  cursor: pointer;
}

.box-card {
  border: 5px solid #ffffff00;
  background-clip: padding-box !important;
  outline: none;
}

.box-card:focus {
  border: 5px solid #2480fc;
}
</style>
<style>
.box-card .el-card__header {
  padding: 0 20px !important;
  text-align: left;
  background: #85e263;
}

.box-card .el-card__body {
  padding: 10px 15px !important;
}

.box-card {
  border-radius: 10px !important;
}
</style>
