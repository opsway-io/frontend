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
import { enqueueSnackbar } from "notistack";

const FREE_PLAN = {
  plan: "FREE",
  title: "Free",
  description: "For small hobby projects",
  price: "$0",
  features: ["3 Team Members", "5 Monitors", "1 Status Page"],
};

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
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: string) => {
    if (!team) return;
    setLoadingPlan(plan);
    try {
      const { postCreateCheckoutSession } = await import(
        "../../../../api/endpoints/teams"
      );
      await postCreateCheckoutSession(team.id, plan);
      
      if (plan === "FREE" && team.paymentPlan !== "FREE") {
        enqueueSnackbar("Successfully cancelled subscription", {
          variant: "success",
        });
        window.location.reload();
      } else {
        enqueueSnackbar("Successfully updated subscription", {
          variant: "success",
        });
        window.location.reload();
      }
    } catch (e: any) {
      enqueueSnackbar(e.message || "Failed to process plan change", {
        variant: "error",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      {isLoadingTeam || isLoadingProducts ? (
        <Placeholder />
      ) : (
        <Card>
          <CardHeader align="center" title="Choose a Subscription" />
          <CardContent>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="stretch"
            >
              <Grid item key={FREE_PLAN.plan}>
                <PricingCard
                  title={FREE_PLAN.title}
                  description={FREE_PLAN.description}
                  price={FREE_PLAN.price}
                  features={FREE_PLAN.features}
                  selected={team?.paymentPlan === FREE_PLAN.plan}
                  isLoading={loadingPlan === FREE_PLAN.plan}
                  onSelect={() => handleSelectPlan(FREE_PLAN.plan)}
                />
              </Grid>
              {productsData?.products?.map((p) => {
                // Determine format
                const priceString =
                  p.price === 0
                    ? "$0"
                    : p.currency.toUpperCase() === "USD"
                      ? `$${p.price}`
                      : `${p.price} ${p.currency.toUpperCase()}`;
                const planId = p.lookupKey.toUpperCase();
                return (
                  <Grid item key={planId}>
                    <PricingCard
                      title={p.name}
                      description={`For your organization`}
                      price={priceString}
                      features={p.marketing_features}
                      selected={team?.paymentPlan === planId}
                      isLoading={loadingPlan === planId}
                      onSelect={() => handleSelectPlan(planId)}
                    />
                  </Grid>
                );
              })}
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
            {isLoading
              ? "Loading..."
              : selected
                ? "Current Plan"
                : "Select Plan"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
