<template>
  <Event v-bind="{ date, username, title: 'Subscription Gift', color: '#F7A734' }">
    <div :class="$style.subscriptionPlan">{{ subscriptionPlanName }} to {{ recipientName }}</div>
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
    recipientName: String,
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
