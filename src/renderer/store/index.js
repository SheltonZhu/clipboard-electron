import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clipboardData: [],
    query: "",
    table: "historyData",
    searchType: "",
    labelsData: [],
    dragData: null,
    loading: false
  },
  mutations: {
    updateQuery(state, query) {
      state.query = query;
    },
    updateClipboardData(state, clipboardData) {
      state.clipboardData = clipboardData;
    },
    updateSearchType(state, searchType) {
      state.searchType = searchType;
    },
    updateTable(state, tableName) {
      state.table = tableName;
    },
    updateLabelsData(state, labelsData) {
      state.labelsData = labelsData;
    },
    updateDragData(state, data) {
      state.dragData = data;
    },
    loading(state, status) {
      state.loading = status;
    }
  },
  actions: {},
  modules: {}
});
