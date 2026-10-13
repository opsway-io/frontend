import { Card, ColorPaletteProp, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  color: ColorPaletteProp;
}

const StatCard: FunctionComponent<StatCardProps> = ({
  label,
  value,
  color,
}) => (
  <Card sx={{ gap: 0.5 }}>
    <Typography level="body-sm" textColor="text.secondary">
      {label}
    </Typography>
    <Typography level="h3" color={color}>
      {value}
    </Typography>
  </Card>
);

export default StatCard;
