<template>
  <Event v-bind="{ date, username, title: 'Cheer', color: '#52B1E7' }">
    <div :class="$style.bits">{{ bits }} bits (${{ (bits / 100).toFixed(2) }})</div>
    <div v-if="message" :class="$style.message">{{ message }}</div>
  </Event>
</template>

<script>
import Event from "../Event.vue";

export default {
  components: { Event },
  props: {
    date: Date,
    username: String,
    bits: Number,
    message: String,
  },
};
</script>

<style lang="scss" module>
.bits {
  // ...
}

.message {
  @apply mt-2 bg-gray-900 p-2 rounded;
}
</style>
