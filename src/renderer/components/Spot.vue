<template>
  <div class="circle" :style="'background:' + color"></div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#ff625c" //灰: #aaabab 红: #ff625c 绿: #84e162 紫: #d58fe6 黄: #ffd74a 蓝#15bbf9
    }
  },
  name: "Spot"
};
</script>

<style scoped>
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>
