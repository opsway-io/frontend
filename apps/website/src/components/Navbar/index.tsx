import {
  Box,
  Button,
  Container,
  Divider,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/joy";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import {
  IoChevronDown,
  IoClose,
  IoGlobeOutline,
  IoLogoGithub,
  IoMenu,
  IoNotificationsOutline,
  IoPulseOutline,
  IoWarningOutline,
} from "react-icons/io5";

const GITHUB_URL = "https://github.com/opsway-io";
const DASHBOARD_URL = "https://my.opsway.eu";

interface ProductLink {
  title: string;
  description: string;
  hash: string;
  icon: ReactNode;
}

const productLinks: ProductLink[] = [
  {
    title: "Monitoring",
    description: "Multi-step API and uptime checks",
    hash: "monitoring",
    icon: <IoPulseOutline />,
  },
  {
    title: "Incidents & on-call",
    description: "Escalations, acknowledgements, timelines",
    hash: "incidents",
    icon: <IoWarningOutline />,
  },
  {
    title: "Status pages",
    description: "Keep customers informed automatically",
    hash: "status-pages",
    icon: <IoGlobeOutline />,
  },
  {
    title: "Alerting",
    description: "Slack, Teams, Discord, webhooks and more",
    hash: "alerting",
    icon: <IoNotificationsOutline />,
  },
];

const pageLinks: { label: string; to: string; hash?: string }[] = [
  { label: "Features", to: "/", hash: "features" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/", hash: "faq" },
  { label: "Contact", to: "/contact" },
];

const navLinkSx = {
  fontWeight: 600,
  color: "text.secondary",
  "&:hover": { color: "text.primary", bgcolor: "neutral.plainHoverBg" },
  "&.active:not([data-hash])": { color: "text.primary" },
} as const;

const ProductIcon: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <Box
    sx={{
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: "md",
      display: "grid",
      placeItems: "center",
      fontSize: 18,
      color: "primary.300",
      bgcolor: "background.level1",
      border: "1px solid",
      borderColor: "neutral.700",
    }}
  >
    {children}
  </Box>
);

const ProductMenu: FunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        color="neutral"
        endDecorator={<IoChevronDown />}
        sx={navLinkSx}
      >
        Product
      </MenuButton>
      <Menu
        placement="bottom-start"
        sx={{
          p: 1,
          minWidth: 340,
          borderRadius: "lg",
          bgcolor: "background.popup",
          borderColor: "neutral.700",
          boxShadow: "lg",
          "--ListItem-radius": "8px",
        }}
      >
        {productLinks.map((link) => (
          <MenuItem
            key={link.hash}
            onClick={() => navigate({ to: "/", hash: link.hash })}
            sx={{ gap: 1.5, py: 1, alignItems: "flex-start" }}
          >
            <ProductIcon>{link.icon}</ProductIcon>
            <Box>
              <Typography level="title-sm">{link.title}</Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {link.description}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};

const Navbar: FunctionComponent = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useRouterState({ select: (s) => s.location });
  // The mobile menu stays open only for the location it was opened on, so
  // navigating (path or hash) closes it.
  const locationKey = `${location.pathname}#${location.hash}`;
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === locationKey;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        bgcolor: "background.body",
        borderBottom: "1px solid",
        borderColor: scrolled || open ? "divider" : "transparent",
        transition: "border-color 150ms",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          spacing={4}
          useFlexGap
          sx={{ height: 72 }}
        >
          <Box
            component={Link}
            to="/"
            aria-label="opsway home"
            sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            {/* The wordmark has descenders (p, y): nudge it down so the
                letters' x-height lines up optically with the nav text. */}
            <img
              src="/img/logo.svg"
              alt="opsway"
              style={{ height: 22, transform: "translateY(3px)" }}
            />
          </Box>

          {/* Desktop navigation */}
          <Stack
            component="nav"
            aria-label="Main"
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" }, flex: 1 }}
          >
            <ProductMenu />
            {pageLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                to={link.to}
                hash={link.hash}
                data-hash={link.hash}
                variant="plain"
                color="neutral"
                sx={navLinkSx}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <IconButton
              component="a"
              href={GITHUB_URL}
              aria-label="opsway on GitHub"
              variant="plain"
              color="neutral"
              sx={{ fontSize: 20 }}
            >
              <IoLogoGithub />
            </IconButton>
            <Divider
              orientation="vertical"
              sx={{ mx: 1, height: 20, alignSelf: "center" }}
            />
            <Button
              component="a"
              href={`${DASHBOARD_URL}/login`}
              variant="plain"
              color="neutral"
              sx={navLinkSx}
            >
              Log in
            </Button>
            <Button component="a" href={`${DASHBOARD_URL}/login/register`}>
              Sign up for free
            </Button>
          </Stack>

          <IconButton
            variant="plain"
            color="neutral"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpenedAt(open ? null : locationKey)}
            sx={{ display: { xs: "inline-flex", md: "none" }, ml: "auto" }}
          >
            {open ? <IoClose size={22} /> : <IoMenu size={22} />}
          </IconButton>
        </Stack>
      </Container>

      {/* Mobile navigation */}
      {open && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            pb: 3,
            maxHeight: "calc(100vh - 72px)",
            overflowY: "auto",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              level="body-xs"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing="0.06em"
              textColor="text.tertiary"
              sx={{ px: 1, pt: 1, pb: 1 }}
            >
              Product
            </Typography>
            <Stack spacing={0.5}>
              {productLinks.map((link) => (
                <Button
                  key={link.hash}
                  component={Link}
                  to="/"
                  hash={link.hash}
                  variant="plain"
                  color="neutral"
                  startDecorator={<ProductIcon>{link.icon}</ProductIcon>}
                  sx={{
                    justifyContent: "flex-start",
                    gap: 0.5,
                    px: 1,
                    py: 1,
                    color: "text.primary",
                    fontWeight: 600,
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={0.5}>
              {pageLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.to}
                  hash={link.hash}
                  data-hash={link.hash}
                  variant="plain"
                  color="neutral"
                  size="lg"
                  sx={{ ...navLinkSx, justifyContent: "flex-start", px: 1 }}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                component="a"
                href={GITHUB_URL}
                variant="plain"
                color="neutral"
                size="lg"
                startDecorator={<IoLogoGithub />}
                sx={{ ...navLinkSx, justifyContent: "flex-start", px: 1 }}
              >
                GitHub
              </Button>
            </Stack>

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Button
                component="a"
                href={`${DASHBOARD_URL}/login/register`}
                size="lg"
              >
                Sign up for free
              </Button>
              <Button
                component="a"
                href={`${DASHBOARD_URL}/login`}
                variant="outlined"
                color="neutral"
                size="lg"
              >
                Log in
              </Button>
            </Stack>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
