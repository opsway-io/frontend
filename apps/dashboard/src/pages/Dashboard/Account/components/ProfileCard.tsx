import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useState } from "react";
import { IGetUserResponse } from "../../../../api/endpoints/users";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useMutateCurrentUser } from "../../../../hooks/user.query";
import { toUserUpdateRequest } from "../userUpdateRequest";

interface ProfileCardProps {
  user: IGetUserResponse;
}

const ProfileCard: FunctionComponent<ProfileCardProps> = ({ user }) => {
  const { mutate, isPending } = useMutateCurrentUser();
  const [name, setName] = useState(user.name);
  const [displayName, setDisplayName] = useState(user.displayName ?? "");

  const nameValid = name.length > 0 && name.length <= 255;
  const displayNameValid = displayName.length <= 255;
  const changed =
    name !== user.name || displayName !== (user.displayName ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!changed || !nameValid || !displayNameValid) return;

    mutate(toUserUpdateRequest(user, { name, displayName }), {
      onSuccess: () => {
        enqueueSnackbar("Account updated", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Failed to update account", { variant: "error" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard
        title="Profile"
        description="Your full name and display name which other people can see."
        actions={
          <Button
            type="submit"
            disabled={!changed || !nameValid || !displayNameValid}
            loading={isPending}
          >
            Save
          </Button>
        }
      >
        <FormControl error={!nameValid}>
          <FormLabel>Full name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          {!nameValid && (
            <FormHelperText>
              Name must be between 1 and 255 characters.
            </FormHelperText>
          )}
        </FormControl>

        <FormControl error={!displayNameValid}>
          <FormLabel>Display name</FormLabel>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {!displayNameValid && (
            <FormHelperText>
              Display name must be at most 255 characters.
            </FormHelperText>
          )}
        </FormControl>
      </SettingsCard>
    </form>
  );
};

export default ProfileCard;
