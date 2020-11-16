const passport = require('passport');
const routes = require('express').Router();
const { register } = require('../service/auth');
const config = require('config');
const uiBaseUrl = config.get('ui.baseUrl');

routes.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect(`${uiBaseUrl}/signin?error=invalid`); }
    const token = user.token;
    res.redirect(`${uiBaseUrl}?token=${token}`);
  })(req, res, next);
});

routes.post('/register', async function(req, res) {
  console.log("register", req.body)
  const resp = await register(req.body.email, req.body.pass, req.body.pass2);
  if (resp.error) {
    return res.redirect(`${uiBaseUrl}/signup?error=${encodeURIComponent(resp.error)}`);;
  }
  const message = `Usuario registrado satisfactoriamente. Revisa el correo ${req.body.email} para verificar la cuenta.`;
  return res.redirect(`${uiBaseUrl}/signin?success=${encodeURIComponent(message)}`);;
});

// routes.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }),
// );

// routes.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: `${uiBaseUrl}/signin`,
//     session: false,
//   }),
//   function(req, res) {
//     const token = req.user.token;
//     res.redirect(`${uiBaseUrl}?token=${token}`);
//   },
// );

module.exports = routes;