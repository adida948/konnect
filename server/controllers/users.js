const jwt = require('jwt-simple');
const MessageModel = require('../models/message');
const UserModel = require('../models/user');

const fetchAll = (req, res, next) => {
  UserModel.find({})
    .exec((err, users) => {
      if (err) return next(err);

      res.json(users);
    });
};

const login = (req, res) => {
  const { username, password } = req.body;
  
  UserModel.update({ username }, {onlineStatus: true}, err => {    
    if (err) {
      return console.log(`updating user's book mark failed: ${err}`);
    }

    UserModel.findOne({ username}, (err, updatedUser) => {
      if (updatedUser.bookMark) {
        MessageModel.find({}, (err, messages) => {
          if (err) {
            return  console.log(`fetching all msgs in login failed: ${err}`);
          }
          
          let tracker = messages.length - 1;
          const missedMsg = [];
          const { bookMark, username } = updatedUser;
          
          if (tracker > 0) {
            while (messages[tracker]._id != bookMark && messages[tracker].username != username) {
              missedMsg.unshift(messages[tracker]);
              tracker--;
            }
            
            res.send({ 
              token: tokenForUser(updatedUser),
              newUser: updatedUser,
              missedMsg
            });
          }
        });
      } else {
        res.send({
          token: tokenForUser({ username, password }),
          newUser: { username, password },
          missedMsg: []
        })
      }
    })
  });
}

const signup = (req, res, next) => {
  const { username, password, passwordConfirmation } = req.body;

  if (!username) {
    return res.send({ error: 'hey, enter something!' });
  }
  
  if (username.length < 3) {
    return res.send({ error: '3 characters minimum' });
  }

  if (username.length > 15 ) {
    return res.send({ error: '15 characters max' });
  }
  if (password.length > 15 ) {
    return res.send({ error: 'password has exceeded the character limit' });
  }
  if (passwordConfirmation.length > 15 ) {
    return res.send({ error: 'password has exceeded the character limit' });
  }
  
  if (!password) {
    return res.send({ error: 'password can\'t be blank' });
  }
  
  if (!passwordConfirmation) {
    return res.send({ error: 'please confirm your password' });
  }
  
  if (password != passwordConfirmation) {
    return res.send({ error: 'passwords do not match' });
  }
  
  UserModel.findOne({ username }, (err, user) => {
    if (err) { return next(err); }
    
    if (user) { return res.send({ error: `${username} is already taken!` }); }
    
    const newUser = new UserModel({
      username,
      password,
      bookMark: '',
      onlineStatus: true
    });
    
    newUser.save(err => {
      if (err) { return next(err); }
    });
    
    res.json({
      token: tokenForUser(newUser),
      missedMsg: [],
      newUser,
    });
  });
}

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, 'my secret jwt');
}

module.exports = {
  fetchAll,
  login,
  signup
};

