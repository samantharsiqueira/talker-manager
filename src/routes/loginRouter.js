const express = require('express');

const router = express.Router();
router.use(express.json());

const { validateEmail, validatePassword } = require('../validation');

function randomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

router.post('/', validateEmail, validatePassword, (_req, res) => {
  const token = randomToken(16);
  console.log(token);
  res.status(200).json({ token });
});

module.exports = router;