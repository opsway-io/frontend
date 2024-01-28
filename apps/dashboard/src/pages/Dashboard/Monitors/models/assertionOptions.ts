const assertionSources = [
  "STATUS_CODE",
  "RESPONSE_TIME",
  "HEADERS",
  "RAW_BODY",
  "JSON_BODY",
];

// Response Time

const assertionResponseTimeProperties = [
  "TOTAL",
  "DNS_LOOKUP",
  "TCP_CONNECTION",
  "TLS_HANDSHAKE",
  "SERVER_PROCESSING",
  "CONTENT_TRANSFER",
];

const assertionResponseTimeOperators = [
  "EQUAL",
  "NOT_EQUAL",
  "GREATER_THAN",
  "LESS_THAN",
];

// Status Code

const assertionStatusCodeOperators = [
  "EQUAL",
  "NOT_EQUAL",
  "GREATER_THAN",
  "LESS_THAN",
];

// Headers

const assertionHeadersOperators = [
  "EQUAL",
  "NOT_EQUAL",
  "EMPTY",
  "NOT_EMPTY",
  "GREATER_THAN",
  "LESS_THAN",
  "CONTAINS",
  "NOT_CONTAINS",
];

// Raw Body

const assertionRawBodyOperators = [
  "EQUAL",
  "NOT_EQUAL",
  "EMPTY",
  "NOT_EMPTY",
  "GREATER_THAN",
  "LESS_THAN",
  "CONTAINS",
  "NOT_CONTAINS",
];

// JSON Body

// TODO: Add JSON Body operators
const assertionJSONBodyOperators = [
  "EQUAL",
  "NOT_EQUAL",
  "EMPTY",
  "NOT_EMPTY",
  "GREATER_THAN",
  "LESS_THAN",
  "CONTAINS",
  "NOT_CONTAINS",
  "NULL",
  "NOT_NULL",
];

export {
  assertionHeadersOperators,
  assertionJSONBodyOperators,
  assertionRawBodyOperators,
  assertionResponseTimeOperators,
  assertionResponseTimeProperties,
  assertionSources,
  assertionStatusCodeOperators,
};
