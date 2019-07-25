<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.title">{{ title }}</div>
    </div>
    <div :class="$style.events">
      <div
        v-for="event in events"
        :class="$style.event"
        :key="event.id"
        @click="$emit('acknowledge', event)"
      >
        <component v-bind="event" :is="getEventComponent(event)" />
      </div>
    </div>
  </div>
</template>

<script>
import CheerEvent from "./events/CheerEvent.vue";
import HostEvent from "./events/HostEvent.vue";
import RaidEvent from "./events/RaidEvent.vue";
import SubscriptionEvent from "./events/SubscriptionEvent.vue";
import SubscriptionMysteryGiftEvent from "./events/SubscriptionMysteryGiftEvent.vue";
import ResubscriptionEvent from "./events/ResubscriptionEvent.vue";

export default {
  props: {
    title: String,
    events: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getEventComponent(event) {
      switch (event.type) {
        case "cheer":
          return CheerEvent;

        case "host":
          return HostEvent;

        case "raid":
          return RaidEvent;

        case "sub":
          return SubscriptionEvent;

        case "submysterygift":
          return SubscriptionMysteryGiftEvent;

        case "resub":
          return ResubscriptionEvent;
      }
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  @apply flex flex-col h-full bg-gray-800;
}

.header {
  @apply flex-shrink-0 p-2 bg-gray-900 text-xs text-gray-500;
}

.events {
  @apply flex-1 flex flex-col overflow-y-scroll;

  &::-webkit-scrollbar {
    @apply h-1 w-1;
  }

  &::-webkit-scrollbar-track,
  &::-webkit-scrollbar-thumb {
    @apply bg-gray-900;

    background-clip: padding-box;
    border-left: 1px solid theme("colors.gray.900");
  }

  &::-webkit-scrollbar-track {
    // ...
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-700;

    &:hover {
      @apply bg-gray-600;
    }
  }
}

.event {
  @apply flex-shrink-0 bg-gray-800 cursor-pointer border-b border-gray-900;

  &:hover {
    @apply bg-gray-700;
  }
}
</style>
