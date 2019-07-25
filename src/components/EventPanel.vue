<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.title">{{ title }} ({{ events.length }})</div>
      <button :class="$style.clearButton" @click="$emit('acknowledge', events)">Clear</button>
    </div>
    <div :class="$style.events">
      <div
        v-for="event in events"
        :class="$style.event"
        :key="event.id"
        @click="$emit('acknowledge', [event])"
      >
        <component v-bind="event" :is="getEventComponent(event)" />
      </div>
    </div>
  </div>
</template>

<script>
import AnonymousSubscriptionGiftEvent from "./events/AnonymousSubscriptionGiftEvent.vue";
import CheerEvent from "./events/CheerEvent.vue";
import HostEvent from "./events/HostEvent.vue";
import RaidEvent from "./events/RaidEvent.vue";
import SubscriptionEvent from "./events/SubscriptionEvent.vue";
import SubscriptionGiftEvent from "./events/SubscriptionGiftEvent.vue";
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
        case "anonsubgift":
          return AnonymousSubscriptionGiftEvent;

        case "cheer":
          return CheerEvent;

        case "host":
          return HostEvent;

        case "raid":
          return RaidEvent;

        case "sub":
          return SubscriptionEvent;

        case "subgift":
          return SubscriptionGiftEvent;

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
  @apply flex flex-shrink-0 h-8 justify-between bg-gray-900 text-xs text-gray-500;
}

.title {
  @apply px-2 self-center;
}

.clearButton {
  @apply border-l border-r border-gray-800 flex items-center mr-1 px-2;

  &:hover {
    @apply bg-gray-800;
  }

  &:active {
    @apply bg-gray-700;
  }

  &:focus {
    @apply outline-none;
  }
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
