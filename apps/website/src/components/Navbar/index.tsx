import {
  AppBar,
  Box,
  Button,
  Container,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  alpha,
} from "@mui/material";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "@tanstack/react-router";
import { FunctionComponent, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { MdOutlineNavigateNext } from "react-icons/md";

const Navbar = () => {
  return (
    <>
      <BigDeviceNavbar />
      <SmallDeviceNavbar />
    </>
  );
};

const BigDeviceNavbar: FunctionComponent = () => {
  return (
    <Container maxWidth="xl" sx={{ display: { xs: "none", md: "block" } }}>
      <Toolbar
        disableGutters
        sx={{
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <Box>
          <Link to="/">
            <img
              src="img/logo.svg"
              alt="logo"
              style={{ height: 24, marginRight: 32, marginBottom: -8 }}
            />
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: "100%",
            justifyContent: "flex-end",
            ".active": {
              backgroundColor: (t) => t.palette.action.selected,
              color: (t) => t.palette.success.main,
            },
          }}
        >
          <Button
            sx={{
              fontSize: 14,
              fontWeight: 400,
            }}
            component={Link}
            to="/pricing"
            size="large"
          >
            Pricing
          </Button>
          {/* <Button
                      sx={{
                          fontSize: 14,
                          fontWeight: 400,
                      }}
                      component={Link}
                      to="/docs"
                      size="large"
                  >
                      Documentation
                  </Button> */}
          <Button
            sx={{
              fontSize: 14,
              fontWeight: 400,
            }}
            component={"a"}
            href="https://github.com/opsway-io"
            size="large"
          >
            GitHub
          </Button>
          <Button
            sx={{
              fontSize: 14,
              fontWeight: 400,
            }}
            variant="outlined"
            component={"a"}
            href="https://my.opsway.io"
            color="success"
            endIcon={<IoIosArrowForward />}
            size="large"
          >
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </Container>
  );
};

const SmallDeviceNavbar: FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [window.location.pathname]);

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "flex", md: "none" },
        background: (t) => alpha(t.palette.background.default, 0.5),
        backdropFilter: "blur(20px)",
      }}
      className="glass"
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: 1,
        }}
      >
        <Link to="/">
          <img src="img/logo.svg" alt="logo" style={{ height: 18 }} />
        </Link>

        <IconButton
          size="large"
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          <IoMenu />
        </IconButton>
      </Toolbar>

      <Fade in={open} unmountOnExit>
        <List sx={{}} dense>
          <ListItem>
            <ListItemButton component={Link} to="/pricing">
              <ListItemText primary="Pricing" />

              <ListItemIcon
                sx={{
                  minWidth: "auto",
                }}
              >
                <MdOutlineNavigateNext />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={"a"} href="https://github.com/opsway-io">
              <ListItemText primary="GitHub" />

              <ListItemIcon
                sx={{
                  minWidth: "auto",
                }}
              >
                <MdOutlineNavigateNext />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              component={"a"}
              href="https://my.opsway.io"
              color="success"
            >
              <ListItemText primary="Dashboard" />

              <ListItemIcon
                sx={{
                  minWidth: "auto",
                }}
              >
                <MdOutlineNavigateNext />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Fade>
    </AppBar>
  );
};

export default Navbar;
