import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import config from './configs/configs';

const app = express();

app.set('my-key', config.llave);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3030, () => {
  console.log('Servidor iniciado en el puerto 3000');
});

const protectedRoutes = express.Router();
protectedRoutes.use((req, res, next) => {
  console.log('middleware is working');
  const token = req.headers['access-token'];
  if (token) {
    jwt.verify(token, app.get('my-key'), (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: 'Invalid token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({ msg: 'You need a token' });
  }
});

app.get('/', function(req, res) {
  res.send('Inicio');
});

app.post('/login', (req, res) => {
  if (req.body.username === 'Guillermo' && req.body.password === 'micontraseña') {
    const payload = { check: true };
    const token = jwt.sign(payload, app.get('my-key'), { expiresIn: 1440 });
    res.json({
      msg: 'Autenticación correcta',
      token: token
    });
  } else {
    res.status(401).json({ msg: 'Usuario o contraseña incorrecta' });
  }
});

app.get('/protectedData', protectedRoutes, (req, res) => {
  const datos = [
    { key: 'a', value: 0 },
    { key: 'b', value: 1 },
    { key: 'c', value: 2 }
  ];
  res.json(datos);
});
