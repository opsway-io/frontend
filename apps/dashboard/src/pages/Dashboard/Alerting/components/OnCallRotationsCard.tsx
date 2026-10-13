import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Option,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { IoAdd, IoTrashOutline } from "react-icons/io5";
import { IGetTeamUserResponse } from "../../../../api/endpoints/teams";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { ESCALATION_TIERS, EscalationFormValues } from "../escalationForm";

interface OnCallRotationsCardProps {
  control: Control<EscalationFormValues>;
  users: IGetTeamUserResponse[];
}

const OnCallRotationsCard: FunctionComponent<OnCallRotationsCardProps> = ({
  control,
  users,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rotations",
  });

  return (
    <SettingsCard
      title="On-call rotations"
      description="Assign users to escalation tiers. Tier 1 is alerted immediately, Tier 2 after the timeout."
    >
      {fields.length === 0 && (
        <Typography
          level="body-sm"
          textColor="text.tertiary"
          sx={{
            py: 2,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "md",
          }}
        >
          No rotations yet.
        </Typography>
      )}

      {fields.map((rotation, index) => (
        <Stack
          direction="row"
          spacing={1.5}
          key={rotation.id}
          alignItems="flex-end"
        >
          <Controller
            name={`rotations.${index}.userId`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl sx={{ flex: 1, minWidth: 0 }}>
                {index === 0 && <FormLabel>Team member</FormLabel>}
                <Select
                  aria-label="Team member"
                  value={field.value ?? null}
                  onChange={(_, value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  placeholder="Select a member"
                >
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.displayName || user.name} ({user.email})
                    </Option>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name={`rotations.${index}.tier`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl sx={{ width: 100 }}>
                {index === 0 && <FormLabel>Tier</FormLabel>}
                <Select
                  aria-label="Tier"
                  value={field.value ?? 1}
                  onChange={(_, value) => field.onChange(value)}
                  onBlur={field.onBlur}
                >
                  {ESCALATION_TIERS.map((tier) => (
                    <Option key={tier} value={tier}>
                      {tier}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Tooltip title="Remove">
            <IconButton
              variant="plain"
              color="danger"
              size="md"
              aria-label="Remove rotation"
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
          disabled={users.length === 0}
          onClick={() => append({ userId: users[0].id, tier: 1 })}
        >
          Add rotation
        </Button>
      </Box>
    </SettingsCard>
  );
};

export default OnCallRotationsCard;
