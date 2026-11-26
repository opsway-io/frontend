export type SubdomainMode = "hub" | "monitoring" | "agent-context" | "local";

/**
 * Resolves the active product subdomain mode from the browser hostname.
 * Local development hosts (localhost, 127.0.0.1, ::1, 0.0.0.0, *.localhost,
 * *.local) return "local" so all routes remain accessible without subdomain
 * configuration.
 */
export function getSubdomainMode(
  hostname: string = typeof window !== "undefined"
    ? window.location.hostname
    : "",
): SubdomainMode {
  const normalized = hostname.trim().toLowerCase();

  if (
    !normalized ||
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local")
  ) {
    return "local";
  }

  if (normalized === "monitoring" || normalized.startsWith("monitoring.")) {
    return "monitoring";
  }

  if (
    normalized === "agent-context" ||
    normalized.startsWith("agent-context.") ||
    normalized === "pantomath" ||
    normalized.startsWith("pantomath.")
  ) {
    return "agent-context";
  }

  return "hub";
}
