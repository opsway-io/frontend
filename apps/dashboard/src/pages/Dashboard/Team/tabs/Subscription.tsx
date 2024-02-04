import { FunctionComponent } from "react";
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
import { useCurrentTeam } from "../../../../hooks/team.query";
import * as TeamsAPI from "../../../../api/endpoints/teams";

const TeamPlanTabView: FunctionComponent = () => {
  const { data: team, isLoading: isLoadingTeam } = useCurrentTeam();

  return (
    <>
      <Card>
        <CardContent>
          {isLoadingTeam ? (
            <Placeholder />
          ) : (
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <PricingCard
                  title="Free"
                  description="For small teams"
                  price="0£"
                  features={[
                    "Up to 10 users",
                    "Up to 5 monitors",
                    "Up to 5 status pages",
                    "1 month of history",
                  ]}
                  selected={team?.paymentPlan === "FREE"}
                  teamId={team?.id!}
                  priceLookupKey={""}
                />
              </Grid>
              <Grid item>
                <PricingCard
                  title="Team"
                  description="For medium teams"
                  price="20£"
                  features={[
                    "Up to 25 users",
                    "Up to 25 monitors",
                    "Up to 10 status pages",
                    "Up to 5 on-call schedules",
                    "1 year of history",
                  ]}
                  selected={team?.paymentPlan === "TEAM"}
                  teamId={team?.id!}
                  priceLookupKey={"TEAM"}
                />
              </Grid>
              <Grid item>
                <PricingCard
                  title="Enterprise"
                  description="For large teams"
                  price="100£"
                  features={[
                    "Unlimited users",
                    "Unlimited monitors",
                    "Unlimited status pages",
                    "Unlimited On-call schedules",
                    "1 year of history",
                    "Priority support",
                  ]}
                  selected={team?.paymentPlan === "ENTERPRISE"}
                  teamId={team?.id!}
                  priceLookupKey={"ENTERPRISE"}
                />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
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
  teamId: number;
  priceLookupKey: string;
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  selected,
  teamId,
  priceLookupKey,
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
    >
      <Box
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h4" color="text.primary">
          {title}
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

        {selected ? (
          <Button
            disabled
            variant="contained"
            color="success"
            fullWidth
            sx={{
              marginTop: "auto",
            }}
            component="a"
          >
            Selected
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{
              marginTop: "auto",
            }}
            component="a"
            onClick={() =>
              TeamsAPI.postCreateCheckoutSession(teamId, priceLookupKey)
            }
          >
            Upgrade
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
