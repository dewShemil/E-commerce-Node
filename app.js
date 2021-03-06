require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

// Packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// DB
const connectDB = require("./db/connect");

// Routers
const authRouter = require("./Routes/authRoutes");
const userRouter = require("./Routes/userRoutes");
const productRouter = require("./Routes/productRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const orderRouter = require("./Routes/orderRoutes");

const { authMiddleware } = require("./middleware/authentication");

// Middlewares
app.use(express.static("./public"));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

// Import Middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.get("/", (req, res) => {
  res.send("E commerce api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authMiddleware, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async (req, res) => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log("Listening on Port (64 ) " + port);
    });
  } catch (error) {
    console.log("Failed to connect..");
  }
};

start();
