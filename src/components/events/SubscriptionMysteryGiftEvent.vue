<template>
  <Event v-bind="{ date, username, title: 'Subscription Mystery Gift', color: '#F63937' }">
    <div :class="$style.subscriptionPlan">{{ subscriptionCount }}x {{ subscriptionPlanName }}</div>
  </Event>
</template>

<script>
import Event from "../Event.vue";
import { getSubscriptionPlanName } from "../../helpers";

export default {
  components: { Event },
  props: {
    date: Date,
    username: String,
    subscriptionCount: Number,
    subscriptionPlan: String,
  },
  computed: {
    subscriptionPlanName() {
      return getSubscriptionPlanName(this.subscriptionPlan);
    },
  },
};
</script>

<style lang="scss" module>
.subscriptionPlan {
  // ...
}
</style>
