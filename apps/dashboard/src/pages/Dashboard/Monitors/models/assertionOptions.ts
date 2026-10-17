const assertionSources = [
  "STATUS_CODE",
  "RESPONSE_TIME",
  "HEADERS",
  "RAW_BODY",
  "JSON_BODY",
];

const assertionResponseTimeProperties = [
  "TOTAL",
  "DNS_LOOKUP",
  "TCP_CONNECTION",
  "TLS_HANDSHAKE",
  "SERVER_PROCESSING",
  "CONTENT_TRANSFER",
];

const comparisonOperators = ["EQUAL", "NOT_EQUAL", "GREATER_THAN", "LESS_THAN"];

const textOperators = [
  "EQUAL",
  "NOT_EQUAL",
  "EMPTY",
  "NOT_EMPTY",
  "GREATER_THAN",
  "LESS_THAN",
  "CONTAINS",
  "NOT_CONTAINS",
];

const assertionStatusCodeOperators = comparisonOperators;
const assertionResponseTimeOperators = comparisonOperators;
const assertionHeadersOperators = textOperators;
const assertionRawBodyOperators = textOperators;
const assertionJSONBodyOperators = [
  ...textOperators,
  "HAS_KEY",
  "NOT_HAS_KEY",
  "NULL",
  "NOT_NULL",
];

/** Operators that compare against nothing, so the target field is cleared and disabled. */
const textOperatorsWithoutTarget = ["EMPTY", "NOT_EMPTY"];
const jsonOperatorsWithoutTarget = [
  "EMPTY",
  "NOT_EMPTY",
  "NULL",
  "NOT_NULL",
  "HAS_KEY",
  "NOT_HAS_KEY",
];

/** Operators that only make sense with a numeric target. */
const numericOperators = ["LESS_THAN", "GREATER_THAN"];

const assertionOptionLabels: Record<string, string> = {
  // Sources
  STATUS_CODE: "Status code",
  RESPONSE_TIME: "Response time",
  HEADERS: "Headers",
  RAW_BODY: "Raw body",
  JSON_BODY: "JSON body",

  // Response time properties
  DNS_LOOKUP: "DNS lookup",
  TCP_CONNECTION: "TCP connection",
  TLS_HANDSHAKE: "TLS handshake",
  SERVER_PROCESSING: "Server processing",
  CONTENT_TRANSFER: "Content transfer",
  TOTAL: "Total",

  // Operators
  EQUAL: "Equal",
  NOT_EQUAL: "Not equal",
  CONTAINS: "Contains",
  NOT_CONTAINS: "Not contains",
  GREATER_THAN: "Greater than",
  LESS_THAN: "Less than",
  EMPTY: "Empty",
  NOT_EMPTY: "Not empty",
  NOT_NULL: "Not null",
  NULL: "Null",
  HAS_KEY: "Has key",
  NOT_HAS_KEY: "Not has key",
};

const getAssertionOptionLabel = (option: string) =>
  assertionOptionLabels[option] ?? option;

export {
  assertionHeadersOperators,
  assertionJSONBodyOperators,
  assertionRawBodyOperators,
  assertionResponseTimeOperators,
  assertionResponseTimeProperties,
  assertionSources,
  assertionStatusCodeOperators,
  getAssertionOptionLabel,
  jsonOperatorsWithoutTarget,
  numericOperators,
  textOperatorsWithoutTarget,
};
