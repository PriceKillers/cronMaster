const express = require('express');
const app = express();
const port = 3000;
const grabEbayCron = require('./cronMaster.js').grabEbayCron;
const threshCronMailer = require('./autoMailer.js').threshCronMailer;

app.get('/', (req, res) => {
  res.send('Hey!')
});

// grabEbayCron.start();
grabEbayCron.start();
threshCronMailer.start();

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
