import { Stack } from "@mui/joy";
import { FunctionComponent } from "react";
import InviteMemberCard from "../components/InviteMemberCard";
import PendingInvitationsCard from "../components/PendingInvitationsCard";

const InvitationsTab: FunctionComponent = () => (
  <Stack spacing={2}>
    <InviteMemberCard />
    <PendingInvitationsCard />
  </Stack>
);

export default InvitationsTab;
