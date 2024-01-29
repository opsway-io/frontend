import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  darken,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { FunctionComponent } from "react";

const Footer: FunctionComponent = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        flex: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: (t) => darken(t.palette.background.default, 0.1),
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            paddingTop: 8,
            paddingBottom: 8,
            opacity: 0.75,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6">Open source</Typography>
              <Typography variant="body1">
                opsway is an open source project. You can find the source code
                on <Link href="https://github.com/opsway-io">GitHub</Link>.
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6">Resources</Typography>
              <Typography
                variant="body1"
                component={Link}
                to="/terms-of-service"
              >
                Terms of Service
              </Typography>
              <br />
              <Typography variant="body1" component={Link} to="/privacy-policy">
                Privacy Policy
              </Typography>
              <br />
              <Typography variant="body1" component={Link} to="/gdpr">
                GDPR
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6">Company</Typography>
              <Typography variant="body1" component={Link} to="/contact">
                Contact
              </Typography>
              <br />
              <Typography variant="body1" component={Link}>
                Blog
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="h6">Community</Typography>
              <Typography
                variant="body1"
                component={Link}
                href="https://github.com/opsway-io"
              >
                GitHub
              </Typography>
            </Grid>
          </Grid>

          <Divider
            sx={{
              opacity: 0.1,
              marginTop: 4,
              marginBottom: 4,
            }}
          />

          <Typography
            variant="body1"
            sx={{
              opacity: 0.5,
            }}
          >
            Copyright © {year} opsway. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
