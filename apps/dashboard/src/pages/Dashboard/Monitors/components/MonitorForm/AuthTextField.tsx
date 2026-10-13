import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import { FunctionComponent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MonitorFormData } from "../../models/monitorFormData";

type AuthCredentialField =
  "tokenUrl" | "clientId" | "clientSecret" | "username" | "password";

interface AuthTextFieldProps {
  field: AuthCredentialField;
  label: string;
  type?: "text" | "password";
  placeholder?: string;
  /** When set, the field is required and this message is shown when empty. */
  requiredMessage?: string;
}

const AuthTextField: FunctionComponent<AuthTextFieldProps> = (props) => {
  const { control } = useFormContext<MonitorFormData>();
  const required = !!props.requiredMessage;

  return (
    <Controller
      name={`settings.auth.${props.field}`}
      control={control}
      rules={{ required }}
      render={({ field: { ref, ...field }, fieldState }) => (
        <FormControl error={fieldState.invalid} required={required}>
          <FormLabel>{props.label}</FormLabel>
          <Input
            {...field}
            type={props.type}
            placeholder={props.placeholder}
            value={field.value || ""}
            slotProps={{ input: { ref } }}
          />
          {fieldState.invalid && (
            <FormHelperText>{props.requiredMessage}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default AuthTextField;
