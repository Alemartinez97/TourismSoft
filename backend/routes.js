const user = require('./routes/user');
const auth = require('./routes/auth');
const checkout = require('./routes/checkout');
const tools = require('./routes/tools');
const reserve = require('./routes/reserve');
const person = require('./routes/person');
const data = require('./routes/data');
const activity = require('./routes/activity');
const accommodation = require('./routes/accommodation');

module.exports = {
  userRoutes: user,
  authRoutes: auth,
  checkoutRoutes: checkout,
  toolsRoutes: tools,
  personRoutes: person,
  reserveRoutes: reserve,
  dataRoutes: data,
  activityRoutes: activity,
  accommodationRoutes: accommodation,
};
