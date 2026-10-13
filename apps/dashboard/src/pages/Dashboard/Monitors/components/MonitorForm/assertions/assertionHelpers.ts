import * as jsonpath from "jsonpath";

type AssertionField = "source" | "property" | "operator" | "target";

/** Form path of a single assertion field, e.g. `steps.0.assertions.2.target`. */
const assertionFieldPath = <F extends AssertionField>(
  stepIndex: number,
  index: number,
  field: F,
) => `steps.${stepIndex}.assertions.${index}.${field}` as const;

const getDefaultsForSource = (source: string) => {
  switch (source) {
    case "RESPONSE_TIME":
      return { property: "TOTAL", operator: "LESS_THAN", target: "" };
    case "STATUS_CODE":
    case "HEADERS":
    case "RAW_BODY":
    case "JSON_BODY":
      return { property: "", operator: "EQUAL", target: "" };
    default:
      return { property: "", operator: "", target: "" };
  }
};

const isNumber = (value: string) => /^[+-]?([0-9]*[.])?[0-9]+$/.test(value);

const sanitizeNumber = (value: string) => value.replace(/[^0-9]/g, "");

const isValidJSONPath = (value?: string): boolean => {
  if (!value) {
    return false;
  }

  try {
    jsonpath.parse(value);
    return true;
  } catch {
    return false;
  }
};

export {
  assertionFieldPath,
  getDefaultsForSource,
  isNumber,
  isValidJSONPath,
  sanitizeNumber,
};
