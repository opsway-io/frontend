import {
  Divider,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Conditional from "../../../../components/Conditional";
import Editor from "../../../../components/Editor";
import { FormData } from "../models/formData";
import {
  requestBodyTypeOptions,
  requestMethodOptions,
} from "../models/requestOptions";
import HeaderSettings from "./HeadersSettings";

const RequestSettings: FunctionComponent = () => {
  const { register, control, setValue, trigger } = useFormContext<FormData>();

  return (
    <Stack spacing={2}>
      <Stack>
        <Typography variant="subtitle1">Method and URL</Typography>
        <Typography variant="body1" color="textSecondary">
          Select the HTTP method and URL for the request.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Stack>
          <Controller
            name="method"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField select {...field} sx={{ width: "150px" }} size="small">
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
            name="url"
            control={control}
            rules={{
              required: true,
              pattern: {
                value: /^https?:\/\/.+/,
                message: "URL must start with http:// or https://",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                size="small"
                placeholder="https://api.example.com/pets"
              />
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      <Stack>
        <Typography variant="subtitle1">Headers</Typography>
        <Typography variant="body1" color="textSecondary">
          Add any headers you want to send with your request.
        </Typography>
      </Stack>

      <HeaderSettings />

      <Divider />

      <Stack>
        <Typography variant="subtitle1">Body</Typography>
        <Typography variant="body1" color="textSecondary">
          You can optionally send a body with your request up to 1MB in size.
        </Typography>
      </Stack>

      <Controller
        name="bodyType"
        control={control}
        render={(bodyTypeProps) => (
          <>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={bodyTypeProps.field.value}
              onChange={(_, value) => {
                bodyTypeProps.field.onChange(value);

                if (value === "NONE") {
                  setValue("body", "");
                  trigger("body");
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

            <Conditional value={bodyTypeProps.field.value !== "NONE"}>
              <Controller
                name="body"
                control={control}
                render={(bodyProps) => (
                  <Editor
                    defaultLanguage={bodyTypeToEditorLanguage(
                      bodyTypeProps.field.value,
                    )}
                    language={bodyTypeToEditorLanguage(
                      bodyTypeProps.field.value,
                    )}
                    value={bodyProps.field.value}
                    onChange={bodyProps.field.onChange}
                  />
                )}
              />
            </Conditional>
          </>
        )}
      />
    </Stack>
  );
};

function bodyTypeToEditorLanguage(bodyType: string): string {
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
}

export default RequestSettings;
