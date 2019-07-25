<template>
  <div :class="$style.wrapper" :style="{ borderColor: color }">
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
  props: {
    date: Date,
    username: String,
    title: String,
    color: String,
  },
};
</script>

<style lang="scss" module>
.wrapper {
  @apply flex border-l-4 text-sm;
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
