// import Analytics from "@/components/Analytics/Analytics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: () => <p>Coming soon</p>,
  // component: Analytics,
});
