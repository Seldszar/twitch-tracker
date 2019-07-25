<template>
  <Event v-bind="{ date, username, title: 'Raid', color: '#E558FF' }">
    <div :class="$style.viewerCount">{{ viewerCount }} viewer(s)</div>
  </Event>
</template>

<script>
import Event from "../Event.vue";

export default {
  components: { Event },
  props: {
    date: Date,
    username: String,
    viewerCount: Number,
  },
};
</script>

<style lang="scss" module>
.viewerCount {
  @apply text-xs;
}
</style>
