import { FunctionComponent } from "react";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import { useCurrentTeam } from "../../../../hooks/team.query";
import IntegrationsCard from "../components/IntegrationsCard";

const IntegrationsTab: FunctionComponent = () => {
  const { data: team } = useCurrentTeam();

  if (!team) return <Placeholder />;

  // Keyed on updatedAt so the form picks up saved values.
  return <IntegrationsCard key={team.updatedAt} team={team} />;
};

export default IntegrationsTab;
