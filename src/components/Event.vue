<template>
  <div :class="$style.wrapper" :style="{ '--event-color': color }">
    <div :class="$style.inner">
      <div :class="$style.headline">
        <div :class="$style.username">{{ username }}</div>
        <div :class="$style.time">{{ title }} - <RelativeTime v-bind="{ date }" /></div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import RelativeTime from "./RelativeTime.vue";

export default {
  components: { RelativeTime },
  inheritAttrs: false,
  props: {
    date: Date,
    username: String,
    title: String,
    color: String,
  },
};
</script>

<style lang="scss" module>
@keyframes fadeOut {
  to {
    display: none;
    opacity: 0;
  }
}

.wrapper {
  @apply flex border-l-4 relative text-sm;

  border-color: var(--event-color);

  &::after {
    @apply absolute inset-0;

    animation: fadeOut 1s forwards;
    background-color: var(--event-color);
    content: "";
  }
}

.inner {
  @apply p-2 flex-1;
}

.headline {
  @apply flex justify-between mb-1;
}

.time {
  @apply text-xs text-gray-500;
}

.username {
  @apply font-bold;
}
</style>
