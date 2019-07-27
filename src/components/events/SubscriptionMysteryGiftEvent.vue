<template>
  <Event v-bind="{ date, username, title: 'Subscription Mystery Gift', color: '#F63937' }">
    <div :class="$style.subscriptionPlan">{{ subscriptionCount }}x {{ subscriptionPlanName }}</div>
    <div :class="$style.recipients">{{ recipientNames }}</div>
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
    recipients: Array,
  },
  computed: {
    subscriptionPlanName() {
      return getSubscriptionPlanName(this.subscriptionPlan);
    },
    recipientNames() {
      const items = this.recipients.slice();
      const last = items.pop();

      return items.length > 0 ? `${items.join(", ")} & ${last}` : last;
    },
  },
};
</script>

<style lang="scss" module>
.subscriptionPlan {
  // ...
}

.recipients {
  @apply mt-2 bg-gray-900 p-2 rounded;
}
</style>
