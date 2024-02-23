const sequelize = require("./db");
const models = require("./models");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandlingMiddleware");

const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use(fileUpload({}));
app.use("/api", router);

// errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    app.listen(PORT, "0.0.0.0", () => {
      console.log("http://localhost:" + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
