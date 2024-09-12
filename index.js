const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require('./src/models').sequelize;
const app = express();
dotenv.config();
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch(err => console.log(err));