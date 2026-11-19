require('dotenv').config();
const path = require('path');
const { execFileSync } = require('child_process');
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Aplica as migrations pendentes ao iniciar (cria as tabelas se o banco estiver vazio).
// Desative com SKIP_MIGRATE=true.
function aplicarMigrations() {
  if (process.env.SKIP_MIGRATE === 'true') return;
  try {
    const prismaCli = require.resolve('prisma/build/index.js');
    execFileSync(process.execPath, [prismaCli, 'migrate', 'deploy'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (err) {
    console.error('Falha ao aplicar migrations:', err.message);
  }
}

aplicarMigrations();

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
