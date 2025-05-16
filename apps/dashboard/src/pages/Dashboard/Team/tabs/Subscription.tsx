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
} from "@mui/material";
import { BsCheckLg } from "react-icons/bs";
import {
  useCurrentTeam,
  usePostCustomerPortal,
  useGetProducts,
} from "../../../../hooks/team.query";

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
    const { data: products, isLoading: isLoadingProduct } =
    useGetProducts();

  return (
    <>
    {isLoadingTeam ? (
      <Placeholder />
    ) : (
      <>
      {team?.paymentPlan ? (
        <Card>
        <CardContent>
          {isLoadingProduct ? (
            <Placeholder />
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {products?.products.map((product) => (
              <Grid item>
                <PricingCard
                  key={product.id}
                  title={product.name}
                  description="For small teams"
                  price={product.currency + " " + product.price.toString()} 
                  features={product.marketing_features ? product.marketing_features : []}
                  selected={team?.paymentPlan.toLocaleLowerCase() === product.name.toLocaleLowerCase()}
                  />
              </Grid>
                ))}
            </Grid>
          )}
        </CardContent>
        <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{
              marginTop: "auto",
            }}
            component="a"
            href={customerPortal?.url}
          >
            Manage Subscriptions
          </Button>
      </Card>
      ) : (
        <Card>
          <CardHeader align="center" title="Choose a Subscription"/>
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

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  selected: boolean;
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  selected,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 300,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "none",
      }}
      variant={selected ? "outlined" : "elevation"}
    >
      <Box
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h4" color="text.primary">
          {selected ?  title + " (Current Plan)" : title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <CardContent
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Typography variant="h5">{price}</Typography>
        <Typography variant="h5" color="text.secondary">
          / month
        </Typography>
      </CardContent>

      <Divider
        sx={{
          marginLeft: 2,
          marginRight: 2,
          opacity: 0.25,
        }}
      />

      <CardContent
        sx={{
          paddingTop: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List>
          {features.map((feature) => (
            <ListItem
              sx={{
                paddingRight: 0,
                paddingLeft: 0,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                }}
              >
                <BsCheckLg color={theme.palette.success.main} />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};