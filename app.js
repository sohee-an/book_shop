const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.finById("632b0186e15d1b5f0465592f")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://soso:12345@cluster0.uksbhqp.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((res) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "so",
          email: "test@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
        app.listen(3000);
      }
    });
  })

  .catch((err) => {
    console.log(err);
  });
