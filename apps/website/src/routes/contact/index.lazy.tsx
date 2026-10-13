import { Container, Typography } from "@mui/joy";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet";

export const Route = createLazyFileRoute("/contact/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Helmet>
        <title>Contact - opsway.eu</title>
        <meta name="keywords" content="contact,support" />
      </Helmet>

      <Container maxWidth="md" sx={{ pt: { xs: 8, md: 12 } }}>
        <Typography
          level="h1"
          sx={{
            maxWidth: 760,
            mx: "auto",
            fontSize: { xs: "2rem", md: "2.5rem" },
            letterSpacing: "-0.02em",
          }}
        >
          Contact
        </Typography>
      </Container>
    </>
  );
}
