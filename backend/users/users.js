const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const bcrypt = require('bcrypt');

const app = express();
const JWT_SECRET = 'oijadsf9032rdfnml239';
const saltRounds = 10;

const stringSchema = zod.string();
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

const User = mongoose.model('user', {
  name: String,
  username: String,
  password: String,
});

const userExist = async (username) => {
  const existingUser = await User.findOne({ username });
  return existingUser === null ? false : existingUser;
}

app.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  const nameValidation = stringSchema.safeParse(name);
  const usernameValidation = emailSchema.safeParse(username);
  const passwordValidation = passwordSchema.safeParse(password);

  if (
    !nameValidation.success
    || !usernameValidation.success
    || !passwordValidation.success
  ) {
    return res.status(403).json({
      msg: "Validation error, Please check your fields."
    });
  }

  const response = await userExist(username);
  if (!response) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });
    newUser.save();
  } else {
    return res.status(403).json({
      msg: `User ${username} already exist.`,
    });
  }
  return res.status(200).json({
    name,
    username,
  });
});


app.post('/access-token', async (req, res) => {
  const { username, password } = req.body;

  const usernameValidation = emailSchema.safeParse(username);
  const passwordValidation = passwordSchema.safeParse(password);

  if (
    !usernameValidation.success
    || !passwordValidation.success
  ) {
    return res.status(403).json({
      msg: "Validation error, Please check your fields."
    });
  }

  const isUser = await userExist(username);
  if (!isUser) {
    return res.status(404).json({
      msg: `User ${username} not found.`,
    });
  }

  const comparePassword = await bcrypt.compare(password, isUser.password);
  
  if (!comparePassword) {
    return res.status(403).json({
      msg: 'Entered password is wrong, Please enter correct password',
    });
  }

  const token = jwt.sign({username}, JWT_SECRET);
  return res.status(200).json({
    token,
  });
});

module.exports = app;
