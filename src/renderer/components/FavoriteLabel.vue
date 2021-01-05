<template>
  <span>
    <el-button
      v-if="!isRenaming"
      :class="{ 'is-selected': isSelected }"
      @click="onLabelClick"
      @contextmenu.native="onContextmenu"
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
      newName: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.newName = this.labelData.name;
    });
  },
  computed: {
    ...mapState(["table"]),
    isSelected() {
      return this.table === this.labelData._id;
    }
  },
  methods: {
    onLabelClick() {
      if (!this.isSelected)
        this.$store.commit("updateTable", this.labelData._id);
    },
    removeLabel() {
      const _id = this.labelData._id;
      this.$electron.remote
        .getGlobal("labelDb")
        .removeLabelAndData(_id)
        .then(numRemoved => {
          window.log.info(`[renderer]: ${numRemoved} removed.`);
          let dataArray = this.$parent.labels;
          let position = dataArray.indexOf(this.labelData);
          this.$parent.labels.splice(position, 1);
          if (this.isSelected) {
            this.$store.commit("updateTable", "historyData");
          }
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

<style scoped></style>
