import { Box, Button, ToggleButtonGroup } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import Editor from "../../../../../components/Editor/Editor";
import { MonitorFormData } from "../../models/monitorFormData";
import {
  bodyTypeToEditorLanguage,
  requestBodyTypeOptions,
} from "../../models/requestOptions";

const toggleGroupSx = {
  width: "100%",
  minWidth: "fit-content",
  "& > button": { flex: 1, whiteSpace: "nowrap" },
  '& > button[aria-pressed="true"]': {
    bgcolor: "neutral.softActiveBg",
    color: "text.primary",
  },
};

interface RequestBodySettingsProps {
  stepIndex: number;
}

const RequestBodySettings: FunctionComponent<RequestBodySettingsProps> = ({
  stepIndex,
}) => {
  const { control, setValue, trigger } = useFormContext<MonitorFormData>();
  const bodyType = useWatch({ control, name: `steps.${stepIndex}.body.type` });
  const editorLanguage = bodyTypeToEditorLanguage(bodyType);

  return (
    <>
      <Controller
        name={`steps.${stepIndex}.body.type`}
        control={control}
        render={({ field }) => (
          <Box sx={{ overflowX: "auto", scrollbarWidth: "none" }}>
            <ToggleButtonGroup
              variant="outlined"
              color="neutral"
              value={field.value ?? null}
              onChange={(_, value) => {
                if (!value) {
                  return;
                }

                field.onChange(value);

                if (value === "NONE") {
                  setValue(`steps.${stepIndex}.body.content`, null);
                  trigger(`steps.${stepIndex}.body.content`);
                }
              }}
              sx={toggleGroupSx}
            >
              {requestBodyTypeOptions.map((option) => (
                <Button key={option.value} value={option.value}>
                  {option.label}
                </Button>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}
      />

      {bodyType && bodyType !== "NONE" && (
        <Controller
          name={`steps.${stepIndex}.body.content`}
          control={control}
          render={({ field }) => (
            <Editor
              defaultLanguage={editorLanguage}
              language={editorLanguage}
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      )}
    </>
  );
};

export default RequestBodySettings;
