const express = require('express');
const app = express();

//Import routes
const authRoute = require('./routes/auth');

// Route middleware
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('http://localhost:3000'));
