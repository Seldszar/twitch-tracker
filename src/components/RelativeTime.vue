<template>
  <span v-text="result" />
</template>

<script>
import parseMilliseconds from "parse-ms";

export default {
  props: {
    date: Date,
  },
  data() {
    return {
      result: null,
    };
  },
  created() {
    this.intervalId = setInterval(() => this.updateResult(), 1000);
    this.updateResult();
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    formatDuration(duration) {
      const parsed = parseMilliseconds(duration);

      if (parsed.days > 0) {
        return `${parsed.days}d`;
      }

      if (parsed.hours > 0) {
        return `${parsed.hours}h`;
      }

      if (parsed.minutes > 0) {
        return `${parsed.minutes}m`;
      }

      return `${parsed.seconds}s`;
    },
    updateResult() {
      this.result = this.formatDuration(Date.now() - this.date.getTime());
    },
  },
};
</script>
