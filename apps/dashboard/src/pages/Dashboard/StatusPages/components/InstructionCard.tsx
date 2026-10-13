import { Box, Card, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface InstructionCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

/** Soft card with an icon + title used for setup instructions. */
const InstructionCard: FunctionComponent<InstructionCardProps> = ({
  icon,
  title,
  children,
}) => (
  <Card variant="soft" sx={{ bgcolor: "background.level1", gap: 1.5 }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ display: "flex", color: "text.secondary" }}>{icon}</Box>
      <Typography level="title-sm">{title}</Typography>
    </Stack>
    {children}
  </Card>
);

export default InstructionCard;
