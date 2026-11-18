require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

// 0.0.0.0 permite que o celular (Expo Go) acesse a API pela rede local
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando na porta ${PORT}`);
});
