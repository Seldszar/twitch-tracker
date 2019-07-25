<template>
  <div v-bind:class="$style.wrapper">
    <div v-bind:class="$style.streamInfo">
      <div v-bind:class="$style.streamUptime">
        <header>Uptime</header>
        {{ uptime }}
      </div>
      <div v-bind:class="$style.viewerCount">
        <header>Viewers</header>
        {{ stream.viewer_count.toLocaleString() }}
      </div>
      <div v-bind:class="$style.gameName">
        <header>Game</header>
        {{ game ? game.name : "None" }}
      </div>
      <div v-bind:class="$style.streamTitle">
        <header>Title</header>
        <span :title="stream.title" v-text="stream.title" />
      </div>
    </div>
  </div>
</template>

<script>
import { getUptime } from "../helpers";

export default {
  props: {
    stream: {
      type: Object,
    },
    game: {
      type: Object,
    },
  },
  watch: {
    stream(newValue, oldValue) {
      if (!(newValue && oldValue && newValue.created_at === oldValue.created_at)) {
        this.updateUptime();
      }
    },
  },
  data() {
    return {
      uptime: null,
    };
  },
  mounted() {
    setInterval(() => {
      this.updateUptime();
    }, 1000);

    this.updateUptime();
  },
  methods: {
    updateUptime() {
      let uptime = null;

      if (this.stream) {
        uptime = getUptime(Date.parse(this.stream.started_at));
      }

      this.uptime = uptime;
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  @apply text-white flex h-12 text-sm items-center;
}

.streamUptime,
.viewerCount,
.gameName,
.streamTitle,
.offlineMessage {
  header {
    @apply text-gray-500 text-xs;
  }
}

.streamUptime,
.viewerCount,
.gameName,
.streamTitle {
  @apply px-2;
}

.streamInfo {
  @apply overflow-hidden flex flex-1 px-2;
}

.gameName {
  max-width: 25%;
}

.streamTitle {
  @apply flex-1 truncate;
}

.offlineMessage {
  @apply text-gray-500 uppercase flex-1;
}
</style>
