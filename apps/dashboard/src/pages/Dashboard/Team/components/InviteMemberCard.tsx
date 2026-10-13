import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import { validate as validateEmail } from "email-validator";
import { enqueueSnackbar } from "notistack";
import { FormEvent, FunctionComponent, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import UpgradePromptModal from "../../../../components/UpgradePromptModal/UpgradePromptModal";
import { ASSIGNABLE_ROLES } from "../teamRoles";
import useSendInvitation from "../useSendInvitation";

const InviteMemberCard: FunctionComponent = () => {
  const { sendInvitation, isPending, upgradeRequired, closeUpgradePrompt } =
    useSendInvitation();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      enqueueSnackbar("Invalid email address", { variant: "error" });
      return;
    }

    if ((await sendInvitation(email, role)) === "sent") setEmail("");
  };

  return (
    <SettingsCard
      title="Invite member"
      description="Invite a new member to your team."
    >
      <form onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
        >
          <FormControl required sx={{ flex: 1 }}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="name@company.com"
              startDecorator={<IoMailOutline />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <FormLabel>Role</FormLabel>
            <Select
              value={role}
              onChange={(_, value) => value && setRole(value)}
              disabled={isPending}
            >
              {ASSIGNABLE_ROLES.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            disabled={!email}
            loading={isPending}
            sx={{ px: 3 }}
          >
            Invite
          </Button>
        </Stack>
      </form>

      <UpgradePromptModal
        open={upgradeRequired}
        onClose={closeUpgradePrompt}
        featureName="Team Members"
      />
    </SettingsCard>
  );
};

export default InviteMemberCard;
