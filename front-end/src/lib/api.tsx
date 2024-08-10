import { hc } from "hono/client";
import { ApiRoutes } from "@server/index";
import { queryOptions } from "@tanstack/react-query";
import { TagType } from "@app/sharedType";

const client = hc<ApiRoutes>("/");
export const api = client.api;

// user data queries
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

// total expenses data queries
export const getTotalExpenses = async () => {
  const res = await api.expenses["total-expenses"].$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();

  return data;
};

export const totalExpensesQueryOption = queryOptions({
  queryKey: ["total-expenses"],
  queryFn: getTotalExpenses,
  staleTime: 1000 * 60 * 10,
});

// get expenses data queries
export const getExpenses = async () => {
  const res = await api.expenses.$get();
  if (!res.ok) throw new Error("Server Error");
  return res.json();
};

export const expensesQueryOption = queryOptions({
  queryKey: ["expenses"],
  queryFn: getExpenses,
  staleTime: 1000 * 60 * 10,
});

// get Tags data queries
export const getTags = async (): Promise<TagType[]> => {
  const res = await api.tags.$get();
  if (!res.ok) throw new Error("Failed to fetch tags");
  const data = await res.json();
  return data.tags;
};
export const getTagsQueryOption = queryOptions({
  queryKey: ["tags"],
  queryFn: getTags,
});
