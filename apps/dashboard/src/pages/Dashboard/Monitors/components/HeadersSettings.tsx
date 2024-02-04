import { FunctionComponent } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormData } from "../models/formData";
import {
  Autocomplete,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import { VscAdd, VscClose } from "react-icons/vsc";
import { requestHeaders } from "../models/requestOptions";
import Conditional from "../../../../components/Conditional";

const HeaderSettings: FunctionComponent = () => {
  const { control, register } = useFormContext<FormData>();
  const { fields, append, remove } = useFieldArray<FormData>({
    name: "settings.headers",
  });

  const t = useTheme();

  return (
    <>
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
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ flex: 1 }}>Key</TableCell>
              <TableCell sx={{ flex: 1 }}>Value</TableCell>
              <TableCell
                sx={{
                  minWidth: "40px",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((_, index) => (
              <TableRow key={index}>
                <TableCell sx={{ flex: 1 }}>
                  <Controller
                    name={`settings.headers.${index}.key` as const}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Autocomplete
                        freeSolo
                        options={requestHeaders}
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

                <TableCell sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    {...register(`settings.headers.${index}.value` as const)}
                  />
                </TableCell>

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
              { key: "", value: "" },
              {
                shouldFocus: false,
              },
            );
          }}
          startIcon={<VscAdd />}
        >
          Add header
        </Button>
      </Box>
    </>
  );
};

export default HeaderSettings;
