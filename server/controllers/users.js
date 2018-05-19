const jwt = require('jwt-simple');
const UserModel = require('../models/user');

const fetchAll = (req, res, next) => {
  UserModel.find({})
    .exec((err, users) => {
      if (err) return next(err);

      res.json(users);
    });
};

const login = (req, res) => {
  res.send({ 
    token: tokenForUser(req.user),
    newUser: req.user
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
      password
    });
    
    newUser.save(err => {
      if (err) { return next(err); }
    });
    
    res.json({
      token: tokenForUser(newUser),
      newUser
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

