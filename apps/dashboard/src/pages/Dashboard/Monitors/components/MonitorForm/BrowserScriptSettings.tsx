import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Editor from "../../../../../components/Editor/Editor";
import { MonitorFormData } from "../../models/monitorFormData";
import SettingsSubheader from "./SettingsSubheader";

interface BrowserScriptSettingsProps {
  stepIndex: number;
}

const BrowserScriptSettings: FunctionComponent<BrowserScriptSettingsProps> = ({
  stepIndex,
}) => {
  const { control, getValues, setValue } = useFormContext<MonitorFormData>();

  return (
    <>
      <SettingsSubheader
        title="Browser script (JSON)"
        description={
          <>
            Define the actions for the headless browser to execute as a JSON
            array (e.g. {`[{"action":"wait", "selector":".loaded"}]`}).
          </>
        }
      />

      <Controller
        name={`steps.${stepIndex}.body.content`}
        control={control}
        render={({ field }) => (
          <Editor
            defaultLanguage="json"
            language="json"
            value={field.value || ""}
            onChange={(value) => {
              // The browser script is always sent as a JSON body.
              if (getValues(`steps.${stepIndex}.body.type`) !== "JSON") {
                setValue(`steps.${stepIndex}.body.type`, "JSON");
              }
              field.onChange(value);
            }}
          />
        )}
      />
    </>
  );
};

export default BrowserScriptSettings;
