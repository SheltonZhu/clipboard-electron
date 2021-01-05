<template>
  <el-button
    :class="{ 'is-selected': isSelected }"
    @click="onLabelClick"
    @contextmenu.native="onContextmenu"
  >
    <spot :color="labelData.color" />
    {{ labelData.name }}
  </el-button>
</template>

<script>
import Spot from "@/renderer/components/Spot";
import { mapState } from "vuex";

export default {
  props: {
    labelData: {
      type: Object
    }
  },
  name: "FavoriteLabel",
  components: {
    Spot
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
    onContextmenu(event) {
      let items = [
        {
          label: "重命名（TODO）",
          icon: "el-icon-edit-outline",
          onClick: () => {}
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
