require("dotenv").config();
require("express-async-errors");

// security
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// connect DB
const connectDB = require("./db/connect");

const express = require("express");
const app = express();

// Router
const authRouter = require("./routes/auth");

// middleware
// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());

app.get("/", (req, res) => {
  res.send("<h1>Login Backend</h1>");
});

// Routes
app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
