export function getSubscriptionPlanName(type) {
  switch (type) {
    case "1000":
      return "Tier 1";

    case "2000":
      return "Tier 2";

    case "3000":
      return "Tier 3";

    case "Prime":
      return "Twitch Prime";
  }

  return type;
}

export function getUptime(date) {
  const duration = Date.now() - date;

  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let seconds = parseInt((duration / 1000) % 60);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
}
