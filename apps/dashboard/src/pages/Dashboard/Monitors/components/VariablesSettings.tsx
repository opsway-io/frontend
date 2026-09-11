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

const VariablesSettings: FunctionComponent<{ stepIndex: number }> = ({ stepIndex }) => {
  const { control, register, watch } = useFormContext<SettingsFormData>();
  const { fields, append, remove } = useFieldArray<SettingsFormData>({
    name: `steps.${stepIndex}.variables` as any,
  });

    
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
                      {...register(`steps.${stepIndex}.variables.${index}.name` as const, { required: true })}
                    />
                  </TableCell>
                  <TableCell sx={{ flex: 1 }}>
                    <Controller
                      name={`steps.${stepIndex}.variables.${index}.source` as const}
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
                      {...register(`steps.${stepIndex}.variables.${index}.property` as const, { required: true })}
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

      
    </Stack>
  );
};

export default VariablesSettings;
