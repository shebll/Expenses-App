import { userQueryOption } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

// src/routes/_authenticated.tsx

const Login = () => {
  return <div className="">Login in now</div>;
};
const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) return <Login />;
  return <Outlet />;
};
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const data = await queryClient.fetchQuery(userQueryOption);
      return data;
    } catch (e) {
      console.log("e");
      return { user: null };
    }
  },
  component: Component,
});
