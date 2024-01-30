import { Container, Stack, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet";

export const Route = createLazyFileRoute("/contact/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Helmet>
        <title>Contact - opsway.io</title>
        <meta name="keywords" content="contact,support" />
      </Helmet>

      <Container maxWidth="xl">
        <Stack spacing={2}>
          <Typography variant="h1">Contact</Typography>
        </Stack>
      </Container>
    </>
  );
}
