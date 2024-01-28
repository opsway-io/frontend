import { Box, Button, Container, Toolbar } from "@mui/material";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <Box>
      <Container maxWidth="xl">
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
    </Box>
  );
};
export default Navbar;
