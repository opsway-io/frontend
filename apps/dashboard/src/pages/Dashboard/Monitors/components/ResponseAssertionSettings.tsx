import { FunctionComponent } from "react";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormData } from "../models/formData";
import { VscClose, VscAdd } from "react-icons/vsc";
import Conditional from "../../../../components/Conditional";
import {
  assertionHeadersOperators,
  assertionJSONBodyOperators,
  assertionRawBodyOperators,
  assertionResponseTimeOperators,
  assertionResponseTimeProperties,
  assertionSources,
  assertionStatusCodeOperators,
} from "../models/assertionOptions";
import { requestHeaders } from "../models/requestOptions";
import { v4 as uuidv4 } from "uuid";
import * as jsonpath from "jsonpath";

const getOptionLabel = (option: string) => {
  switch (option) {
    // Sources
    case "STATUS_CODE":
      return "Status code";
    case "RESPONSE_TIME":
      return "Response time";
    case "HEADERS":
      return "Headers";
    case "RAW_BODY":
      return "Raw body";
    case "JSON_BODY":
      return "JSON body";

    // Properties
    case "DNS_LOOKUP":
      return "DNS lookup";
    case "TCP_CONNECTION":
      return "TCP connection";
    case "TLS_HANDSHAKE":
      return "TLS handshake";
    case "SERVER_PROCESSING":
      return "Server processing";
    case "CONTENT_TRANSFER":
      return "Content transfer";
    case "TOTAL":
      return "Total";

    // Operators
    case "EQUAL":
      return "Equal";
    case "NOT_EQUAL":
      return "Not equal";
    case "CONTAINS":
      return "Contains";
    case "NOT_CONTAINS":
      return "Not contains";
    case "GREATER_THAN":
      return "Greater than";
    case "LESS_THAN":
      return "Less than";
    case "EMPTY":
      return "Empty";
    case "NOT_EMPTY":
      return "Not empty";
    case "NOT_NULL":
      return "Not null";
    case "NULL":
      return "Null";

    default:
      return option;
  }
};

const getDefaultsForSource = (source: string) => {
  switch (source) {
    case "STATUS_CODE":
      return {
        property: "",
        operator: "EQUAL",
        target: "",
      };

    case "RESPONSE_TIME":
      return {
        property: "TOTAL",
        operator: "LESS_THAN",
        target: "",
      };

    case "HEADERS":
      return {
        property: "",
        operator: "EQUAL",
        target: "",
      };

    case "RAW_BODY":
      return {
        property: "",
        operator: "EQUAL",
        target: "",
      };

    case "JSON_BODY":
      return {
        property: "",
        operator: "EQUAL",
        target: "",
      };

    default:
      return {
        property: "",
        operator: "",
        target: "",
      };
  }
};

const isNumber = (value: string) => {
  return /^[+-]?([0-9]*[.])?[0-9]+$/.test(value);
};

const sanitizeNumber = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

const ResponseAssertionSettings: FunctionComponent = () => {
  const { control, getValues } = useFormContext<FormData>();

  const { fields, append, remove, update } = useFieldArray<FormData>({
    name: "assertions",
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="body1" color="textSecondary">
          Assertions are statements you craft to verify a specific aspect of the
          HTTP response. These statements enable you to assess the accuracy and
          timeliness of the response data by combining predefined modifiers with
          customizable values, ensuring they cater to a wide range of scenarios.
          If one or more assertions fail, an incident will be triggered.
        </Typography>
      </Stack>

      <Conditional value={fields.length > 0}>
        <Table
          sx={{
            display: "flex",
            flexDirection: "column",
            "& td": {
              paddingBottom: 0,
              paddingTop: 0.5,
              border: 0,

              paddingLeft: 1,
              paddingRight: 1,

              "&:first-child": {
                paddingLeft: 0,
              },

              "&:last-child": {
                paddingRight: 0,
              },
            },
            "& th": {
              paddingTop: 0,
              paddingBottom: 0.5,
              border: 0,
              display: "flex",
              flexDirection: "column",

              "&:first-child": {
                paddingLeft: 0,
              },

              "&:last-child": {
                paddingRight: 0,
              },
            },
            "& tr": {
              display: "flex",
              flex: 1,
            },

            // Make disabled inputs appear more disabled
            "& .Mui-disabled": {
              opacity: 0.5,
              backgroundColor: (t) => t.palette.background.default,
              cursor: "not-allowed",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ flex: 1 }}>Source</TableCell>
              <TableCell sx={{ flex: 1 }}>Property</TableCell>
              <TableCell sx={{ flex: 1 }}>Operator</TableCell>
              <TableCell sx={{ flex: 1 }}>Target</TableCell>
              <TableCell
                sx={{
                  minWidth: "40px",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.key}>
                <Controller
                  name={`assertions.${index}.source` as const}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <>
                      <TableCell sx={{ flex: 1 }}>
                        <Select
                          {...field}
                          size="small"
                          fullWidth
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            update(index, {
                              ...getValues(`assertions.${index}`),
                              ...getDefaultsForSource(e.target.value),
                              source: e.target.value,
                            });
                          }}
                        >
                          {assertionSources.map((option) => (
                            <MenuItem key={option} value={option}>
                              {getOptionLabel(option)}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      <Conditional value={!field.value}>
                        <NoSourceCells />
                      </Conditional>

                      <Conditional value={field.value === "STATUS_CODE"}>
                        <StatusCodeAssertionCells index={index} />
                      </Conditional>

                      <Conditional value={field.value === "RESPONSE_TIME"}>
                        <ResponseTimeAssertionCells index={index} />
                      </Conditional>

                      <Conditional value={field.value === "HEADERS"}>
                        <HeadersAssertionCells index={index} />
                      </Conditional>

                      <Conditional value={field.value === "RAW_BODY"}>
                        <RawBodyAssertionCells index={index} />
                      </Conditional>

                      <Conditional value={field.value === "JSON_BODY"}>
                        <JSONBodyAssertionCells index={index} />
                      </Conditional>
                    </>
                  )}
                />

                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <VscClose />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Conditional>

      <Box>
        <Button
          variant="outlined"
          onClick={() => {
            append(
              {
                key: uuidv4(),
                source: "STATUS_CODE",
                ...getDefaultsForSource("STATUS_CODE"),
              },
              {
                shouldFocus: false,
              }
            );
          }}
          startIcon={<VscAdd />}
        >
          Add assertion
        </Button>
      </Box>
    </Stack>
  );
};

const NoSourceCells: FunctionComponent = () => {
  return (
    <>
      <TableCell sx={{ flex: 1 }}>
        <TextField fullWidth size="small" disabled />
      </TableCell>

      <TableCell sx={{ flex: 1 }}>
        <TextField fullWidth size="small" disabled />
      </TableCell>

      <TableCell sx={{ flex: 1 }}>
        <TextField fullWidth size="small" disabled />
      </TableCell>
    </>
  );
};

const StatusCodeAssertionCells: FunctionComponent<{
  index: number;
}> = ({ index }) => {
  const { control } = useFormContext<FormData>();

  return (
    <>
      <TableCell sx={{ flex: 1 }}>
        <TextField fullWidth size="small" disabled />
      </TableCell>

      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.operator` as const}
          rules={{
            required: true,
          }}
          control={control}
          render={({ field }) => (
            <Select {...field} size="small" fullWidth>
              {assertionStatusCodeOperators.map((option) => (
                <MenuItem key={option} value={option}>
                  {getOptionLabel(option)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell>

      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.target` as const}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              fullWidth
              onChange={(e) => {
                e.target.value = sanitizeNumber(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </TableCell>
    </>
  );
};

const ResponseTimeAssertionCells: FunctionComponent<{
  index: number;
}> = ({ index }) => {
  const { control } = useFormContext<FormData>();

  return (
    <>
      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.property` as const}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <Select {...field} size="small" fullWidth>
              {assertionResponseTimeProperties.map((option) => (
                <MenuItem key={option} value={option}>
                  {getOptionLabel(option)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell>

      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.operator` as const}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <Select {...field} size="small" fullWidth>
              {assertionResponseTimeOperators.map((option) => (
                <MenuItem key={option} value={option}>
                  {getOptionLabel(option)}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell>

      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.target` as const}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              fullWidth
              InputProps={{
                endAdornment: "ms",
              }}
              onChange={(e) => {
                e.target.value = sanitizeNumber(e.target.value);
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </TableCell>
    </>
  );
};

const HeadersAssertionCells: FunctionComponent<{
  index: number;
}> = ({ index }) => {
  const { control, getValues, setValue } = useFormContext<FormData>();

  return (
    <>
      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.property` as const}
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <Autocomplete
              freeSolo
              options={requestHeaders}
              getOptionLabel={getOptionLabel}
              value={field.value}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              )}
              fullWidth
            />
          )}
        />
      </TableCell>

      <Controller
        name={`assertions.${index}.operator` as const}
        control={control}
        render={({ field: operatorField }) => {
          return (
            <>
              <TableCell sx={{ flex: 1 }}>
                <Select
                  {...operatorField}
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    const opr = e.target.value;

                    if (opr === "EMPTY" || opr === "NOT_EMPTY") {
                      setValue(`assertions.${index}.target`, "");
                    }

                    if (opr === "LESS_THAN" || opr === "GREATER_THAN") {
                      const target = getValues(`assertions.${index}.target`);

                      if (!isNumber(target)) {
                        setValue(`assertions.${index}.target`, "");
                      }
                    }

                    operatorField.onChange(e.target.value);
                  }}
                >
                  {assertionHeadersOperators.map((option) => (
                    <MenuItem key={option} value={option}>
                      {getOptionLabel(option)}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              <TableCell sx={{ flex: 1 }}>
                <Controller
                  name={`assertions.${index}.target` as const}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: targetField }) => (
                    <TextField
                      {...targetField}
                      size="small"
                      fullWidth
                      disabled={
                        operatorField.value === "EMPTY" ||
                        operatorField.value === "NOT_EMPTY"
                      }
                      onChange={(e) => {
                        const opr = operatorField.value;

                        if (opr === "LESS_THAN" || opr === "GREATER_THAN") {
                          e.target.value = sanitizeNumber(e.target.value);
                        }

                        targetField.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </TableCell>
            </>
          );
        }}
      />
    </>
  );
};

const RawBodyAssertionCells: FunctionComponent<{
  index: number;
}> = ({ index }) => {
  const { control, setValue, getValues } = useFormContext<FormData>();

  return (
    <>
      <TableCell sx={{ flex: 1 }}>
        <TextField fullWidth size="small" disabled />
      </TableCell>

      <Controller
        name={`assertions.${index}.operator` as const}
        rules={{
          required: true,
        }}
        control={control}
        render={({ field: operatorField }) => (
          <>
            <TableCell sx={{ flex: 1 }}>
              <Select
                {...operatorField}
                size="small"
                fullWidth
                onChange={(e) => {
                  const opr = e.target.value;

                  if (opr === "EMPTY" || opr === "NOT_EMPTY") {
                    setValue(`assertions.${index}.target`, "");
                  }

                  if (opr === "LESS_THAN" || opr === "GREATER_THAN") {
                    const target = getValues(`assertions.${index}.target`);

                    if (!isNumber(target)) {
                      setValue(`assertions.${index}.target`, "");
                    }
                  }

                  operatorField.onChange(e.target.value);
                }}
              >
                {assertionRawBodyOperators.map((option) => (
                  <MenuItem key={option} value={option}>
                    {getOptionLabel(option)}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>

            <TableCell sx={{ flex: 1 }}>
              <Controller
                name={`assertions.${index}.target` as const}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: targetField }) => (
                  <TextField
                    {...targetField}
                    size="small"
                    fullWidth
                    disabled={
                      operatorField.value === "EMPTY" ||
                      operatorField.value === "NOT_EMPTY"
                    }
                    onChange={(e) => {
                      const opr = operatorField.value;

                      if (opr === "LESS_THAN" || opr === "GREATER_THAN") {
                        e.target.value = sanitizeNumber(e.target.value);
                      }

                      targetField.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </TableCell>
          </>
        )}
      />
    </>
  );
};

const JSONBodyAssertionCells: FunctionComponent<{
  index: number;
}> = ({ index }) => {
  const { control, setValue, getValues } = useFormContext<FormData>();

  const validateJSONPath = (value: string): boolean => {
    try {
      jsonpath.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <>
      <TableCell sx={{ flex: 1 }}>
        <Controller
          name={`assertions.${index}.property` as const}
          control={control}
          rules={{
            required: true,
            validate: validateJSONPath,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </TableCell>

      <Controller
        name={`assertions.${index}.operator` as const}
        rules={{
          required: true,
        }}
        control={control}
        render={({ field: operatorField }) => (
          <>
            <TableCell sx={{ flex: 1 }}>
              <Select
                {...operatorField}
                size="small"
                fullWidth
                onChange={(e) => {
                  const opr = e.target.value;

                  if (
                    opr === "EMPTY" ||
                    opr === "NOT_EMPTY" ||
                    opr === "NULL" ||
                    opr === "NOT_NULL"
                  ) {
                    setValue(`assertions.${index}.target`, "");
                  }

                  if (opr === "LESS_THAN" || opr === "GREATER_THAN") {
                    const target = getValues(`assertions.${index}.target`);

                    if (!isNumber(target)) {
                      setValue(`assertions.${index}.target`, "");
                    }
                  }

                  operatorField.onChange(e.target.value);
                }}
              >
                {assertionJSONBodyOperators.map((option) => (
                  <MenuItem key={option} value={option}>
                    {getOptionLabel(option)}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>

            <TableCell sx={{ flex: 1 }}>
              <Controller
                name={`assertions.${index}.target` as const}
                rules={{
                  required: false,
                }}
                control={control}
                render={({ field: targetField }) => (
                  <TextField
                    {...targetField}
                    size="small"
                    fullWidth
                    disabled={
                      operatorField.value === "EMPTY" ||
                      operatorField.value === "NOT_EMPTY" ||
                      operatorField.value === "NULL" ||
                      operatorField.value === "NOT_NULL"
                    }
                    onChange={(e) => {
                      const opr = operatorField.value;

                      if (opr === "LESS_THAN" || opr === "GREATER_THAN") {
                        e.target.value = sanitizeNumber(e.target.value);
                      }

                      targetField.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </TableCell>
          </>
        )}
      />
    </>
  );
};

export default ResponseAssertionSettings;
