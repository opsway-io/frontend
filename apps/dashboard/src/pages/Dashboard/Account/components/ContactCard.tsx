import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { validate as validateEmail } from "email-validator";
import { enqueueSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useState } from "react";
import { IGetUserResponse } from "../../../../api/endpoints/users";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import { useMutateCurrentUser } from "../../../../hooks/user.query";
import { toUserUpdateRequest } from "../userUpdateRequest";

interface ContactCardProps {
  user: IGetUserResponse;
}

const ContactCard: FunctionComponent<ContactCardProps> = ({ user }) => {
  const { mutate, isPending } = useMutateCurrentUser();
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");

  const emailValid = validateEmail(email);
  const changed =
    email !== user.email || phoneNumber !== (user.phoneNumber ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!changed || !emailValid) return;

    mutate(
      toUserUpdateRequest(user, {
        email,
        phoneNumber: phoneNumber || undefined,
      }),
      {
        onSuccess: () => {
          enqueueSnackbar("Account updated", { variant: "success" });
        },
        onError: () => {
          enqueueSnackbar("Failed to update account", { variant: "error" });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <SettingsCard
        title="Contact"
        description="Your email address is used for login. Your phone number is used for SMS and voice alerts."
        actions={
          <Button
            type="submit"
            disabled={!changed || !emailValid}
            loading={isPending}
          >
            Save
          </Button>
        }
      >
        <FormControl error={!emailValid}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!emailValid && (
            <FormHelperText>Please enter a valid email address.</FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Phone number</FormLabel>
          <Input
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <FormHelperText>
            Include the country code, e.g. +1234567890.
          </FormHelperText>
        </FormControl>
      </SettingsCard>
    </form>
  );
};

export default ContactCard;
