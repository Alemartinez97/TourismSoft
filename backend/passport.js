const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { authenticate } = require("./service/auth");
const config = require("config");
const { knex } = require("./db");
const serverBaseUrl = config.get("server.baseUrl");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "706833294096-9tk8lu767427n3q3oohjfsdckcfafb22.apps.googleusercontent.com",
      clientSecret: "Xu3EQyX3srJjbikcB8FzgBrJ",
      callbackURL: "http://localhost:3003/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("done  ",done)
      const existingUser = await knex("user")
        .where({ "user.id_google": profile.id })
        .select("*").first();
        console.log("el usuario",existingUser)
        if(existingUser)
        { console.log("el usuario ya existe")
          return done(null, existingUser);
        }
      const userData = {
        email: profile.emails[0].value,
        id: profile.id,
        token: accessToken,
      };
      await knex("user").insert({
        id_google: userData.id,
        email: userData.email,
        token: userData.token
      });
      done(null, userData);
    }
  )
);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pass",
    },
    async function (email, password, done) {
      const user = await authenticate(email, password);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: "Incorrect credentials" });
    }
  )
);