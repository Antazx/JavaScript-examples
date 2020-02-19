const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./configs/configs');

const app = express();

app.set('my-key', config.llave);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

app.get('/', function(req, res) {
  res.send('Inicio');
});
