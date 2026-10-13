import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { BsCheckLg } from "react-icons/bs";
import { BillingPlan } from "../billingPlans";

interface PricingCardProps {
  plan: BillingPlan;
  selected: boolean;
  isLoading: boolean;
  disabled: boolean;
  onSelect: () => void;
}

const PricingCard: FunctionComponent<PricingCardProps> = ({
  plan,
  selected,
  isLoading,
  disabled,
  onSelect,
}) => (
  <Card
    sx={{
      p: 2.5,
      gap: 2,
      height: "100%",
      position: "relative",
      transition: "border-color 150ms",
      ...(selected && {
        borderColor: "success.500",
        boxShadow: "0 0 0 1px var(--joy-palette-success-500)",
        bgcolor: "rgba(var(--joy-palette-success-mainChannel) / 0.04)",
      }),
    }}
  >
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography level="title-lg">{plan.title}</Typography>
        {selected && (
          <Chip variant="soft" color="success">
            Current plan
          </Chip>
        )}
      </Stack>

      <Typography level="body-sm" textColor="text.secondary">
        {plan.description}
      </Typography>
    </Box>

    <Stack direction="row" alignItems="baseline" gap={0.75}>
      <Typography level="h2" fontWeight={700} letterSpacing="-0.02em">
        {plan.price}
      </Typography>
      <Typography level="body-sm" textColor="text.tertiary">
        / month
      </Typography>
    </Stack>

    <Divider />

    <List size="sm" sx={{ "--ListItem-paddingX": 0, flex: 1 }}>
      {plan.features.map((feature) => (
        <ListItem key={feature}>
          <ListItemDecorator sx={{ color: "success.500", minInlineSize: 28 }}>
            <BsCheckLg />
          </ListItemDecorator>
          <Typography level="body-sm" textColor="text.primary">
            {feature}
          </Typography>
        </ListItem>
      ))}
    </List>

    <Button
      variant={selected ? "soft" : "solid"}
      color={selected ? "success" : "primary"}
      fullWidth
      onClick={onSelect}
      disabled={selected || disabled}
      loading={isLoading}
    >
      {selected ? "Current plan" : "Select plan"}
    </Button>
  </Card>
);

export default PricingCard;
