import { FunctionComponent, useState } from "react";
import Placeholder from "../../../../components/Placeholder";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { BsCheckLg } from "react-icons/bs";
import {
  useCurrentTeam,
  usePostCustomerPortal,
  useGetCustomerSession,
} from "../../../../hooks/team.query";
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
  const { data: customerPortal, isLoading: isLoadingPortal } =
    usePostCustomerPortal();
  // const { data: teamSubscription, isLoading: isLoadingSubscription } =
  //   useGetCustomerSession();

  return (
    <>
    {isLoadingTeam ? (
      <Placeholder />
    ) : (
      <>
      {team?.paymentPlan ? (
        <Card>
          <CardHeader title="Current Subscription" />
          <CardContent>
            <Typography variant="h6">{team?.paymentPlan}</Typography>
            <div>
            <a href={customerPortal?.url}>
        <button>Manage Subscriptions here </button>
      </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Choose a Subscription"/>
          <CardContent>
          <stripe-pricing-table
              pricing-table-id="prctbl_1PzENqAAd26uMXu2gnpkNNGV"
              publishable-key="pk_test_51NjhPuAAd26uMXu2mDsC5CrJzCokmFCMDEiyZFGanTQAy2exlztxyuLDpg2TXC26LK8j9wqnACLAAwEyWS0AJ4r500U1rDn672"
              client-reference-id={team?.id}
              // customer-session-client-secret={teamSubscription?.sessionId}
            ></stripe-pricing-table>
          </CardContent>
        </Card>
      )}
      </>
    )}
    </>
  );
};

export default TeamPlanTabView;
