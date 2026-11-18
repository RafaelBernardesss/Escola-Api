const prisma = require('../prisma/client');
const { HttpError, asyncHandler } = require('../middlewares/errorHandler');
const { textoObrigatorio, idValido } = require('../middlewares/validate');

const listar = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.serieId) where.serieId = idValido(req.query.serieId, 'serieId');

  const alunos = await prisma.aluno.findMany({
    where,
    orderBy: { nome: 'asc' },
    select: { id: true, nome: true, serieId: true },
  });

  res.json(alunos);
});

const criar = asyncHandler(async (req, res) => {
  const nome = textoObrigatorio(req.body.nome, 'nome');
  const serieId = idValido(req.body.serieId, 'serieId');

  const serie = await prisma.serie.findUnique({ where: { id: serieId } });
  if (!serie) throw new HttpError(404, 'Série não encontrada.');

  const aluno = await prisma.aluno.create({ data: { nome, serieId } });
  res.status(201).json(aluno);
});

const atualizar = asyncHandler(async (req, res) => {
  const id = idValido(req.params.id);
  const nome = textoObrigatorio(req.body.nome, 'nome');
  const aluno = await prisma.aluno.update({ where: { id }, data: { nome } });
  res.json(aluno);
});

const remover = asyncHandler(async (req, res) => {
  const id = idValido(req.params.id);
  await prisma.aluno.delete({ where: { id } });
  res.status(204).send();
});

module.exports = { listar, criar, atualizar, remover };
