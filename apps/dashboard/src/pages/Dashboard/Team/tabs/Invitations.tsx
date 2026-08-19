import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { toast } from "react-hot-toast";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import {
  useInviteTeamMember,
  useTeamInvitations,
  useRevokeTeamInvitation,
} from "../../../../hooks/team.query";
import { validate } from "email-validator";

const TeamInvitationsTabView: FunctionComponent = () => {
  const currentTeamId = useAuthenticationStore((state) => state.currentTeamId);
  const inviteMutation = useInviteTeamMember(currentTeamId as number);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(email)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      await inviteMutation.mutateAsync({ email, role });
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to invite team member",
      );
    }
  };

  const { data: invitationsData, isLoading: isLoadingInvitations } =
    useTeamInvitations(currentTeamId as number);
  const revokeMutation = useRevokeTeamInvitation(currentTeamId as number);

  const handleRevoke = async (email: string) => {
    try {
      await revokeMutation.mutateAsync(email);
      toast.success(`Revoked invitation for ${email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to revoke invitation");
    }
  };

  return (
    <Card>
      <CardHeader
        title="Invite Member"
        subheader="Invite a new member to your team"
      />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              disabled={inviteMutation.isLoading}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                disabled={inviteMutation.isLoading}
              >
                <MenuItem value="OWNER">Owner</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MEMBER">Member</MenuItem>
                <MenuItem value="VIEWER">Viewer</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!email || inviteMutation.isLoading}
              sx={{ height: 56, px: 4 }}
            >
              {inviteMutation.isLoading ? "Inviting..." : "Invite"}
            </Button>
          </Stack>
        </form>
      </CardContent>

      <Divider />
      <CardHeader title="Pending Invitations" />
      <CardContent>
        {isLoadingInvitations ? (
          <div>Loading...</div>
        ) : !invitationsData?.invites ||
          invitationsData.invites.length === 0 ? (
          <div style={{ color: "gray" }}>No pending invitations.</div>
        ) : (
          <Stack spacing={2}>
            {invitationsData.invites.map((invite) => (
              <Stack
                key={invite.email}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <div>
                  <strong>{invite.email}</strong>
                  <div style={{ fontSize: "0.875rem", color: "gray" }}>
                    Role: {invite.role} • Sent:{" "}
                    {new Date(invite.createdAt).toLocaleString()}
                  </div>
                </div>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleRevoke(invite.email)}
                  disabled={revokeMutation.isLoading}
                >
                  Revoke
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamInvitationsTabView;
