import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/logs")({
  component: () => <p className="">app logs</p>,
});
