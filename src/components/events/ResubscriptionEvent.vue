<template>
  <Event v-bind="{ date, username, title: 'Resubscription', color: '#33ED70' }">
    <div :class="$style.subscriptionPlan">
      {{ subscriptionPlanName }} - {{ cumulativeMonths }} months
    </div>
    <div :class="$style.message" v-if="message">{{ message }}</div>
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
    cumulativeMonths: Number,
    message: String,
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

.message {
  @apply mt-2 bg-gray-900 p-2 rounded;
}
</style>
