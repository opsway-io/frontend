import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import {
  useEscalationPolicy,
  useUpdateEscalationPolicy,
} from "../../../../hooks/escalation.query";
import { useTeamUsers } from "../../../../hooks/team.query";
import { EscalationPolicy } from "../../../../api/endpoints/teams";

interface FormInputs {
  name: string;
  escalationTimeoutMinutes: number;
  enforcedChannel: string;
  rotations: { userId: number; tier: number }[];
}

const Escalation: FunctionComponent = () => {
  const { data: policy, isLoading: isPolicyLoading } = useEscalationPolicy();
  const { mutateAsync: updatePolicy, isLoading: isUpdating } =
    useUpdateEscalationPolicy();
  const { data: usersData, isLoading: isUsersLoading } = useTeamUsers();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, control } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      escalationTimeoutMinutes: 15,
      enforcedChannel: "",
      rotations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rotations",
  });

  useEffect(() => {
    if (policy) {
      reset({
        name: policy.name,
        escalationTimeoutMinutes: policy.escalationTimeoutMinutes,
        enforcedChannel: policy.enforcedChannel || "",
        rotations: policy.rotations || [],
      });
    }
  }, [policy, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMsg(null);
    try {
      await updatePolicy(data as EscalationPolicy);
    } catch (e: any) {
      const msg = e.response?.data?.message || "Failed to save policy.";
      setErrorMsg(msg);
    }
  };

  if (isPolicyLoading || isUsersLoading) return null;

  const users = usersData?.users || [];

  return (
    <Card>
      <CardHeader
        title="Escalation Policy"
        subheader="Manage how incidents are escalated to your team members"
      />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            
            <TextField
              fullWidth
              label="Policy Name"
              {...register("name", { required: true })}
            />
            
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Escalation Timeout (minutes)"
                {...register("escalationTimeoutMinutes", {
                  required: true,
                  min: 1,
                })}
              />

              <TextField
                select
                fullWidth
                label="Contact Method"
                defaultValue={policy?.enforcedChannel || ""}
                {...register("enforcedChannel")}
              >
                <MenuItem value="">User Preference (Default)</MenuItem>
                <MenuItem value="email">Enforce Email</MenuItem>
                <MenuItem value="sms">Enforce SMS</MenuItem>
                <MenuItem value="voice">Enforce Voice Calls</MenuItem>
              </TextField>
            </Stack>

            <Typography variant="h6">On-Call Rotations</Typography>
            <Typography variant="body2" color="textSecondary">
              Assign users to escalation tiers. Tier 1 is alerted immediately,
              Tier 2 after the timeout.
            </Typography>

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Stack
                  direction="row"
                  spacing={2}
                  key={field.id}
                  alignItems="center"
                >
                  <TextField
                    select
                    fullWidth
                    label="Team Member"
                    defaultValue={field.userId || ""}
                    {...register(`rotations.${index}.userId`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.displayName || user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Tier"
                    defaultValue={field.tier || 1}
                    sx={{ width: 100 }}
                    {...register(`rotations.${index}.tier`, {
                      required: true,
                      valueAsNumber: true,
                    })}
                  >
                    {[1, 2, 3, 4, 5].map((tier) => (
                      <MenuItem key={tier} value={tier}>
                        {tier}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button color="error" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </Stack>
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  append({
                    userId: users.length > 0 ? users[0].id : 0,
                    tier: 1,
                  })
                }
              >
                Add Rotation
              </Button>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isUpdating}
              >
                Save
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default Escalation;
