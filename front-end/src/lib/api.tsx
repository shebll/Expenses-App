import { hc } from "hono/client";
import { apiRoutesType } from "@server/index";

const client = hc<apiRoutesType>("/", {
  headers: {
    Authorization: "Bearer TOKEN",
  },
});
export const api = client.api;
