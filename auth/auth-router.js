const router = require('express').Router();
const Users = require("./auth-model.js");
const bcrypt = require('bcryptjs');


router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;

  if (!user.username || !user.password) {
    res.status(404).json({ message: "Please enter username and password" });
  }

  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = genToken(saved)
      res.status(201).json({created_new_user: saved, token: token});
    })
    .catch(err => {
      res.status(500).json({message: "Error crating user", err});
    });
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
        req.session.user = user;
        res.status(201).json({ message: "Logged in", token: user.id });
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
