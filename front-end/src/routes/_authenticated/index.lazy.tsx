import { createLazyFileRoute } from "@tanstack/react-router";
import AppComponent from "@/components/AppComponent/AppComponent";

export const Route = createLazyFileRoute("/_authenticated/")({
  component: AppComponent,
});
