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
    @dragstart.native="onDragStart"
    @dragend.native="onDragEnd"
    draggable
  >
    <div slot="header" class="clearfix">
      <div class="type">
        <p class="type">{{ data["name"] || data.copyType }}</p>
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
import { mapState } from "vuex";

export default {
  name: "ClipboardCard",
  props: {
    data: {
      type: Object,
      default: null
    },
    table: {
      type: String,
      default: ""
    }
  },
  mounted() {},
  computed: {
    ...mapState(["labelsData"]),
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
        return `${this.data.otherInfo.characterLength} 个字符`;
      } else if (this.isImage) {
        return `${this.data.otherInfo.width} ✖ ${this.data.otherInfo.height} 个像素`;
      }
      return "";
    }
  },
  methods: {
    onDragStart() {
      this.$store.commit("updateDragData", this.data);
    },
    onDragEnd() {
      this.$store.commit("updateDragData", null);
    },
    hideMainWindow() {
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
      this.copyPasteAndHide();
    },
    cardOnDblClick() {
      this.copyPasteAndHide();
    },
    copyAndHide() {
      this.hideMainWindow();
      this.write2clipboard();
    },
    copyPasteAndHide() {
      this.hideMainWindow();
      this.write2clipboardAndPaste();
    },
    write2clipboard() {
      if (this.isImage) {
        let image = this.$electron.remote.nativeImage.createFromDataURL(
          this.data.copyContent
        );
        this.$electron.remote.clipboard.writeImage(image);
      } else {
        this.$electron.remote.clipboard.writeText(this.data.copyContent);
      }
    },
    write2clipboardAndPaste() {
      this.write2clipboard();
      if (this.$electron.remote.getGlobal("config").get("directPaste"))
        this.$electron.remote.getGlobal("robot").keyTap("v", "control");
    },
    openLink() {
      this.hideMainWindow();
      this.execShellOpenLink(this.data.copyContent);
    },
    share2twitter() {
      this.execShellOpenLink("https://twitter.com/compose/tweet");
      this.copyAndHide();
    },
    share2email() {
      this.execShellOpenLink("mailto: somebody@somewhere.io");
      this.copyAndHide();
    },
    execShellOpenLink(link) {
      this.$electron.shell.openExternal(link);
    },
    deleteOneData() {
      // 有动画, clipboard 组件
      this.$parent.$parent.$parent.deleteOneData(this.data);
      // this.$parent.deleteOneData(this.data);
    },
    rename() {
      this.$electron.remote.getGlobal("shortcut").unregisterEsc();
      this.$prompt("", "重命名", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$electron.remote
            .getGlobal("db")
            .rename(this.data._id, value)
            .then(ret => {
              this.data.name = ret.name;
              this.$forceUpdate();
              window.log.info("renameCard: ", ret);
            });
        })
        .catch(() => {})
        .finally(() => {
          this.$electron.remote.getGlobal("shortcut").registerEsc();
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
      let type = blob.type.split("/")[1];
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = e => {
        let link = document.createElement("a");
        link.download = `${this.data._id}.${type}`;
        link.href = e.target.result;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    },
    add2favorite(_id) {
      const newData = {};
      newData.table = _id;
      newData.copyType = this.data.copyType;
      newData.copyTime = this.data.copyTime;
      newData.copyContent = this.data.copyContent;
      newData.otherInfo = this.data.otherInfo;

      this.$electron.remote
        .getGlobal("db")
        .create(newData)
        .then(ret => {
          window.log.info("add favorite :", ret);
        });
    },
    googleTranslate(url) {
      this.hideMainWindow();
      this.execShellOpenLink(`${url}${this.data.copyContent}`);
    },
    //生成右键菜单
    onContextmenu(event) {
      let children = [];
      for (let label of this.labelsData) {
        if (label._id !== this.table) {
          children.push({
            label: label.name,
            icon: "el-icon-star-off",
            onClick: () => {
              this.add2favorite(label._id);
            }
          });
        }
      }
      let items = [
        {
          label: "复制",
          icon: "el-icon-document-copy",
          onClick: this.copyAndHide
        },
        {
          label: "粘贴",
          icon: "el-icon-document-add",
          onClick: this.copyPasteAndHide
        },
        { label: "重命名", icon: "el-icon-edit", onClick: this.rename },

        {
          label: "删除",
          icon: "el-icon-delete",
          divided: true,
          onClick: this.deleteOneData
        },
        {
          label: "打开链接",
          icon: "el-icon-link",
          onClick: this.openLink,
          hidden: !this.isLink
        },
        {
          label: "保存图片",
          icon: "el-icon-picture-outline",
          onClick: this.contextMenuSaveImage,
          hidden: !this.isImage
        },
        {
          label: "快速查看（TODO）",
          icon: "el-icon-view",
          hidden: this.isLink
        },
        {
          label: "添加到收藏",
          icon: "el-icon-collection-tag",
          children: children
        },
        {
          label: "使用谷歌翻译",
          icon: "el-icon-camera",
          hidden: !this.isText,
          children: [
            {
              label: "中文(简)",
              icon: "el-icon-caret-right",
              onClick: () => {
                this.googleTranslate(
                  "https://translate.google.cn/?sl=auto&tl=zh-CN&text="
                );
              }
            },
            {
              label: "英语",
              icon: "el-icon-caret-right",
              onClick: () => {
                this.googleTranslate(
                  "https://translate.google.cn/?sl=auto&tl=zh-CN&text="
                );
              }
            },
            {
              label: "日语",
              icon: "el-icon-caret-right",
              onClick: () => {
                this.googleTranslate(
                  "https://translate.google.cn/?sl=auto&tl=ja&text="
                );
              }
            },
            {
              label: "中文(繁)",
              icon: "el-icon-caret-right",
              onClick: () => {
                this.googleTranslate(
                  "https://translate.google.cn/?sl=auto&tl=zh-TW&text="
                );
              }
            }
          ]
        },
        {
          label: "分享",
          icon: "el-icon-share",
          minWidth: 0,
          children: [
            {
              label: "邮件",
              icon: "el-icon-message",
              onClick: this.share2email
            },
            { label: "Twitter", onClick: this.share2twitter }
          ]
        }
      ];

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
  background-color: #ffffffb8 !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.context-menu .menu_item__available:hover,
.context-menu .menu_item__available:active,
.context-menu .menu_item_expand {
  background: #aaababbf !important;
  color: #fff !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}

.el-message-box input {
  background-color: #ffffff00 !important;
  backdrop-filter: saturate(180%) blur(5px) !important;
}
</style>
