<template>
  <span v-text="result" />
</template>

<script>
import { distanceInWordsToNow } from "date-fns";

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
    updateResult() {
      this.result = distanceInWordsToNow(this.date);
    },
  },
};
</script>
