import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { FunctionComponent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { VscAdd, VscClose } from "react-icons/vsc";
import Conditional from "../../../../components/Conditional";
import Editor from "../../../../components/Editor";
import {
  requestBodyTypeOptions,
  requestMethodOptions,
} from "../models/requestOptions";
import { SettingsFormData } from "../models/settingsFormData";

const VariablesAndTeardownSettings: FunctionComponent = () => {
  const { control, register, watch } = useFormContext<SettingsFormData>();
  const { fields, append, remove } = useFieldArray<SettingsFormData>({
    name: "variables",
  });

  const teardownEnabled = watch("settings.teardown.enabled");
  const teardownBodyType = watch("settings.teardown.body.type");

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack>
          <Typography variant="subtitle1">Variables</Typography>
          <Typography variant="body1" color="textSecondary">
            Extract variables from the main request's response. These can be used in the teardown request using {'{{VAR_NAME}}'}.
          </Typography>
        </Stack>

        <Conditional value={fields.length > 0}>
          <Table
            sx={{
              display: "flex",
              flexDirection: "column",
              "& td": { paddingBottom: 0, paddingTop: 0.5, border: 0, paddingLeft: 1, paddingRight: 1 },
              "& th": { paddingTop: 0, paddingBottom: 0.5, border: 0, display: "flex", flexDirection: "column" },
              "& tr": { display: "flex", flex: 1 },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ flex: 1 }}>Name</TableCell>
                <TableCell sx={{ flex: 1 }}>Source</TableCell>
                <TableCell sx={{ flex: 1 }}>Property</TableCell>
                <TableCell sx={{ minWidth: "40px" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fields.map((_, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="MY_VAR"
                      {...register(`variables.${index}.name` as const, { required: true })}
                    />
                  </TableCell>
                  <TableCell sx={{ flex: 1 }}>
                    <Controller
                      name={`variables.${index}.source` as const}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField select fullWidth size="small" {...field} value={field.value || "JSON_BODY"}>
                          <MenuItem value="JSON_BODY">JSON Body</MenuItem>
                          <MenuItem value="HEADER">Header</MenuItem>
                        </TextField>
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="$.id or X-Request-ID"
                      {...register(`variables.${index}.property` as const, { required: true })}
                    />
                  </TableCell>
                  <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconButton onClick={() => remove(index)}>
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
            onClick={() => append({ name: "", source: "JSON_BODY", property: "" })}
            startIcon={<VscAdd />}
          >
            Add variable
          </Button>
        </Box>
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack>
            <Typography variant="subtitle1">Teardown Request</Typography>
            <Typography variant="body1" color="textSecondary">
              Execute a follow-up request (e.g. to DELETE a resource) after the main request finishes.
            </Typography>
          </Stack>
          <Controller
            name="settings.teardown.enabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value || false} onChange={(e) => field.onChange(e.target.checked)} />}
                label={field.value ? "Enabled" : "Disabled"}
              />
            )}
          />
        </Stack>

        <Conditional value={teardownEnabled}>
          <Stack direction="row" spacing={2}>
            <Stack>
              <Controller
                name="settings.teardown.method"
                control={control}
                rules={{ required: teardownEnabled }}
                render={({ field }) => (
                  <TextField select {...field} sx={{ width: "150px" }} size="small" value={field.value || "DELETE"}>
                    {requestMethodOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Stack flex="1">
              <Controller
                name="settings.teardown.url"
                control={control}
                rules={{ required: teardownEnabled }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    size="small"
                    fullWidth
                    placeholder="https://api.example.com/pets/{{PET_ID}}"
                    error={fieldState.invalid}
                    helperText={fieldState.invalid ? fieldState.error?.message : ""}
                    value={field.value || ""}
                  />
                )}
              />
            </Stack>
          </Stack>

          <Stack>
            <Controller
              name="settings.teardown.body.type"
              control={control}
              rules={{ required: teardownEnabled }}
              render={({ field }) => (
                <ToggleButtonGroup
                  color="primary"
                  value={field.value || "NONE"}
                  exclusive
                  onChange={(e, value) => {
                    if (value !== null) {
                      field.onChange(value);
                    }
                  }}
                  size="small"
                >
                  {requestBodyTypeOptions.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            />
          </Stack>

          <Conditional value={teardownBodyType !== "NONE" && teardownBodyType !== undefined}>
            <Controller
              name="settings.teardown.body.content"
              control={control}
              render={({ field }) => (
                <Editor
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                  height="200px"
                  language={
                    teardownBodyType === "JSON"
                      ? "json"
                      : teardownBodyType === "GRAPHQL"
                      ? "graphql"
                      : teardownBodyType === "XML"
                      ? "xml"
                      : "text"
                  }
                />
              )}
            />
          </Conditional>
        </Conditional>
      </Stack>
    </Stack>
  );
};

export default VariablesAndTeardownSettings;
