import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/logs")({
  component: () => <p className="">app logs</p>,
});
