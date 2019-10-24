const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const series = require("./routes/series");
const users = require("./routes/users");
const auth = require("./routes/auth");

const User = require("./models/user");

const port = process.env.PORT || 3000;
const mongo = process.env.MONGODB || "mongodb://localhost/minhas-series-rest";

const app = express();

app.use(bodyParser.json({ extended: true }));

const createInitialUsers = async () => {
  const total = await User.countDocuments({});
  if (total === 0) {
    const admin = new User({
      username: "admin",
      password: "1234",
      roles: ["restrict", "admin"]
    });
    await admin.save();

    const user = new User({
      username: "user",
      password: "1234",
      roles: ["restrict"]
    });
    await user.save();
  }
};

app.use("/series", series);
app.use("/users", users);
app.use("/auth", auth);

mongoose
  .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    createInitialUsers();
    app.listen(port, () => console.log(`Listening on port ${3000}`));
  })
  .catch(e => console.log("can't initialize the server"));
