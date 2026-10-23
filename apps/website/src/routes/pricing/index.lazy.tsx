import { FunctionComponent, ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
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
        <title>Pricing - opsway.eu</title>
        <meta
          name="keywords"
          content="pricing, plans, free, team, enterprise"
        />
      </Helmet>

      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", maxWidth: 760, mx: "auto" }}>
          <Typography level="body-md" fontWeight={600} textColor="primary.300">
            Pricing
          </Typography>
          <Typography
            level="h1"
            sx={{
              mt: 1.5,
              fontSize: { xs: "2.25rem", md: "3rem" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Choose the plan right for your team
          </Typography>

          <Typography
            textColor="text.secondary"
            sx={{ mt: 2.5, fontSize: { xs: "1.125rem", md: "1.25rem" } }}
          >
            Whatever you need a simple monitor and status page or full
            enterprise super powers 🦸, we got you covered.
          </Typography>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            display: "grid",
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            alignItems: "stretch",
            maxWidth: { xs: 440, md: "none" },
            mx: "auto",
          }}
        >
          <PricingCard
            title="Free"
            description="For small teams"
            price="0£"
            features={[
              "Up to 10 users",
              "Up to 5 monitors & 1 status page",
              "1 GB / month Log-Search",
              "BYOA MCP Gateway access",
              "3 Managed AI investigations",
            ]}
          />
          <PricingCard
            title="Team"
            description="For medium teams"
            price="20£"
            highlighted
            features={[
              "Up to 25 users",
              "Up to 25 monitors & 10 status pages",
              "50 GB / month Log-Search",
              "Unified MCP Gateway & BYOA webhooks",
              "25 Managed AI investigations / mo",
              "1-Click Automated Remediation",
            ]}
          />
          <PricingCard
            title="Enterprise"
            description="For large teams"
            price="100£"
            features={[
              "Unlimited users & monitors",
              "Unlimited status pages",
              "Custom Log-Search retention",
              "Pantomath Code & Infra GraphRAG",
              "Autonomous Auto-Remediation",
              "Priority 24/7 support",
            ]}
          />
        </Box>

        <Typography
          level="h2"
          textAlign="center"
          sx={{
            mt: { xs: 10, md: 12 },
            mb: 4,
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Feature overview
        </Typography>

        <FeatureOverview />
      </Container>
    </>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  highlighted,
}) => {
  return (
    <Card
      sx={{
        p: { xs: 3, md: 4 },
        gap: 3,
        borderRadius: "xl",
        ...(highlighted && {
          borderColor: "primary.600",
          outline: "1px solid",
          outlineColor: "primary.600",
        }),
      }}
    >
      <Stack spacing={0.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography level="title-lg">{title}</Typography>
          {highlighted && (
            <Chip color="primary" variant="soft">
              Popular
            </Chip>
          )}
        </Stack>
        <Typography level="body-sm" textColor="text.secondary">
          {description}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography
          sx={{
            fontSize: "2.5rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {price}
        </Typography>
        <Typography level="body-md" textColor="text.tertiary">
          / month
        </Typography>
      </Stack>

      <Button
        component="a"
        href="https://my.opsway.eu/account/general"
        size="md"
        variant={highlighted ? "solid" : "outlined"}
        color={highlighted ? "primary" : "neutral"}
      >
        Get started
      </Button>

      <Divider />

      <List
        size="sm"
        sx={{
          "--ListItem-paddingX": "0px",
          "--ListItemDecorator-size": "28px",
          flex: 1,
        }}
      >
        {features.map((feature) => (
          <ListItem key={feature}>
            <ListItemDecorator sx={{ color: "primary.400" }}>
              <BsCheckLg />
            </ListItemDecorator>
            <Typography level="body-sm" textColor="text.secondary">
              {feature}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

interface Feature {
  name: string;
  free?: boolean | string | number | ReactNode;
  team?: boolean | string | number | ReactNode;
  enterprise?: boolean | string | number | ReactNode;
}

const renderValue = (value: Feature["free"]): ReactNode => {
  if (value === undefined || value === null || value === false) {
    return (
      <Typography component="span" textColor="text.tertiary">
        —
      </Typography>
    );
  }

  if (value === "yes" || value === true) {
    return (
      <Box
        component="span"
        sx={{
          color: "primary.400",
          display: "inline-flex",
          verticalAlign: "middle",
        }}
      >
        <BsCheckLg title="yes" />
      </Box>
    );
  }

  return value as ReactNode;
};

const FeatureOverview: FunctionComponent = () => {
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
    <Sheet
      variant="outlined"
      sx={{
        maxWidth: 1000,
        mx: "auto",
        borderRadius: "lg",
        overflow: "auto",
      }}
    >
      <Table
        size="md"
        hoverRow
        sx={{
          minWidth: 440,
          "--TableCell-paddingX": { xs: "12px", md: "20px" },
          "--TableCell-paddingY": "12px",
          "& th, & td": { fontSize: { xs: "sm", md: "md" } },
          "& thead th": { bgcolor: "background.level1" },
          "& thead th:not(:first-of-type), & tbody td": { textAlign: "right" },
          "& tbody th": { fontWeight: 500, color: "text.primary" },
          "& tbody td": { color: "text.secondary" },
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "34%" }}>Feature</th>
            <th>Free</th>
            <th>Team</th>
            <th>Enterprise</th>
          </tr>
        </thead>

        <tbody>
          {features.map((feature) => (
            <tr key={feature.name}>
              <th scope="row">{feature.name}</th>
              <td>{renderValue(feature.free)}</td>
              <td>{renderValue(feature.team)}</td>
              <td>{renderValue(feature.enterprise)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};
