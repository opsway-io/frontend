import { FunctionComponent, useState } from "react";
import Placeholder from "../../../../components/Placeholder";
import {
  Card,
  CardContent,
} from "@mui/material";
import { useCurrentTeam, useGetCustomerSession } from "../../../../hooks/team.query";
import * as TeamsAPI from "../../../../api/endpoints/teams";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const TeamPlanTabView: FunctionComponent = () => {
  const { data: team, isLoading: isLoadingTeam } = useCurrentTeam();
  const { data: teamSubscription, isLoading: isLoadingSubscription } = useGetCustomerSession();

  console.log(teamSubscription?.sessionId)


  return (
    <>
      <Card>
        <CardContent>
        {(isLoadingTeam || isLoadingSubscription) ? (
            <Placeholder />
          ) : (
          <stripe-pricing-table
            pricing-table-id="prctbl_1PzENqAAd26uMXu2gnpkNNGV"
            publishable-key="pk_test_51NjhPuAAd26uMXu2mDsC5CrJzCokmFCMDEiyZFGanTQAy2exlztxyuLDpg2TXC26LK8j9wqnACLAAwEyWS0AJ4r500U1rDn672"
            client-reference-id={team?.id}
            customer-session-client-secret={teamSubscription?.sessionId}
            
          ></stripe-pricing-table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TeamPlanTabView;