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
  if (!token) {
    return res.status(403).json({
      msg: 'Unauthorized access'
    });
  }
  const userDetails = jwt.verify(token, JWT_SECRET);
  const todos = await Todo.find({ username: userDetails.username });
  if (todos.length === 0) {
    return res.status(200).json({
      msg: 'Please enter some todos in the list first.'
    });
  }
  return res.status(200).json({
    todos,
  });
});

app.post('/', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      msg: 'Unauthorized access'
    });
  }
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

app.put('/:todoId', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      msg: 'Unauthorized access'
    });
  }
  const { todoId } = req.params;
  const data = req.body;

  if (data.title) {
    const updatedTitle = await Todo.updateOne(
      { _id: todoId },
      { $set: {
        title: data.title,
      }}
    );
    if (!updatedTitle.acknowledged) {
      return res.status(403).json({
        msg: 'Something went wrong, Please try again.',
      });
    }
  }
  if (data.description) {
    const updatedDescription = await Todo.updateOne(
      { _id: todoId },
      { $set: {
        description: data.description,
      }}
    );
    if (!updatedDescription.acknowledged) {
      return res.status(403).json({
        msg: 'Something went wrong, Please try again.',
      });
    }
  }

  return res.status(200).json({
    msg: 'Todo updated successfully.',
  });
});

app.delete('/:todoId', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      msg: 'Unauthorized access'
    });
  }
  const { todoId } = req.params;
  const todo = await Todo.deleteOne({ _id: todoId });
  if (todo.deletedCount === 0) {
    return res.status(403).json({
      msg: 'Please enter correct todoId.',
    });
  }
  return res.status(204);
});

module.exports = app;
