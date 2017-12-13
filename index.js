const express = require('express');
const app = express();
const port = 3000;
const grabEbayCron = require('./cronMaster.js').grabEbayCron;

app.get('/', (req, res) => {
  res.send('Hey!')
});

grabEbayCron.start();

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
