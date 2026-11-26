import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/pantomath/")({
  component: () => <Navigate to="/agent-context" replace />,
});
