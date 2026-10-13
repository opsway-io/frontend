import { FormControl, FormLabel, Input, Option, Select, Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import {
  EscalationFormValues,
  MAX_ESCALATION_TIMEOUT_MINUTES,
} from "../escalationForm";

interface EscalationPolicyCardProps {
  control: Control<EscalationFormValues>;
  register: UseFormRegister<EscalationFormValues>;
}

const EscalationPolicyCard: FunctionComponent<EscalationPolicyCardProps> = ({
  control,
  register,
}) => (
  <SettingsCard
    title="Escalation Policy"
    description="Manage how incidents are escalated to your team members."
  >
    <FormControl required>
      <FormLabel>Policy name</FormLabel>
      <Input slotProps={{ input: register("name", { required: true }) }} />
    </FormControl>

    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <FormControl required sx={{ flex: 1 }}>
        <FormLabel>Escalation timeout (minutes)</FormLabel>
        <Input
          type="number"
          slotProps={{
            input: {
              min: 1,
              max: MAX_ESCALATION_TIMEOUT_MINUTES,
              ...register("escalationTimeoutMinutes", {
                required: true,
                valueAsNumber: true,
                min: 1,
                max: MAX_ESCALATION_TIMEOUT_MINUTES,
              }),
            },
          }}
        />
      </FormControl>

      <Controller
        name="enforcedChannel"
        control={control}
        render={({ field }) => (
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Contact method</FormLabel>
            <Select
              value={field.value ?? ""}
              onChange={(_, value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
            >
              <Option value="">User preference (default)</Option>
              <Option value="email">Enforce email</Option>
              <Option value="sms">Enforce SMS</Option>
              <Option value="voice">Enforce voice calls</Option>
            </Select>
          </FormControl>
        )}
      />
    </Stack>
  </SettingsCard>
);

export default EscalationPolicyCard;
