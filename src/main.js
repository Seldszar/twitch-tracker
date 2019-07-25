import Vue from "vue";
import App from "./App.vue";

Vue.prototype.$settings = window.settings;

const app = new Vue({
  render: h => h(App),
});

app.$mount("#app");
