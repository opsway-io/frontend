import { LoadingButton } from "@mui/lab";
import { Box, Card, Stack, TextField, Typography, MenuItem, Button, IconButton } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import {
  getNotificationRules,
  updateNotificationRules,
  INotificationRule,
} from "../../../../api/endpoints/users";
import { useCurrentUser } from "../../../../hooks/user.query";

interface IFormInput {
  rules: INotificationRule[];
}

const NotificationRules: FunctionComponent = () => {
  const { data: user } = useCurrentUser();
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: { rules: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  useEffect(() => {
    if (user?.id) {
      getNotificationRules(user.id)
        .then((res) => {
          reset({ rules: res.rules || [] });
        })
        .catch(() => {
          toast.error("Failed to load notification rules");
        })
        .finally(() => setLoading(false));
    }
  }, [user, reset]);

  const onSubmit = async (data: IFormInput) => {
    if (!user?.id) return;
    try {
      await updateNotificationRules(user.id, data.rules);
      toast.success("Notification preferences saved successfully");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to save preferences");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Configure how and when you want to receive alerts when an incident occurs.
        A delay of 0 means you will be notified immediately.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {fields.map((field, index) => (
            <Stack direction="row" spacing={2} alignItems="center" key={field.id}>
              <Controller
                name={`rules.${index}.channel`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Channel"
                    fullWidth
                    required
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="voice">Voice</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name={`rules.${index}.delay`}
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Delay (minutes)"
                    fullWidth
                    required
                  />
                )}
              />
              <IconButton color="error" onClick={() => remove(index)}>
                <MdDelete />
              </IconButton>
            </Stack>
          ))}
          <Box>
            <Button
              variant="outlined"
              onClick={() => append({ channel: "email", delay: 0 })}
            >
              Add Rule
            </Button>
          </Box>
          <Box mt={2} textAlign="right">
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Preferences
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Card>
  );
};

export default NotificationRules;
