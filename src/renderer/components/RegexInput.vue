<template>
  <div class="regex-input" style="margin: 5px 5px;">
    <p v-if="!editing" style="margin: 0;" @dblclick="onDblclick">
      {{ data }}
      <el-button @click="removeRegex" class="el-icon-minus"></el-button>
    </p>
    <el-input
      v-if="editing"
      v-model="newData"
      ref="editInput"
      @blur="onBlur"
      @keyup.enter.native="$event.target.blur"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "RegexInput",
  props: {
    data: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      editing: false,
      newData: ""
    };
  },
  mounted() {
    this.newData = this.data;
  },
  methods: {
    onDblclick() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.editInput.focus();
        this.$refs.editInput.select();
      });
    },
    onBlur() {
      if (this.newData.trim() !== "" && this.newData.trim() !== this.data) {
        this.$nextTick(() => {
          this.$parent.$parent.$parent.regexList.splice(
            this.index,
            1,
            this.newData
          );
        });
      }
      this.editing = false;
    },
    removeRegex() {
      this.$parent.$parent.$parent.regexList.splice(this.index, 1);
    }
  }
};
</script>

<style scoped>
.regex-input {
  border: 2px solid #ffffff00;
}

.regex-input:hover {
  border: 2px solid #409eff;
}
.el-button {
  padding: 0 !important;
  border-radius: 50% !important;
  float: right !important;
}
</style>
<style>
.el-input__inner {
  text-align: center !important;
  height: 20px !important;
}
</style>
