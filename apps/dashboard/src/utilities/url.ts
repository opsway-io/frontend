function stripProtocolAndPath(url?: string): string {
  if (!url) {
    return "";
  }

  try {
    const u = new URL(url);
    return `${u.host}`;
  } catch {
    return url;
  }
}

export { stripProtocolAndPath };
