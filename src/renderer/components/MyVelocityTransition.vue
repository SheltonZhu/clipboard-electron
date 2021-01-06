<template>
  <transition-group
    :name="name"
    :tag="tag"
    :css="css"
    :mode="mode"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition-group>
</template>

<script>
import Velocity from "velocity-animate";

export default {
  name: "MyVelocityTransition",
  props: {
    name: {
      type: String,
      default: "staggered-fade"
    },
    mode: {
      type: String,
      default: "out-in"
    },
    tag: {
      type: String,
      default: "div"
    },
    css: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: "380px"
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter(el, done) {
      let delay = el.dataset.index * 50;
      setTimeout(() => {
        Velocity(el, { opacity: 1, height: this.height }, { complete: done });
      }, delay);
    },
    leave(el, done) {
      let delay = el.dataset;
      setTimeout(() => {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    }
  }
};
</script>

<style scoped></style>
