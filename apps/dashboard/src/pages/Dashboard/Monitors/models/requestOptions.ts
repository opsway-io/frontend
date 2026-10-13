const requestHeaders = [
  "Accept",
  "Accept-Charset",
  "Accept-Encoding",
  "Accept-Language",
  "Accept-Datetime",
  "Access-Control-Request-Method",
  "Access-Control-Request-Headers",
  "Authorization",
  "Cache-Control",
  "Connection",
  "Cookie",
  "Content-Length",
  "Content-MD5",
  "Content-Type",
  "Date",
  "Expect",
  "Forwarded",
  "From",
  "Host",
  "Permanent",
  "If-Match",
  "If-Modified-Since",
  "If-None-Match",
  "If-Range",
  "If-Unmodified-Since",
  "Max-Forwards",
  "Origin",
  "Pragma",
  "Proxy-Authorization",
  "Range",
  "Referer",
  "User-Agent",
  "Upgrade",
  "Via",
  "Warning",
];

const requestMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "TCP",
  "ICMP",
  "DNS",
  "POSTGRES",
  "MYSQL",
  "REDIS",
  "BROWSER",
  "WEBSOCKET",
  "UDP",
];

// Only HTTP methods are supported by the prober so far; the other check
// types are listed but disabled until the backend implements them.
const supportedRequestMethods = new Set([
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
]);

const requestMethodOptions = requestMethods.map((method) => {
  return {
    label: method,
    value: method,
    disabled: !supportedRequestMethods.has(method),
  };
});

const requestBodyTypeOptions = [
  {
    label: "None",
    value: "NONE",
  },
  {
    label: "Raw",
    value: "RAW",
  },
  {
    label: "JSON",
    value: "JSON",
  },
  {
    label: "GraphQL",
    value: "GRAPHQL",
  },
  {
    label: "XML",
    value: "XML",
  },
];

/** Methods that aren't plain HTTP requests (no headers/body). */
const nonHttpMethods = [
  "TCP",
  "ICMP",
  "DNS",
  "POSTGRES",
  "MYSQL",
  "REDIS",
  "BROWSER",
  "WEBSOCKET",
  "UDP",
];

/** Methods for which SSL/TLS verification settings don't apply. */
const methodsWithoutTLS = ["TCP", "ICMP", "DNS", "POSTGRES", "MYSQL", "REDIS"];

const defaultUrlPlaceholder = "https://api.example.com/pets";

const urlPlaceholdersByMethod: Record<string, string> = {
  TCP: "example.com:8080",
  POSTGRES: "postgres://user:password@localhost:5432/dbname",
  MYSQL: "mysql://user:password@localhost:3306/dbname",
  REDIS: "redis://user:password@localhost:6379/0",
  ICMP: "8.8.8.8",
  DNS: "example.com?type=MX",
  WEBSOCKET: "wss://echo.websocket.org",
  UDP: "8.8.8.8:53",
};

const getUrlPlaceholder = (method: string) =>
  urlPlaceholdersByMethod[method] ?? defaultUrlPlaceholder;

const bodyTypeToEditorLanguage = (bodyType: string): string => {
  switch (bodyType) {
    case "JSON":
      return "json";
    case "GRAPHQL":
      return "graphql";
    case "XML":
      return "xml";
    default:
      return "text";
  }
};

export {
  bodyTypeToEditorLanguage,
  getUrlPlaceholder,
  methodsWithoutTLS,
  nonHttpMethods,
  requestBodyTypeOptions,
  requestHeaders,
  requestMethodOptions,
};
