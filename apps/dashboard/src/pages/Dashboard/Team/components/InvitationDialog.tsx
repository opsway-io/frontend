import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { validate as validateEmail } from "email-validator";
import { FunctionComponent } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import UpgradePromptModal from "../../../../components/UpgradePromptModal/UpgradePromptModal";
import { ASSIGNABLE_ROLES } from "../teamRoles";
import useSendInvitation from "../useSendInvitation";

interface InvitationDialogProps {
  open: boolean;
  onClose?: () => void;
}

interface InvitationFormValues {
  email: string;
  role: string;
}

const InvitationDialog: FunctionComponent<InvitationDialogProps> = (props) => {
  const { sendInvitation, isPending, upgradeRequired, closeUpgradePrompt } =
    useSendInvitation();

  const {
    register,
    formState: { isValid },
    handleSubmit,
    control,
    reset,
  } = useForm<InvitationFormValues>({
    defaultValues: { email: "", role: "MEMBER" },
  });

  const onClose = () => {
    props.onClose?.();
    reset();
  };

  const onSubmit = handleSubmit(async ({ email, role }) => {
    const result = await sendInvitation(email, role);

    if (result === "sent") reset();
    if (result === "upgrade-required") props.onClose?.();
  });

  return (
    <>
      <UpgradePromptModal
        open={upgradeRequired}
        onClose={closeUpgradePrompt}
        featureName="Team Members"
      />
      <Dialog
        open={props.open}
        onClose={onClose}
        title="Invite a member"
        maxWidth="sm"
      >
        <form onSubmit={onSubmit} style={{ display: "contents" }}>
          <DialogContent>
            <Stack spacing={2}>
              <FormControl disabled={isPending}>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="foo@bar.com"
                  type="email"
                  // oxlint-disable-next-line jsx-a11y/no-autofocus -- first field of a dialog the user just opened
                  autoFocus
                  slotProps={{
                    input: register("email", {
                      required: true,
                      validate: (value) => validateEmail(value),
                    }),
                  }}
                />
              </FormControl>

              <Controller
                name="role"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl disabled={isPending}>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    >
                      {ASSIGNABLE_ROLES.map((role) => (
                        <Option key={role.value} value={role.value}>
                          {role.label}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Typography level="body-sm" textColor="text.secondary">
                Members can see everything in this team, but can't edit or
                create anything. Admins can do everything except manage billing
                and delete the team.
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="plain" color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid} loading={isPending}>
              Send invite
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default InvitationDialog;
