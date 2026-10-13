import { Box, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FunctionComponent, ReactNode } from "react";
import { IoCheckmark } from "react-icons/io5";

export const sectionSx = { py: { xs: 8, md: 12 } } as const;

export const SectionHeading: FunctionComponent<{
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}> = ({ eyebrow, title, description, align = "center" }) => (
  <Stack
    spacing={1.5}
    sx={{
      textAlign: align,
      alignItems: align === "center" ? "center" : "flex-start",
      mb: { xs: 6, md: 8 },
    }}
  >
    <Typography level="body-md" fontWeight={600} textColor="primary.300">
      {eyebrow}
    </Typography>
    <Typography
      level="h2"
      sx={{
        fontSize: { xs: "1.875rem", md: "2.25rem" },
        fontWeight: 600,
        letterSpacing: "-0.02em",
        maxWidth: 760,
      }}
    >
      {title}
    </Typography>
    {description && (
      <Typography
        textColor="text.secondary"
        sx={{ fontSize: { xs: "1.0625rem", md: "1.25rem" }, maxWidth: 720 }}
      >
        {description}
      </Typography>
    )}
  </Stack>
);

export const IconTile: FunctionComponent<{
  children: ReactNode;
  size?: number;
  sx?: SxProps;
}> = ({ children, size = 48, sx }) => (
  <Box
    sx={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "md",
      display: "grid",
      placeItems: "center",
      fontSize: size * 0.45,
      color: "text.primary",
      bgcolor: "background.level1",
      border: "1px solid",
      borderColor: "neutral.700",
      "& img": { width: size / 2, height: size / 2, objectFit: "contain" },
      ...sx,
    }}
  >
    {children}
  </Box>
);

export const CheckList: FunctionComponent<{ items: string[] }> = ({
  items,
}) => (
  <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", m: 0, p: 0 }}>
    {items.map((item) => (
      <Stack
        key={item}
        component="li"
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
      >
        <Box
          sx={{
            mt: "2px",
            width: 22,
            height: 22,
            flexShrink: 0,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: 13,
            color: "primary.300",
            bgcolor: "primary.softBg",
          }}
        >
          <IoCheckmark />
        </Box>
        <Typography level="body-md" textColor="text.secondary">
          {item}
        </Typography>
      </Stack>
    ))}
  </Stack>
);

/** Framed surface that hosts the illustrative feature visuals. */
export const VisualFrame: FunctionComponent<{
  children: ReactNode;
  sx?: SxProps;
}> = ({ children, sx }) => (
  <Box
    sx={{
      position: "relative",
      p: { xs: 2, sm: 3, md: 4 },
      borderRadius: "xl",
      bgcolor: "background.level1",
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
      ...sx,
    }}
  >
    {children}
  </Box>
);

/** Small panel used inside visuals, styled like a card. */
export const Panel: FunctionComponent<{
  children: ReactNode;
  sx?: SxProps;
}> = ({ children, sx }) => (
  <Box
    sx={{
      borderRadius: "lg",
      bgcolor: "background.body",
      border: "1px solid",
      borderColor: "neutral.700",
      ...sx,
    }}
  >
    {children}
  </Box>
);

type Status = "up" | "degraded" | "down";

const statusColor: Record<Status, string> = {
  up: "primary.500",
  degraded: "warning.400",
  down: "danger.400",
};

export const StatusDot: FunctionComponent<{
  status?: Status;
  size?: number;
}> = ({ status = "up", size = 8 }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: "50%",
      bgcolor: statusColor[status],
    }}
  />
);

/**
 * Row of daily uptime bars. `incidents` maps a bar index to its status;
 * every other bar is "up". Deterministic so it renders identically each time.
 */
export const UptimeBars: FunctionComponent<{
  count?: number;
  incidents?: Partial<Record<number, Status>>;
  height?: number;
}> = ({ count = 45, incidents = {}, height = 28 }) => (
  <Box
    aria-hidden
    sx={{
      display: "grid",
      gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
      gap: "3px",
      height,
    }}
  >
    {Array.from({ length: count }, (_, i) => (
      <Box
        key={i}
        sx={{
          borderRadius: "2px",
          bgcolor: statusColor[incidents[i] ?? "up"],
          opacity: incidents[i] ? 1 : 0.85,
        }}
      />
    ))}
  </Box>
);
