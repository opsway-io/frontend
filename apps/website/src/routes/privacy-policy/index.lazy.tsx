import { Container, Stack, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/privacy-policy/")({
  component: Index,
});

function Index() {
  return (
    <Container maxWidth="xl">
      <Stack spacing={2}>
        <Typography variant="h1">Privacy Policy</Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Last updated: 2023-02-11
        </Typography>
      </Stack>
    </Container>
  );
}
