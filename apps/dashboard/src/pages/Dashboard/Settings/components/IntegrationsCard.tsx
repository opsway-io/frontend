import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useState } from "react";
import { IGetTeamResponse } from "../../../../api/endpoints/teams";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useMutateCurrentTeam } from "../../../../hooks/team.query";
import { INTEGRATION_FIELDS, IntegrationKey } from "../integrationFields";
import { toTeamUpdateRequest } from "../teamUpdateRequest";

type IntegrationValues = Record<IntegrationKey, string>;

const valuesFromTeam = (team: IGetTeamResponse) =>
  Object.fromEntries(
    INTEGRATION_FIELDS.map(({ key }) => [key, team[key] ?? ""]),
  ) as IntegrationValues;

interface IntegrationsCardProps {
  team: IGetTeamResponse;
}

const IntegrationsCard: FunctionComponent<IntegrationsCardProps> = ({
  team,
}) => {
  const { mutate, isPending } = useMutateCurrentTeam();
  const [values, setValues] = useState(() => valuesFromTeam(team));

  const initialValues = valuesFromTeam(team);
  const changed = INTEGRATION_FIELDS.some(
    ({ key }) => values[key] !== initialValues[key],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!changed) return;

    const changes = Object.fromEntries(
      INTEGRATION_FIELDS.map(({ key }) => [key, values[key] || undefined]),
    );

    mutate(toTeamUpdateRequest(team, changes), {
      onSuccess: () => {
        enqueueSnackbar("Settings saved", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Failed to save settings", { variant: "error" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard
        title="Notification integrations"
        description="Connect your team to chat tools and webhooks to receive alerts when a monitor or heartbeat goes down."
        actions={
          <Button type="submit" disabled={!changed} loading={isPending}>
            Save
          </Button>
        }
      >
        {INTEGRATION_FIELDS.map((field) => (
          <FormControl key={field.key}>
            <FormLabel>{field.label}</FormLabel>
            <Input
              value={values[field.key]}
              placeholder={field.placeholder}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
            />
            <FormHelperText>{field.description}</FormHelperText>
          </FormControl>
        ))}
      </SettingsCard>
    </form>
  );
};

export default IntegrationsCard;
