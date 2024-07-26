import NavBar from "@/components/NavBar/NavBar";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <NavBar />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
