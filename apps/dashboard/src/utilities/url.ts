function stripProtocolAndPath(url?: string): string {
  if (!url) {
    return "";
  }

  const u = new URL(url);

  return `${u.host}`;
}

export { stripProtocolAndPath };
