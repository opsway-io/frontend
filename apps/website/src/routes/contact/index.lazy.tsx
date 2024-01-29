import { Container, Stack, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/contact/")({
  component: Index,
});

function Index() {
  return (
    <Container maxWidth="xl">
      <Stack spacing={2}>
        <Typography variant="h1">Contact</Typography>
      </Stack>
    </Container>
  );
}
