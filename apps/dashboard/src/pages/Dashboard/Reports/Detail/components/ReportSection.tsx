import { Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  children: ReactNode;
}

const ReportSection: FunctionComponent<ReportSectionProps> = ({
  title,
  children,
}) => (
  <Stack spacing={1.5}>
    <Typography level="title-lg">{title}</Typography>
    {children}
  </Stack>
);

export default ReportSection;
