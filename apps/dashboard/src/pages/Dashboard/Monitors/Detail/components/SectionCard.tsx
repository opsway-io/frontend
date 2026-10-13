import { Box, Card, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface SectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** Rendered next to the title (stacks below it on small screens). */
  headerAction?: ReactNode;
  children: ReactNode;
}

/** Card with a title and description used for the monitor detail sections. */
const SectionCard: FunctionComponent<SectionCardProps> = (props) => {
  return (
    <Card>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1}
      >
        <Box>
          <Typography level="title-md">{props.title}</Typography>
          {props.description && (
            <Typography level="body-sm" textColor="text.secondary">
              {props.description}
            </Typography>
          )}
        </Box>
        {props.headerAction}
      </Stack>
      {props.children}
    </Card>
  );
};

export default SectionCard;
