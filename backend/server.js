const express = require('express');

const PORT = 4000;
const app = express();

app.get('/', (req, res) => {
  res.json({
    msg: 'Hello world!!!',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
