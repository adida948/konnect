const OpenUserModel = require('../models/openUser');

const login = (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.send({ error: 'hey, enter something!' });
  }

  OpenUserModel.findOne({ username }, (err, user) => {
    if (err) return next(err);

    if (user) {
      return res.send({ error: `${username} is taken!` });
    }

    const newUser = new OpenUserModel({ username });

    newUser.save(err => {
      if (err) return next(err);
    });

    res.json({ newUser, auth: true });
  });
};

module.exports = {
  login
};
