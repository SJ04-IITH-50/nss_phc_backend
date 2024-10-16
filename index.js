const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./route/userroute');
const receptionistroute=require('./route/receptionistroute')
const pool = require('./config/dbconfig');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(bodyParser.json());


app.use('/api/users', userRoutes); 
app.use('/api/receptionist',receptionistroute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
