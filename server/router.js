const UsersController = require('./controllers/users');
const OpenUsersController = require('./controllers/openUsers');
const MessagesController = require('./controllers/messages');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  // app.get('/', requireAuth, (req, res) => {
  //   // res.sendFile(__dirname + '/view/index.html');
  //   res.send({ message: 'secret token' });
  // });

  app.post('/send', MessagesController.send);
  app.get('/messages', MessagesController.fetch);
  
  app.get('/users', OpenUsersController.fetchAll);
  app.post('/openchat', OpenUsersController.login);
  app.post('/removeuser', OpenUsersController.removeUser);
  
  app.post('/login', requireSignin, UsersController.login);
  app.post('/signup', UsersController.signup);
};
