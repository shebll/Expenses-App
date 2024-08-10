import { hc } from "hono/client";
import { ApiRoutes } from "@server/src/index";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");
export const api = client.api;

const getUserData = async () => {
  const res = await api.me.$get();
  if (!res.ok) throw new Error("Server Error");

  const data = await res.json();
  return data;
};
export const userQueryOption = queryOptions({
  queryKey: ["get-user-data"],
  queryFn: getUserData,
  staleTime: Infinity,
});
