<template>
  <span
    :class="{ 'is-droppable': isDroppable }"
    @drop="onCardDrop"
    @dragenter="onCardDragIn"
    @dragleave="onCardDragOut"
  >
    <el-button
      v-if="!isRenaming"
      :class="{ 'is-selected': isSelected }"
      @click="onLabelClick"
      @contextmenu.native="onContextmenu"
      ref="dragBtn"
    >
      <spot :color="labelData.color" />
      {{ labelData.name }}
    </el-button>
    <div v-if="isRenaming">
      <el-button
        class="add-box is-selected"
        style="padding-top: 0 !important;padding-bottom: 0 !important;"
      >
        <spot :color="labelData.color" />
        <el-input
          size="small"
          v-model="newName"
          style="width: 100px"
          @blur="doRenameLabel"
          @keyup.enter.native="$event.target.blur"
          ref="renameLabelInput"
        ></el-input>
      </el-button>
    </div>
  </span>
</template>

<script>
import Spot from "@/renderer/components/Spot";
import { mapState } from "vuex";

export default {
  name: "FavoriteLabel",
  props: {
    labelData: {
      type: Object
    }
  },
  components: {
    Spot
  },
  data: () => {
    return {
      isRenaming: false,
      newName: "",
      isDroppable: false,
      dragEl: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.newName = this.labelData.name;
    });
  },
  computed: {
    ...mapState(["table", "dragData"]),
    isSelected() {
      return this.table === this.labelData._id;
    }
  },
  methods: {
    onCardDrop() {
      if (this.labelData._id !== this.dragData.table) {
        const newData = {};
        newData.table = this.labelData._id;
        newData.copyType = this.dragData.copyType;
        newData.copyTime = this.dragData.copyTime;
        newData.copyContent = this.dragData.copyContent;
        newData.otherInfo = this.dragData.otherInfo;
        this.$electron.remote
          .getGlobal("db")
          .create(newData)
          .then(ret => {
            window.log.info(
              `[renderer]: add favorite: ${JSON.stringify(ret)}.`
            );
          });
      }
      this.isDroppable = false;
    },
    onCardDragIn(e) {
      this.dragEl = e.target;
      if (this.labelData._id !== this.dragData.table) {
        this.isDroppable = true;
      }
    },
    onCardDragOut(e) {
      if (this.dragEl === e.target) this.isDroppable = false;
    },
    onLabelClick() {
      if (!this.isSelected)
        this.$store.commit("updateTable", this.labelData._id);
    },
    removeLabel() {
      this.$electron.remote.globalShortcut.unregister("Esc");
      this.$confirm(
        `确定删除【${this.labelData.name}】?删除的记录不可恢复！`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const _id = this.labelData._id;
          this.$electron.remote
            .getGlobal("labelDb")
            .removeLabelAndData(_id)
            .then(numRemoved => {
              window.log.info(`[renderer]: ${numRemoved} removed.`);
              let dataArray = this.$parent.labels;
              let position = dataArray.indexOf(this.labelData);
              this.$parent.labels.splice(position, 1);
              this.$store.commit("updateLabelsData", this.$parent.labels);
              if (this.isSelected) {
                this.$store.commit("updateTable", "historyData");
              }
            });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {})
        .finally(() => {
          this.$electron.remote.globalShortcut.register("Esc", () => {
            this.$electron.remote.getCurrentWindow().hide();
          });
        });
    },
    onRenameLabel() {
      this.isRenaming = true;
      this.$nextTick(() => {
        this.$refs.renameLabelInput.focus();
      });
    },
    doRenameLabel() {
      if (!this.newName.trim() || this.newName.trim() === this.labelData.name) {
        this.newName = this.labelData.name;
        this.isRenaming = false;
      } else {
        this.$electron.remote
          .getGlobal("labelDb")
          .rename(this.labelData._id, this.newName)
          .then(newLabel => {
            window.log.info(`[renderer]: update: ${JSON.stringify(newLabel)}.`);
            this.labelData.name = newLabel.name;
            this.isRenaming = false;
          });
      }
    },
    onContextmenu(event) {
      let items = [
        {
          label: "重命名",
          icon: "el-icon-edit-outline",
          onClick: this.onRenameLabel
        },
        {
          label: "删除",
          icon: "el-icon-delete",
          onClick: this.removeLabel,
          divided: true
        },
        { label: "" }
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
.is-droppable {
  background: #15bbf9;
  border-radius: 5px;
}
</style>
