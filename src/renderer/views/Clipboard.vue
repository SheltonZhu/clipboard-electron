<template>
  <div class="clipboard" @wheel.prevent="onMouseWheel" ref="clipboard">
    <clipboard-card
      v-for="(data, idx) in clipboardData"
      :key="idx"
      :data="data"
    />
  </div>
</template>
<script>
import ClipboardCard from "@/renderer/components/ClipboardCard";

export default {
  name: "Clipboard",
  components: { ClipboardCard },
  data: () => {
    return {
      clipboardData: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.$electron.ipcRenderer.send("readyPush");
      this.$electron.ipcRenderer.on("init-data", (event, arg) => {
        this.clipboardData = arg;
      });

      this.$electron.ipcRenderer.on(
        "clipboard-text-changed",
        this.insertOneData
      );
    },
    onMouseWheel(e) {
      e.preventDefault();
      this.$refs.clipboard.scrollLeft += parseInt(e.deltaY);
    },
    insertOneData(event, arg) {
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
