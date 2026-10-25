import {
  Box,
  Dropdown,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { FunctionComponent } from "react";
import { IoAppsOutline, IoPulseOutline, IoHomeOutline } from "react-icons/io5";
import { PiTerminalWindowBold, PiSparkleFill } from "react-icons/pi";
import { MdOutlineCreditCard } from "react-icons/md";

interface AppSwitcherProps {
  currentApp?: "monitoring" | "logs" | "hub" | "agents" | "billing";
}

const AppSwitcher: FunctionComponent<AppSwitcherProps> = ({ currentApp = "monitoring" }) => {
  const apps = [
    {
      id: "hub",
      name: "Opsway Hub",
      desc: "Platform Overview & Administration",
      icon: <IoAppsOutline size={20} color="#6ba0c2" />,
      url: "https://my.opsway.eu",
      isInternal: false,
    },
    {
      id: "agents",
      name: "Autonomous Agents",
      desc: "AI SRE, Incident RCA & MCP Gateway",
      icon: <PiSparkleFill size={20} color="#A871B7" />,
      url: "https://my.opsway.eu/agents",
      isInternal: false,
    },
    {
      id: "monitoring",
      name: "Monitoring",
      desc: "Uptime, Probes, Incidents & Status Pages",
      icon: <IoPulseOutline size={20} color="#79ab5d" />,
      url: "https://monitoring.opsway.eu",
      isInternal: false,
    },
    {
      id: "logs",
      name: "Log Search",
      desc: "Semantic & SQL Log Explorer",
      icon: <PiTerminalWindowBold size={20} color="#5185a5" />,
      url: "https://logs.opsway.eu",
      isInternal: false,
    },
    {
      id: "website",
      name: "Opsway Suite Home",
      desc: "Umbrella Platform Portal",
      icon: <IoHomeOutline size={20} color="#f4ac45" />,
      url: "https://opsway.eu",
      isInternal: false,
    },
    {
      id: "billing",
      name: "Suite Billing",
      desc: "Manage Modular Products",
      icon: <MdOutlineCreditCard size={20} color="#d5d9e0" />,
      url: "/settings/billing",
      isInternal: true,
    },
  ];

  return (
    <Dropdown>
      <Tooltip title="Opsway Product Suite" placement="bottom">
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            borderRadius: "sm",
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "background.level2" },
          }}
        >
          <IoAppsOutline size={20} />
        </IconButton>
      </Tooltip>

      <Menu
        placement="bottom-start"
        size="sm"
        sx={{
          minWidth: 280,
          p: 1.5,
          bgcolor: "background.popup",
          borderColor: "divider",
          boxShadow: "lg",
        }}
      >
        <Typography
          level="body-xs"
          textTransform="uppercase"
          letterSpacing="0.06em"
          fontWeight={600}
          textColor="text.tertiary"
          sx={{ px: 1, pb: 1 }}
        >
          Opsway Umbrella Suite
        </Typography>

        <Stack spacing={0.75}>
          {apps.map((app) => (
            <MenuItem
              key={app.id}
              component="a"
              href={app.url}
              selected={currentApp === app.id}
              sx={{
                p: 1,
                borderRadius: "md",
                alignItems: "flex-start",
                gap: 1.5,
                "&:hover": { bgcolor: "background.level2" },
              }}
            >
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: "sm",
                  bgcolor: "background.level1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {app.icon}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography level="title-sm" sx={{ lineHeight: 1.2 }}>
                  {app.name}
                </Typography>
                <Typography level="body-xs" textColor="text.tertiary" noWrap>
                  {app.desc}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </Dropdown>
  );
};

export default AppSwitcher;
