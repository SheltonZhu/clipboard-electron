<template>
  <div
    class="clipboard"
    @wheel.prevent="onMouseWheel"
    ref="clipboard"
    v-loading="loading"
  >
    <my-velocity-transition>
      <clipboard-card
        v-for="(data, index) in clipboardData"
        :key="data._id"
        :data="data"
        :table="table"
        :data-index="index"
      />
    </my-velocity-transition>
    <div v-if="isEmpty">
      <!--        無了無了...😅-->
    </div>
  </div>
</template>
<script>
import ClipboardCard from "@/renderer/components/ClipboardCard";
import MyVelocityTransition from "@/renderer/components/MyVelocityTransition";
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
  components: { ClipboardCard, MyVelocityTransition },
  data: () => {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["searchType", "query", "loading"]),
    isEmpty() {
      return this.clipboardData.length === 0;
    }
  },
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
            if (this.searchType === "Image") this.updateClipboardData(data);
          } else {
            if (
              (!this.searchType || this.searchType === data.copyType) &&
              new RegExp(this.query, "i").test(data.copyContent)
            )
              this.updateClipboardData(data);
          }
        } else {
          if (!this.searchType || this.searchType === data.copyType) {
            this.updateClipboardData(data);
          }
        }
      }
    },
    updateClipboardData(data) {
      this.clipboardData.unshift(data);
      const limit = this.$electron.remote
        .getGlobal("config")
        .get("historyCapacityNum");
      if (this.clipboardData.length > limit) {
        this.clipboardData.pop();
      }
    },
    deleteOneData(data) {
      this.$electron.remote
        .getGlobal("db")
        .removeOne(this.table, data._id)
        .then(numRemoved => {
          window.log.info(`${numRemoved} removed.`);
          let position = this.clipboardData.indexOf(data);
          this.clipboardData.splice(position, 1);
        });
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
