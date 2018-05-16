const UserModel = require('./models/user');
const UsersController = require('./controllers/users');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    // res.sendFile(__dirname + '/view/index.html');
    res.send({ message: 'secret token' });
  });

  app.post('/login', requireSignin, UsersController.login);
  app.post('/signup', UsersController.signup);
};