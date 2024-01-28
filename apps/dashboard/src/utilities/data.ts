const humanizeBytes = (bytes: number) => {
  const units = ["B", "KiB", "MiB"];

  if (bytes === 0) {
    return "0 B";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i === 0) {
    return `${bytes} ${units[i]}`;
  }

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

export { humanizeBytes };
