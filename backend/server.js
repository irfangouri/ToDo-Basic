const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./users/users');
const todos = require('./todos/todos');

const PORT = 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://irfangouri9983:rs34wPWAbNO0kpot@ac-urnlkps-shard-00-00.rxjk0n9.mongodb.net:27017,ac-urnlkps-shard-00-01.rxjk0n9.mongodb.net:27017,ac-urnlkps-shard-00-02.rxjk0n9.mongodb.net:27017/?replicaSet=atlas-3gznma-shard-0&ssl=true&authSource=admin');

app.use('/user', user);
app.use('/todos', todos);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
