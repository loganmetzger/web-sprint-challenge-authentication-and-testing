const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model');
const secrets = require('./secrets')


router.post("/register", (req, res) => {
  let user = req.body;
  const rounds = process.env.HASH_ROUNDS || 4;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash;
  Users.add(user)
    .then(user => {
     res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "unable to create user" });
    });
})

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)

        res.status(200).json({ message: `${user.username}, you made it`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  };
  const secret = secrets.jwtSecret;

  const options = {
    expiresIn: '1d'
  }
  
  return jwt.sign(payload, secret, options)
}
module.exports = router;