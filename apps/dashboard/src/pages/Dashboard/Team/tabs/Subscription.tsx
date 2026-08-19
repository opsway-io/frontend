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
  usePostCreateCheckoutSession,
} from "../../../../hooks/team.query";
import { enqueueSnackbar } from "notistack";

const PLANS = [
  {
    plan: "FREE",
    title: "Free",
    description: "For small hobby projects",
    price: "$0",
    features: ["3 Team Members", "5 Monitors", "1 Status Page"],
  },
  {
    plan: "TEAM",
    title: "Team",
    description: "For small teams",
    price: "$29",
    features: ["5 Team Members", "50 Monitors", "5 Status Pages", "Slack Integrations"],
  },
  {
    plan: "ENTERPRISE",
    title: "Enterprise",
    description: "For large organizations",
    price: "$99",
    features: ["Unlimited Team Members", "Unlimited Monitors", "Unlimited Status Pages", "SSO (SAML)"],
  },
];

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
  const { data: customerPortal } = usePostCustomerPortal();
  
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: string) => {
    if (!team) return;
    setLoadingPlan(plan);
    try {
      const { postCreateCheckoutSession } = await import("../../../../api/endpoints/teams");
      await postCreateCheckoutSession(team.id, plan);
      // It redirects to stripe checkout, or cancels and succeeds silently
      if (plan === "FREE" && team.paymentPlan !== "FREE") {
        enqueueSnackbar("Successfully cancelled subscription", { variant: "success" });
        window.location.reload();
      }
    } catch (e: any) {
      enqueueSnackbar(e.message || "Failed to process plan change", { variant: "error" });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      {isLoadingTeam ? (
        <Placeholder />
      ) : (
        <Card>
          <CardHeader align="center" title="Choose a Subscription" />
          <CardContent>
            <Grid container spacing={2} justifyContent="center" alignItems="stretch">
              {PLANS.map((p) => (
                <Grid item key={p.plan}>
                  <PricingCard
                    title={p.title}
                    description={p.description}
                    price={p.price}
                    features={p.features}
                    selected={team?.paymentPlan === p.plan}
                    isLoading={loadingPlan === p.plan}
                    onSelect={() => handleSelectPlan(p.plan)}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
          {team?.paymentPlan && team.paymentPlan !== "FREE" && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ marginTop: "auto" }}
              component="a"
              href={customerPortal?.url}
            >
              Manage Subscriptions (Billing Portal)
            </Button>
          )}
        </Card>
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
  isLoading: boolean;
  onSelect: () => void;
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  selected,
  isLoading,
  onSelect,
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
          {selected ? title + " (Current Plan)" : title}
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
        <Box sx={{ mt: "auto", p: 2, pb: 0 }}>
          <Button
            variant="contained"
            color={selected ? "success" : "primary"}
            fullWidth
            onClick={onSelect}
            disabled={selected || isLoading}
          >
            {isLoading ? "Loading..." : selected ? "Current Plan" : "Select Plan"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
