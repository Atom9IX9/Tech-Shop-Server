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
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

// errors
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 3030;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true, alter: true });
    app.listen(PORT, () => {
      console.log("http://localhost:" + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
