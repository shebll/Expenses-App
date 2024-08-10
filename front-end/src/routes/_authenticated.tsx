import { userQueryOption } from "@/lib/api";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

// src/routes/_authenticated.tsx

const Component = () => {
  const { user } = Route.useRouteContext();
  if (user == null) {
    console.log(user);
    Navigate({ to: "/login" });
  }
  return <Outlet />;
};
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOption);
      return data;
    } catch (e) {
      return { user: null };
    }
  },
  component: Component,
});
