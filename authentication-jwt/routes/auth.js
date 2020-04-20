const router = require('express').Router();

//localhost:..../api/user/

router.post('/register', (req, res) => {
  res.send('Registered');
});

router.post('/login', (req, res) => {
  res.send('Login');
});

module.exports = router;
