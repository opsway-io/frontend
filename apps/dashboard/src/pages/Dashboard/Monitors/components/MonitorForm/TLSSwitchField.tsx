import { Switch } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MonitorFormData } from "../../models/monitorFormData";
import SwitchRow from "./SwitchRow";

interface TLSSwitchFieldProps {
  field: "enabled" | "verifyHostname" | "checkExpiration";
  label: ReactNode;
  description: ReactNode;
  disabled?: boolean;
}

const TLSSwitchField: FunctionComponent<TLSSwitchFieldProps> = (props) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <Controller
      control={control}
      name={`settings.tls.${props.field}`}
      disabled={props.disabled}
      render={({ field }) => (
        <SwitchRow
          label={props.label}
          description={props.description}
          disabled={field.disabled}
        >
          <Switch
            checked={!!field.value}
            disabled={field.disabled}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
          />
        </SwitchRow>
      )}
    />
  );
};

export default TLSSwitchField;
