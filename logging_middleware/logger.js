import axios from "axios";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

export const logEvent = async (level, message, pkg = "route") => {
  try {
    await axios.post(LOG_API, {
      stack: "backend",
      level: level,
      package: pkg,
      message: message
    });
  } catch (err) {
    console.log("Logging failed:", err.message);
  }
};