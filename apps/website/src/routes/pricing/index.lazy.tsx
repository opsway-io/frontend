import { FunctionComponent, ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { BsCheckLg } from "react-icons/bs";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet";

export const Route = createLazyFileRoute("/pricing/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Helmet>
        <title>Pricing - opsway.io</title>
        <meta
          name="keywords"
          content="pricing, plans, free, team, enterprise"
        />
      </Helmet>

      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: (t) => t.palette.success.main,
            fontWeight: 700,
            display: "inline",
            fontSize: {
              xs: 36,
              md: 48,
            },
          }}
        >
          Choose the plan{" "}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            display: "inline",
            fontWeight: 700,
            fontSize: {
              xs: 36,
              md: 48,
            },
          }}
        >
          right for your team
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 800,
            margin: "auto",
            marginTop: 2,
          }}
        >
          Whatever you need a simple monitor and status page or full enterprise
          super powers 🦸, we got you covered.
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          marginTop: 4,
        }}
      >
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
          />
        </Grid>
      </Grid>

      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ marginTop: 12, marginBottom: 2 }}
        textAlign="center"
      >
        Feature overview
      </Typography>

      <FeatureOverview />
    </>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  title,
  description,
  price,
  features,
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

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{
            marginTop: "auto",
          }}
          component="a"
          href="https://my.opsway.io/account/general"
        >
          Get started
        </Button>
      </CardContent>
    </Card>
  );
};

interface Feature {
  name: string;
  free?: boolean | string | number | ReactNode;
  team?: boolean | string | number | ReactNode;
  enterprise?: boolean | string | number | ReactNode;
}

const FeatureOverview: FunctionComponent = () => {
  const t = useTheme();

  const features: Feature[] = [
    {
      name: "Users",
      free: 10,
      team: 25,
      enterprise: "Unlimited",
    },
    {
      name: "Monitors",
      free: 5,
      team: 25,
      enterprise: "Unlimited",
    },
    {
      name: "Status pages",
      free: 5,
      team: 10,
      enterprise: "Unlimited",
    },
    {
      name: "On-call schedules",
      team: 5,
      enterprise: "Unlimited",
    },
    {
      name: "History",
      free: "1 month",
      team: "1 year",
      enterprise: "1 year",
    },
    {
      name: "Priority support",
      enterprise: "yes",
    },
    {
      name: "Custom domain",
      free: "yes",
      team: "yes",
      enterprise: "yes",
    },
    {
      name: "Custom branding",
      free: "yes",
      team: "yes",
      enterprise: "yes",
    },
    {
      name: "Data center locations",
      free: "3",
      team: "3",
      enterprise: "3",
    },
  ];

  return (
    <TableContainer>
      <Table
        sx={{
          "& td": {
            backgroundColor: t.palette.background.paper,
          },

          "& *": {
            fontSize: {
              xs: 10,
              md: 16,
            },
          },

          maxWidth: 1000,
          margin: "auto",
        }}
        size="small"
      >
        <TableHead
          sx={{
            backgroundColor: t.palette.divider,
          }}
        >
          <TableRow>
            <TableCell width={200}>Feature</TableCell>
            <TableCell align="right" width={200}>
              Free
            </TableCell>
            <TableCell align="right" width={200}>
              Team
            </TableCell>
            <TableCell align="right" width={200}>
              Enterprise
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {features.map((feature) => (
            <TableRow>
              <TableCell component="th" scope="row">
                {feature.name}
              </TableCell>
              <TableCell align="right">{feature.free}</TableCell>
              <TableCell align="right">{feature.team}</TableCell>
              <TableCell align="right">{feature.enterprise}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
