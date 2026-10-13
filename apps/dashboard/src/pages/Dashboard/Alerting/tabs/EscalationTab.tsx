import { FunctionComponent } from "react";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useEscalationPolicy } from "../../../../hooks/escalation.query";
import { useTeamUsers } from "../../../../hooks/team.query";
import EscalationForm from "../components/EscalationForm";

const EscalationTab: FunctionComponent = () => {
  const { data: policy, isPending: isLoadingPolicy } = useEscalationPolicy();
  const { data: usersData, isPending: isLoadingUsers } = useTeamUsers();

  if (isLoadingPolicy || isLoadingUsers) return <Placeholder />;

  return <EscalationForm policy={policy} users={usersData?.users ?? []} />;
};

export default EscalationTab;
