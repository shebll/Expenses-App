import NavBar from "@/components/NavBar/NavBar";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <NavBar />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
