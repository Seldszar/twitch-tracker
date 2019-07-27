<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.title">{{ title }} ({{ events.length }})</div>
      <button :class="$style.clearButton" @click="$emit('removeEvents', events)">Clear</button>
    </div>
    <div :class="$style.events">
      <div
        v-for="event in events"
        :class="[$style.event, { [$style.acknowledged]: event.acknowledged }]"
        :key="event.id"
        @mouseenter="event.acknowledged = true"
      >
        <div :class="$style.body">
          <component v-bind="event" :is="getEventComponent(event)" />
        </div>
        <button :class="$style.removeButton" @click="$emit('removeEvents', [event])">
          <svg viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
          </svg>
        </button>
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
  @apply flex flex-shrink-0 bg-gray-800 border-b border-gray-900 relative;

  .body {
    @apply flex-1;
  }
}

.removeButton {
  @apply bg-gray-900 border-l border-t border-gray-800 flex flex-shrink-0 items-center p-1;

  border-left-color: theme("colors.gray.900");

  &:hover {
    @apply bg-gray-800;
  }

  &:focus {
    @apply outline-none;
  }

  &:active {
    @apply bg-gray-700;
  }

  svg {
    @apply fill-current w-3;
  }
}

.acknowledged {
  @apply opacity-50;
}
</style>
