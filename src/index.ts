import "dotenv/config";
import { allRoutes } from "./routes/index.js";
import { serve } from "@hono/node-server";

serve(allRoutes, (info) => {
  console.log("server is running on port :https:/localhost:3000 ");
});
