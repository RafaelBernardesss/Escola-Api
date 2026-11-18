const { Router } = require('express');
const serieRoutes = require('./serieRoutes');
const alunoRoutes = require('./alunoRoutes');
const chamadaRoutes = require('./chamadaRoutes');

const router = Router();

router.get('/', (req, res) => {
  res.json({ ok: true, api: 'Chamada Escolar - E.E. Profª Sueli da Silveira Marin Batista' });
});

router.use('/series', serieRoutes);
router.use('/alunos', alunoRoutes);
router.use('/chamadas', chamadaRoutes);

module.exports = router;
