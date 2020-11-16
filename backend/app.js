const bodyParser = require("body-parser");
const { resolve } = require("path");
// const cookieSession = require("cookie-session");

//
const config = require("config");
const express = require("express");
const app = express();
const cors = require("cors");
const {
  userRoutes,
  authRoutes,
  checkoutRoutes,
  toolsRoutes,
  reserveRoutes,
  dataRoutes,
  activityRoutes,
  accommodationRoutes,
} = require("./routes");
const { connect, knex } = require("./db");
const morgan = require("morgan");
const { getUserId } = require("./request");
const global = require("./global");
const passport = require("passport");
require("./passport");
app.use(express.static(resolve(__dirname, "uploads")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: "text/*" }));
app.use(bodyParser.json());
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] - :req[AUTH_USER_ID] :req[AUTH_RAND] :req[AUTH_TOKEN]"
  )
);
// app.use(
//   cookieSession({
//     name: "tuto-session",
//     keys: ["key1", "key2"],
//   })
// );
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(function (req, res, next) {
  req.userId = getUserId(req);
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/tools", toolsRoutes);
app.use("/reserve", reserveRoutes);
app.use("/data", dataRoutes);
app.use("/activity", activityRoutes);
app.use("/accommodation", accommodationRoutes);
app.get("/", (req, res) => res.send("Example Home page!"));
app.get("/failed", (req, res) => res.send("You Failed to log in!"));

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get("/good", isLoggedIn, (req, res) =>
  res.send(`Welcome mr ${req.user.displayName}!`)
);

// Auth Routes
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    // failureRedirect: "/api/auth",
    session: false,
  }),
  function (req, res, next) {
    // Successful authentication, redirect home.
    const token = req.user;
    res.status(200).json({ token });
  }
);
app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});
const port = config.get("server.port") || 3003;

const init = async () => {
  await connect();
  // preload data
  global.set("ages", await knex("age").select("*"));
  global.set("categories", await knex("category").select("*"));
  global.set("orderStatuses", await knex("order_status").select("*"));
  global.set("variantTypes", await knex("variant_type").select("*"));

  // start app
  try {
    app.listen(port, function () {
      console.log(`Server listening on port ${port}!`);
    });
  } catch (err) {
    console.log("Cannot connect to db", err);
  }
};

init();

module.exports = app;
