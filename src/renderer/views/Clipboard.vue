<template>
  <div class="clipboard" @wheel.prevent="onMouseWheel" ref="clipboard">
    <clipboard-card
      v-for="data in clipboardData"
      :key="data._id"
      :data="data"
      :table="table"
    />
  </div>
</template>
<script>
import ClipboardCard from "@/renderer/components/ClipboardCard";
import { mapState } from "vuex";

export default {
  props: {
    table: {
      type: String,
      default: "historyData"
    },
    clipboardData: {
      type: Array,
      default: () => []
    }
  },
  name: "Clipboard",
  components: { ClipboardCard },
  data: () => {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: mapState(["searchType", "query"]),
  methods: {
    init() {
      this.$electron.ipcRenderer.on(
        "clipboard-text-changed",
        this.insertOneData
      );
      this.$electron.ipcRenderer.on(
        "clipboard-image-changed",
        this.insertOneData
      );
    },
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
    },
    insertOneData(event, data) {
      if (this.table === "historyData") {
        if (this.query) {
          if (data.copyType === "Image") {
            if (this.searchType === "Image") this.clipboardData.unshift(data);
          } else {
            if (
              (!this.searchType || this.searchType === data.copyType) &&
              new RegExp(this.query, "i").test(data.copyContent)
            )
              this.clipboardData.unshift(data);
          }
        } else {
          if (!this.searchType || this.searchType === data.copyType) {
            this.clipboardData.unshift(data);
          }
        }
      }
    }
  }
};
</script>
<style scoped>
.clipboard {
  height: 410px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  outline: none;
}
</style>
