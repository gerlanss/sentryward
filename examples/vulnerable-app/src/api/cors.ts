import cors from "cors";

export const openCors = cors({
  origin: "*",
  credentials: true
});
