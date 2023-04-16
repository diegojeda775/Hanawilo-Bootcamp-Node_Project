const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const category = require("./routes/category");
const item = require("./routes/item");
const user = require("./routes/user");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(bodyParser.json());

app.use(fileUpload());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(helmet());
app.use(logger);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(
  cors({
    origin: "*",
  })
);

app.use("/category", category);
app.use("/item", item);
app.use("/user", user);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
//wagMew-qikfe5-kywrod
