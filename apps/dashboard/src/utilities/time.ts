function millisecondsHumanize(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} hour` + (hours > 1 ? "s" : "");
  }

  if (minutes > 0) {
    return `${minutes} minute` + (minutes > 1 ? "s" : "");
  }

  return `${seconds} second` + (seconds > 1 ? "s" : "");
}

function secondsHumanize(seconds: number): string {
  return millisecondsHumanize(seconds * 1000);
}

function timeAgoHumanize(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const now = new Date();
  const ms = now.getTime() - date.getTime();

  return millisecondsHumanize(ms) + " ago";
}

export { millisecondsHumanize, secondsHumanize, timeAgoHumanize };
