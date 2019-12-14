const router = require('express').Router();
const Users = require("./auth-model.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets');

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;

  if (!user.username || !user.password) {
    res.status(404).json({ message: "Please enter username and password" });
  }

  if (user.username && user.password) {
  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = genToken(saved)
      res.status(201).json({created_new_user: saved});
    })
    .catch(err => {
      res.status(500).json({message: "Error crating user", err});
    })
  } else {
    res.status(400).json({message: "You shall not pass"})
  }
});

router.post('/login', (req, res) => {
  // implement login

  console.log(req.body);
  let { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: "Invalid username or password" });
  }

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
          const token = genToken(user);

        res.status(201).json({ message: "Logged in", token: token});
      } else {
        res.status(404).json({ message: "Cannot find username or password!" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

function genToken(user) {

  const payload = {
    userId: user.id,
    username: user.username
  };

  const options = { expiresIn: "1hr" };
  const token = jwt.sign(payload, secret.jwtSecret, options);

  return token;


}

// function authorize(req, res, next) {
//   const username = req.body["username"];
//   const password = req.body["password"];

//   if (!username || !password) {
//     res.status(401).json({ message: "Invalid username or password" });
//   }

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (username && bcrypt.compareSync(password, user.password)) {
//         next();
//       } else {
//         res.status(404).json({ message: "No user located!" });
//       }
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     });
// }

module.exports = router;
