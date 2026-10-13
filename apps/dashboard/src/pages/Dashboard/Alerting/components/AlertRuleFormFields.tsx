import {
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller } from "react-hook-form";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { AlertRuleFormValues, CHANNEL_OPTIONS } from "../alertRules";
import ConditionAutocomplete from "./ConditionAutocomplete";

interface AlertRuleFormFieldsProps {
  control: Control<AlertRuleFormValues>;
}

/** The fields shared by the create and edit alert rule forms. */
const AlertRuleFormFields: FunctionComponent<AlertRuleFormFieldsProps> = ({
  control,
}) => (
  <>
    <SettingsCard
      title="Rule Details"
      description="Name the rule and choose what should trigger it."
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <FormLabel>Rule Name</FormLabel>
            <Input {...field} />
            {error?.message && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="condition"
        control={control}
        rules={{ required: "Condition is required" }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <FormLabel>Trigger Condition</FormLabel>
            <ConditionAutocomplete
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <FormHelperText>
              {error?.message ||
                "Select a default or type a custom match string"}
            </FormHelperText>
          </FormControl>
        )}
      />
    </SettingsCard>

    <SettingsCard
      title="Notifications"
      description="Choose where notifications are delivered."
    >
      <Controller
        name="channels"
        control={control}
        rules={{
          validate: (channels) =>
            channels.length > 0 || "At least one channel is required",
        }}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error}>
            <FormLabel>Notification Channels</FormLabel>
            <Autocomplete
              multiple
              options={CHANNEL_OPTIONS}
              value={field.value ?? []}
              onChange={(_, channels) => field.onChange(channels)}
              onBlur={field.onBlur}
            />
            {error?.message && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="enabled"
        control={control}
        render={({ field }) => (
          <Switch
            checked={!!field.value}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
            endDecorator="Enable this rule"
            sx={{ alignSelf: "flex-start" }}
          />
        )}
      />
    </SettingsCard>
  </>
);

export default AlertRuleFormFields;
