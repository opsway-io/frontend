import { Card, Skeleton, Stack, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  /** Optional extra line below the value (e.g. TLS issuer). */
  caption?: ReactNode;
  /** Optional icon/indicator rendered on the right of the label. */
  indicator?: ReactNode;
  loading?: boolean;
  valueColor?: string;
}

/** Consistent stat card used on the monitor detail page. */
const StatCard: FunctionComponent<StatCardProps> = ({
  label,
  value,
  caption,
  indicator,
  loading,
  valueColor,
}) => {
  return (
    <Card sx={{ flex: 1, minWidth: 0, gap: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Typography
          level="body-xs"
          textColor="text.tertiary"
          textTransform="uppercase"
          letterSpacing="0.06em"
          fontWeight={600}
        >
          {label}
        </Typography>
        {indicator}
      </Stack>

      {loading ? (
        <Skeleton variant="text" level="h3" width={120} />
      ) : (
        <Typography
          level="h3"
          textColor={valueColor ?? "text.primary"}
          fontWeight={600}
          noWrap
        >
          {value}
        </Typography>
      )}

      {caption !== undefined &&
        (loading ? (
          <Skeleton variant="text" level="body-xs" width={160} />
        ) : (
          <Typography level="body-xs" textColor="text.secondary" noWrap>
            {caption}
          </Typography>
        ))}
    </Card>
  );
};

export default StatCard;
