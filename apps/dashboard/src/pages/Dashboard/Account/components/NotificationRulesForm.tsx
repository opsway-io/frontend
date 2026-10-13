import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { IoAdd, IoTrashOutline } from "react-icons/io5";
import { INotificationRule } from "../../../../api/endpoints/users";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useUpdateNotificationRules } from "../../../../hooks/user.query";

/** Upper bound accepted by the API (24 hours). */
const MAX_DELAY_MINUTES = 1440;

interface NotificationRulesFormValues {
  rules: INotificationRule[];
}

interface NotificationRulesFormProps {
  rules: INotificationRule[];
}

const NotificationRulesForm: FunctionComponent<NotificationRulesFormProps> = ({
  rules,
}) => {
  const { mutateAsync: updateRules } = useUpdateNotificationRules();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NotificationRulesFormValues>({ defaultValues: { rules } });

  const { fields, append, remove } = useFieldArray({ control, name: "rules" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateRules(values.rules);
      enqueueSnackbar("Notification preferences saved successfully", {
        variant: "success",
      });
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      enqueueSnackbar(message || "Failed to save preferences", {
        variant: "error",
      });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <SettingsCard
        title="Notification preferences"
        description="Configure how and when you want to receive alerts when an incident occurs. A delay of 0 means you will be notified immediately."
        actions={
          <Button type="submit" loading={isSubmitting}>
            Save preferences
          </Button>
        }
      >
        {fields.length === 0 && (
          <Typography
            level="body-sm"
            textColor="text.tertiary"
            sx={{
              py: 3,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: "md",
            }}
          >
            No notification rules yet.
          </Typography>
        )}

        {fields.map((rule, index) => (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-end"
            key={rule.id}
          >
            <Controller
              name={`rules.${index}.channel`}
              control={control}
              render={({ field }) => (
                <FormControl required sx={{ flex: 1 }}>
                  {index === 0 && <FormLabel>Channel</FormLabel>}
                  <Select
                    aria-label="Channel"
                    value={field.value ?? null}
                    onChange={(_, value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  >
                    <Option value="email">Email</Option>
                    <Option value="sms">SMS</Option>
                    <Option value="voice">Voice</Option>
                  </Select>
                </FormControl>
              )}
            />
            <FormControl required sx={{ flex: 1 }}>
              {index === 0 && <FormLabel>Delay (minutes)</FormLabel>}
              <Input
                type="number"
                aria-label="Delay in minutes"
                slotProps={{
                  input: {
                    min: 0,
                    max: MAX_DELAY_MINUTES,
                    // The API expects a number, not the input's string value.
                    ...register(`rules.${index}.delay`, {
                      required: true,
                      valueAsNumber: true,
                      min: 0,
                      max: MAX_DELAY_MINUTES,
                    }),
                  },
                }}
              />
            </FormControl>
            <Tooltip title="Remove rule">
              <IconButton
                variant="plain"
                color="danger"
                size="md"
                aria-label="Remove rule"
                onClick={() => remove(index)}
              >
                <IoTrashOutline />
              </IconButton>
            </Tooltip>
          </Stack>
        ))}

        <Box>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<IoAdd />}
            onClick={() => append({ channel: "email", delay: 0 })}
          >
            Add rule
          </Button>
        </Box>
      </SettingsCard>
    </form>
  );
};

export default NotificationRulesForm;
