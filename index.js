const cors = require("cors");

const consumerRoutes = require("./routes/consumerRoutes");

const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const AppError = require("./AppError");
const globalErrorHandler = require("./globalErrorHandler");

const scmuserRoutes = require("./routes/scmuserRoutes");
const contractRoutes = require("./routes/contractRoutes");
const batchRoutes = require("./routes/batchRoutes");
const systemRoutes = require("./routes/systemRoutes");
const cookieParser = require("cookie-parser");

// Loading environment variables
dotenv.config({ path: "config.env" });

// Configuring express app and middlewares
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static(path.join(__dirname, "public")));

// Handling API routes
app.use("/api/scmusers", scmuserRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/consumer", consumerRoutes);

// Handling errors
app.all("*", (req, res, next) =>
  next(new AppError(404, "The route you are trying to access doesn't exist"))
);
app.use(globalErrorHandler);

// Start server
app.listen(process.env.BACKEND_PORT, (err) => {
  if (err) {
    console.log(err);
    process.exit(-1);
  }
  console.log("Server listening on port", process.env.BACKEND_PORT);
});
