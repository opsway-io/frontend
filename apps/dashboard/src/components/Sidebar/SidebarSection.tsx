import { Divider, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { useSidebarCollapsed } from "./sidebarContext";

interface SidebarSectionProps {
  label: string;
  children: ReactNode;
}

/**
 * A labelled group of sidebar items. Collapsed rails show a divider instead
 * of the label.
 */
const SidebarSection: FunctionComponent<SidebarSectionProps> = ({
  label,
  children,
}) => {
  const collapsed = useSidebarCollapsed();

  return (
    <>
      {collapsed ? (
        <Divider sx={{ my: 1 }} />
      ) : (
        <Typography
          level="body-xs"
          textTransform="uppercase"
          letterSpacing="0.06em"
          fontWeight={600}
          textColor="text.tertiary"
          noWrap
          sx={{ px: 1.25, pt: 1.5, pb: 0.5 }}
        >
          {label}
        </Typography>
      )}
      {children}
    </>
  );
};

export default SidebarSection;
