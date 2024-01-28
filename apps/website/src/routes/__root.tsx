import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import Spacer from "../components/Spacer";
import Footer from "../components/Footer";

export const Route = createRootRoute({
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />

      <Spacer />

      <Outlet />

      <Spacer />

      <Footer />
    </>
  );
}
