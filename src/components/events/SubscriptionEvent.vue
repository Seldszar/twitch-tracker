<template>
  <Event v-bind="{ date, username, title: 'Subscription', color: '#F7A734' }">
    <div :class="$style.subscriptionPlan">{{ subscriptionPlanName }}</div>
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
