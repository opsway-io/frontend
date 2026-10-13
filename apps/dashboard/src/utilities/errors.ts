import { isAxiosError } from "axios";

// Default messages the API framework returns for plain HTTP errors. They are
// less helpful than the caller's own fallback text.
const GENERIC_API_MESSAGES = new Set([
  "Bad Request",
  "Unauthorized",
  "Forbidden",
  "Not Found",
  "Method Not Allowed",
  "Conflict",
  "Too Many Requests",
  "Internal Server Error",
  "Bad Gateway",
  "Service Unavailable",
]);

/**
 * A human readable message for a failed request: the API's specific
 * `message` when present, otherwise `fallback`.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    if (
      typeof apiMessage === "string" &&
      apiMessage &&
      !GENERIC_API_MESSAGES.has(apiMessage)
    ) {
      return apiMessage;
    }
  }

  return fallback;
};
