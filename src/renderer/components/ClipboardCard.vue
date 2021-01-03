<template>
  <el-card
    @contextmenu.native="onContextmenu"
    @keyup.enter.native="cardOnEnter"
    @dblclick.native="cardOnDblClick"
    class="box-card"
    :class="{ 'image-card': isImage, 'text-card': isText, 'link-card': isLink }"
    tabindex="100"
    @keyup.right.native="
      e => {
        select('right', e);
      }
    "
    @keyup.left.native="
      e => {
        select('left', e);
      }
    "
  >
    <div slot="header" class="clearfix">
      <div class="type">
        <p class="type">{{ data.copyType }}</p>
      </div>
      <div class="time">
        <p class="time">{{ new Date(data.copyTime) | moment("from") }}</p>
      </div>
    </div>
    <div class="card-text">
      <p v-if="isText">
        {{ data.copyContent }}
      </p>
      <el-link type="primary" icon="el-icon-link" v-if="isLink"
        >{{ data.copyContent }}
      </el-link>
      <img v-if="isImage" :src="data.copyContent" />
    </div>
    <div class="other-info">{{ formattedOtherInfo }}</div>
  </el-card>
</template>
<script>
export default {
  name: "ClipboardCard",
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  computed: {
    isText() {
      return this.data.copyType === "Text";
    },
    isImage() {
      return this.data.copyType === "Image";
    },
    isLink() {
      return this.data.copyType === "Link";
    },
    formattedOtherInfo() {
      if (this.isText) {
        return `${this.data.otherInfo} 个字符`;
      } else if (this.isImage) {
        return `${this.data.otherInfo.width} ✖ ${this.data.otherInfo.height} 个像素`;
      }
      return "";
    }
  },
  methods: {
    hideWin() {
      this.$electron.remote.getCurrentWindow().hide();
    },
    select(direction, e) {
      try {
        if (direction === "right") {
          e.target.nextElementSibling.focus();
        } else {
          e.target.previousElementSibling.focus();
        }
      } catch (e) {
        e.toString();
      }
    },
    cardOnEnter() {
      this.copyAndHide();
    },
    cardOnDblClick() {
      this.copyAndHide();
    },
    copyAndHide() {
      this.write2clipboard();
      this.$electron.remote.getCurrentWindow().hide();
    },
    write2clipboard() {
      this.$electron.remote.clipboard.writeText(this.data.copyContent);
    },
    openLink() {
      this.$electron.shell.openExternal(this.data.copyContent);
    },
    deleteOneData() {
      this.$electron.ipcRenderer.send("delete-one-data", {
        table: "historyData",
        id: this.data.id
      });
      this.$electron.ipcRenderer.once("one-deleted", (event, args) => {
        if (!args) {
          console.log("数据不存在：", this.data);
        }
        let dataArray = this.$parent.clipboardData;
        let position = dataArray.indexOf(this.data);
        this.$parent.clipboardData.splice(position, 1);
      });
    },
    //dataURL to blob
    dataURLtoBlob(dataUrl) {
      let arr = dataUrl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    contextMenuSaveImage() {
      let blob = this.dataURLtoBlob(this.data.copyContent);
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = e => {
        let link = document.createElement("a");
        link.download = `${this.data.id}.png`;
        link.href = e.target.result;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    },
    //生成右键菜单
    onContextmenu(event) {
      let items = [];
      items.push({ label: "粘贴为文本（TODO）", icon: "el-icon-document-add" });
      items.push({
        label: "复制",
        icon: "el-icon-document-copy",
        onClick: () => {
          this.copyAndHide();
        },
        divided: true
      });
      items.push({
        label: "删除",
        icon: "el-icon-delete",
        divided: true,
        onClick: () => {
          this.deleteOneData();
        }
      });
      if (this.isLink)
        items.push({
          label: "打开链接",
          icon: "el-icon-link",
          onClick: () => {
            this.openLink();
          }
        });
      if (this.isImage)
        items.push({
          label: "保存图片",
          icon: "el-icon-picture-outline",
          onClick: this.contextMenuSaveImage
        });

      items.push({
        label: "快速查看（TODO）",
        icon: "el-icon-view"
      });
      items.push({
        label: "分享（TODO）",
        icon: "el-icon-share",
        minWidth: 0,
        children: [
          {
            label: "截取可视化区域",
            onClick: () => {
              this.message = "截取可视化区域";
              console.log("截取可视化区域");
            }
          },
          { label: "截取全屏" }
        ]
      });

      this.$contextmenu({
        items: items,
        event,
        customClass: "context-menu",
        zIndex: 3
      });
      return false;
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
  height: 270px;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;
}

.box-card .card-text img {
  max-height: 270px;
  max-width: 300px;
}

.box-card .card-text p {
  text-align: left;
  margin: 0 auto;
}

.box-card .card-text a {
  text-align: left;
}

.box-card .other-info {
  color: #dbdbdb;
  font-size: smaller;
  margin-top: 4px;
}

.box-card {
  display: inline-block;
  width: 330px;
  height: 380px;
  margin-left: 20px;
  cursor: pointer;
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
}

/*灰: #aaabab 红: #ff625c 绿: #84e162 紫: #d58fe6 黄: #ffd74a 蓝#15bbf9*/
.text-card .el-card__header {
  background: #ffd74a;
}

.text-card p.type:before {
  content: "文本 | ";
}

.image-card .el-card__header {
  background: #d58fe6;
}

.image-card p.type:before {
  content: "图片 | ";
}

.link-card .el-card__header {
  background: #15bbf9;
}

.link-card p.type:before {
  content: "链接 | ";
}

.box-card .el-card__body {
  padding: 10px 15px !important;
}

.box-card {
  border-radius: 10px !important;
}

.context-menu {
  background-color: rgba(255, 255, 255, 0.72) !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.context-menu .menu_item__available:hover,
.context-menu .menu_item__available:active,
.context-menu .menu_item_expand {
  background: #aaababbf !important;
  color: #fff !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}
</style>
