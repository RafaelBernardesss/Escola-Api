const prisma = require('../prisma/client');
const { HttpError, asyncHandler } = require('../middlewares/errorHandler');
const { textoObrigatorio, idValido } = require('../middlewares/validate');

const listar = asyncHandler(async (req, res) => {
  const series = await prisma.serie.findMany({
    orderBy: { nome: 'asc' },
    include: { _count: { select: { alunos: true } } },
  });

  res.json(
    series.map((s) => ({ id: s.id, nome: s.nome, totalAlunos: s._count.alunos }))
  );
});

const criar = asyncHandler(async (req, res) => {
  const nome = textoObrigatorio(req.body.nome, 'nome');
  const serie = await prisma.serie.create({ data: { nome } });
  res.status(201).json({ ...serie, totalAlunos: 0 });
});

const atualizar = asyncHandler(async (req, res) => {
  const id = idValido(req.params.id);
  const nome = textoObrigatorio(req.body.nome, 'nome');
  const serie = await prisma.serie.update({ where: { id }, data: { nome } });
  res.json(serie);
});

const remover = asyncHandler(async (req, res) => {
  const id = idValido(req.params.id);
  const existe = await prisma.serie.findUnique({ where: { id } });
  if (!existe) throw new HttpError(404, 'Série não encontrada.');

  await prisma.serie.delete({ where: { id } });
  res.status(204).send();
});

module.exports = { listar, criar, atualizar, remover };
