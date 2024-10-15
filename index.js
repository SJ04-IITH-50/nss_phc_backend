const express = require('express');
const pool = require('./config/dbconfig'); 


const app = express();
const PORT = process.env.PORT || 8001;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
