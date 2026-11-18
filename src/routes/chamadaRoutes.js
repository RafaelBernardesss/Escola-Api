const { Router } = require('express');
const controller = require('../controllers/chamadaController');

const router = Router();

router.get('/', controller.buscar);
router.get('/historico', controller.historico);
router.post('/', controller.salvar);

module.exports = router;
