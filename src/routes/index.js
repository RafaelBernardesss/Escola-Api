const { Router } = require('express');
const serieRoutes = require('./serieRoutes');
const alunoRoutes = require('./alunoRoutes');
const chamadaRoutes = require('./chamadaRoutes');
const prisma = require('../prisma/client');

const router = Router();

router.get('/', (req, res) => {
  res.json({ ok: true, api: 'Chamada Escolar - E.E. Profª Sueli da Silveira Marin Batista' });
});

// Diagnóstico: confirma se o banco de dados está acessível e com as tabelas criadas
router.get('/health', async (req, res) => {
  try {
    const series = await prisma.serie.count();
    res.json({ ok: true, db: 'ok', series });
  } catch (err) {
    console.error('Falha no banco de dados:', err);
    // P2021 = tabela não existe (migrations não aplicadas); P1012/P1001 = DATABASE_URL ausente/inválida ou banco inacessível
    // "detalhe" é só para diagnóstico: remova depois que tudo funcionar.
    res.status(500).json({
      ok: false,
      db: 'erro',
      codigo: err.code || err.errorCode || err.name,
      detalhe: String(err.message || '').replace(/\s+/g, ' ').slice(-600),
    });
  }
});

router.use('/series', serieRoutes);
router.use('/alunos', alunoRoutes);
router.use('/chamadas', chamadaRoutes);

module.exports = router;
