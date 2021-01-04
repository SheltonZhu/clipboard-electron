<template>
  <div class="clipboard" @wheel.prevent="onMouseWheel" ref="clipboard">
    <clipboard-card
      v-for="(data, idx) in clipboardData"
      :key="idx"
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
    return {
      // clipboardData: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: mapState(["searchType"]),
  methods: {
    init() {
      // this.initData();
      this.$electron.ipcRenderer.on(
        "clipboard-text-changed",
        this.insertOneData
      );
      this.$electron.ipcRenderer.on(
        "clipboard-image-changed",
        this.insertOneData
      );
    },
    initData() {
      this.$electron.ipcRenderer.send("init", {
        table: this.table,
        query: this.query
      });
      this.$electron.ipcRenderer.once("init-data", (event, arg) => {
        this.clipboardData = arg;
      });
    },
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
    },
    insertOneData(event, arg) {
      if (
        this.table === "historyData" &&
        (!this.searchType || this.searchType === arg.copyType)
      )
        this.clipboardData.unshift(arg);
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
