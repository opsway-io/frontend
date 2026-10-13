import { Divider, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MonitorFormData } from "../../models/monitorFormData";
import { nonHttpMethods } from "../../models/requestOptions";
import BrowserScriptSettings from "./BrowserScriptSettings";
import HeadersSettings from "./HeadersSettings";
import RequestBodySettings from "./RequestBodySettings";
import RequestMethodAndUrlFields from "./RequestMethodAndUrlFields";
import SettingsSubheader from "./SettingsSubheader";

interface RequestSettingsProps {
  stepIndex: number;
}

const RequestSettings: FunctionComponent<RequestSettingsProps> = ({
  stepIndex,
}) => {
  const { control } = useFormContext<MonitorFormData>();
  // The API type lists HTTP methods only, but the form also offers
  // TCP, DNS, BROWSER, … (see requestOptions).
  const method: string =
    useWatch({ control, name: `steps.${stepIndex}.method` }) || "GET";
  const isHttp = !nonHttpMethods.includes(method);

  return (
    <Stack spacing={2}>
      <SettingsSubheader
        title="Method and URL"
        description="Select the HTTP method and URL for the request."
      />

      <RequestMethodAndUrlFields stepIndex={stepIndex} />

      {isHttp && (
        <>
          <Divider />

          <SettingsSubheader
            title="Headers"
            description="Add any headers you want to send with your request."
          />

          <HeadersSettings stepIndex={stepIndex} />

          <Divider />

          <SettingsSubheader
            title="Body"
            description="You can optionally send a body with your request up to 1MB in size."
          />

          <RequestBodySettings stepIndex={stepIndex} />
        </>
      )}

      {method === "BROWSER" && (
        <>
          <Divider />
          <BrowserScriptSettings stepIndex={stepIndex} />
        </>
      )}
    </Stack>
  );
};

export default RequestSettings;
