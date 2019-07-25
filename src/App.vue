<template>
  <div :class="$style.wrapper">
    <div :class="$style.streamStatus" v-if="stream">
      <StreamStatus v-bind="{ game, stream }" />
    </div>
    <div :class="$style.eventPanels">
      <div :class="$style.eventPanel">
        <EventPanel
          title="Subscriptions & Resubscriptions"
          :events="events.filter(o => ['sub', 'resub'].includes(o.type))"
          @acknowledge="acknowledgeEvent"
        />
      </div>
      <div :class="$style.eventPanel">
        <EventPanel
          title="Subscription Mystery Gifts"
          :events="events.filter(o => ['submysterygift'].includes(o.type))"
          @acknowledge="acknowledgeEvent"
        />
      </div>
      <div :class="$style.eventPanel">
        <EventPanel
          title="Cheers"
          :events="events.filter(o => ['cheer'].includes(o.type))"
          @acknowledge="acknowledgeEvent"
        />
      </div>
      <div :class="$style.eventPanel">
        <EventPanel
          title="Raids & Hosts"
          :events="events.filter(o => ['raid', 'host'].includes(o.type))"
          @acknowledge="acknowledgeEvent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import localforage from "localforage";
import { toNumber } from "lodash";
import Queue from "p-queue";
import pThrottle from "p-throttle";
import ky from "ky";
import Sockette from "sockette";
import * as tekko from "tekko";

import EventPanel from "./components/EventPanel.vue";
import StreamStatus from "./components/StreamStatus.vue";

export default {
  components: {
    EventPanel,
    StreamStatus,
  },
  data() {
    return {
      accessToken: null,
      game: null,
      user: null,
      stream: null,
      cheermotes: null,
      events: [],
    };
  },
  watch: {
    events: pThrottle(newValue => localforage.setItem("events", newValue), 1, 1000),
  },
  async created() {
    const events = await localforage.getItem("events");
    const queue = new Queue({
      concurrency: 1,
    });

    if (events) {
      this.$set(this, "events", events);
    }

    if ("refreshToken" in this.$settings) {
      const result = await ky
        .get(`https://twitchtokengenerator.com/api/refresh/${this.$settings.refreshToken}`)
        .json();

      this.accessToken = result.token;
    }

    this.api = ky.extend({
      prefixUrl: "https://api.twitch.tv/helix/",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    await this.fetchUser();
    await this.fetchStream();

    const socket = new Sockette("wss://irc-ws.chat.twitch.tv:443", {
      onopen: () => {
        socket.send(`CAP REQ :twitch.tv/tags twitch.tv/commands`);
        socket.send(`PASS oauth:${this.accessToken}`);
        socket.send(`NICK ${this.user.login}`);
        socket.send(`JOIN #${this.$settings.channel}`);
      },
      onmessage: event => {
        for (const chunk of event.data.split("\r\n")) {
          if (chunk.length > 0) {
            queue.add(() => this.handleMessage(socket, tekko.parse(chunk)));
          }
        }
      },
    });

    setInterval(() => this.fetchStream(), 30000);
  },
  methods: {
    acknowledgeEvent(event) {
      const index = this.events.indexOf(event);

      if (index > -1) {
        this.events.splice(index, 1);
      }
    },
    async fetchUser() {
      const result = await this.api.get("users").json();

      this.user = result.data[0];
    },
    async fetchStream() {
      const result = await this.api
        .get("streams", { searchParams: { user_login: this.$settings.channel } })
        .json();

      this.stream = result.data[0];

      if (this.stream) {
        await this.fetchGame();
      }
    },
    async fetchGame() {
      const result = await this.api
        .get("games", { searchParams: { id: this.stream.game_id } })
        .json();

      this.game = result.data[0];
    },
    handleMessage(target, message) {
      const { prefix, command, tags, trailing } = message;
      let event = null;

      switch (command) {
        case "PING": {
          target.send(`PONG :${trailing}`);

          break;
        }

        case "USERNOTICE": {
          switch (tags["msg-id"]) {
            case "raid": {
              event = {
                id: tags.id,
                date: new Date(),
                type: tags["msg-id"],
                username: tags["msg-param-login"],
                viewerCount: toNumber(tags["msg-param-viewerCount"]),
              };

              break;
            }

            case "sub": {
              const subscriptionPlan = tags["msg-param-sub-plan"];

              event = {
                id: tags.id,
                date: new Date(),
                type: tags["msg-id"],
                username: tags.login,
                subscriptionPlan,
              };

              break;
            }

            case "submysterygift": {
              const subscriptionCount = toNumber(tags["msg-param-mass-gift-count"]);
              const subscriptionPlan = tags["msg-param-sub-plan"];

              event = {
                id: tags.id,
                date: new Date(),
                type: tags["msg-id"],
                username: tags.login,
                subscriptionCount,
                subscriptionPlan,
              };

              break;
            }

            case "resub": {
              const subscriptionPlan = tags["msg-param-sub-plan"];
              const cumulativeMonths = toNumber(tags["msg-param-cumulative-months"]);
              const streakMonths =
                tags["msg-param-should-share-streak"] === "1"
                  ? toNumber(tags["msg-param-streak-months"])
                  : null;

              event = {
                id: tags.id,
                date: new Date(),
                type: tags["msg-id"],
                username: tags.login,
                message: trailing,
                subscriptionPlan,
                cumulativeMonths,
                streakMonths,
              };

              break;
            }
          }

          break;
        }

        case "PRIVMSG": {
          if (prefix.name === "jtv") {
            const matches = trailing.match(/^(\w+) is now(?: (auto))? hosting\D+(\d+)?/i);

            if (matches) {
              const viewers = parseInt(matches[3] || "0", 10);
              const isAuto = matches[2] === "auto";

              if (viewers > 0) {
                event = {
                  id: tags.id,
                  date: new Date(),
                  type: "host",
                  username: matches[1],
                  isAuto,
                };
              }
            }
          } else if (tags.bits) {
            event = {
              id: tags.id,
              date: new Date(),
              type: "cheer",
              username: prefix.name,
              bits: toNumber(tags.bits),
              message: this.cleanMessage(trailing),
            };
          }

          break;
        }
      }

      if (event) {
        this.events.unshift(event);
      }
    },
    cleanMessage(message) {
      return this.cheermotes
        .reduce((result, pattern) => result.replace(pattern, ""), message)
        .trim();
    },
  },
};
</script>

<style lang="scss" module>
@tailwind base;

body {
  @apply bg-gray-900 text-white select-none;
}

.wrapper {
  @apply h-screen flex flex-col;
}

.streamStatus {
  @apply border-b border-gray-800 flex-shrink-0;
}

.eventPanels {
  @apply flex-1 overflow-hidden;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 1px;
}

.eventPanel {
  @apply overflow-y-hidden;
}
</style>
