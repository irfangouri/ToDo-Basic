const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = 'oijadsf9032rdfnml239';

const Todo = mongoose.model('todos', {
  title: String,
  description: String,
  username: String,
});

app.get('/', async (req, res) => {
  const token = req.headers.authorization;
  const userDetails = jwt.verify(token, JWT_SECRET);
  const todos = await Todo.find({ username: userDetails.username });
  return res.status(200).json({
    todos,
  });
});

app.post('/', (req, res) => {
  const token = req.headers.authorization;
  const userDetails = jwt.verify(token, JWT_SECRET);
  const { title, description } = req.body;
  const newTodo = new Todo({
    title,
    description,
    username: userDetails.username,
  });
  newTodo.save();
  return res.status(201).json({
    todo: {
      title,
      description,
      username: userDetails.username,
    },
  });
});

app.put('/:todoId', (req, res) => {

});

app.delete('/:', (req, res) => {

});

module.exports = app;
