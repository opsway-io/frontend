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
];

const requestMethodOptions = requestMethods.map((method) => {
  return {
    label: method,
    value: method,
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

export {
  requestBodyTypeOptions,
  requestHeaders,
  requestMethodOptions,
  requestMethods,
};
