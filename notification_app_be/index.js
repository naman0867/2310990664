import express from "express";
import { logEvent } from "../logging_middleware/logger.js";

const app = express();
app.use(express.json());

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", async (req, res) => {
  await logEvent("info", "Root API called", "route");

  res.json({
    message: "Server running successfully 🚀"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});