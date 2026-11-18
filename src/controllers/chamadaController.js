const prisma = require('../prisma/client');
const { HttpError, asyncHandler } = require('../middlewares/errorHandler');
const { idValido, dataValida } = require('../middlewares/validate');

const buscar = asyncHandler(async (req, res) => {
  const serieId = idValido(req.query.serieId, 'serieId');
  const data = dataValida(req.query.data);

  const [alunos, presencas] = await Promise.all([
    prisma.aluno.findMany({ where: { serieId }, orderBy: { nome: 'asc' } }),
    prisma.presenca.findMany({ where: { serieId, data } }),
  ]);

  const mapa = new Map(presencas.map((p) => [p.alunoId, p.presente]));

  res.json({
    serieId,
    data,
    chamadaRealizada: presencas.length > 0,
    registros: alunos.map((a) => ({
      alunoId: a.id,
      nome: a.nome,
      presente: mapa.has(a.id) ? mapa.get(a.id) : true,
    })),
  });
});

const salvar = asyncHandler(async (req, res) => {
  const serieId = idValido(req.body.serieId, 'serieId');
  const data = dataValida(req.body.data);
  const { registros } = req.body;

  if (!Array.isArray(registros) || registros.length === 0) {
    throw new HttpError(400, 'Envie ao menos um registro de chamada.');
  }

  const alunos = await prisma.aluno.findMany({ where: { serieId }, select: { id: true } });
  const idsValidos = new Set(alunos.map((a) => a.id));

  const operacoes = registros.map((r) => {
    const alunoId = idValido(r.alunoId, 'alunoId');
    if (!idsValidos.has(alunoId)) {
      throw new HttpError(400, `O aluno ${alunoId} não pertence a esta série.`);
    }
    const presente = Boolean(r.presente);

    return prisma.presenca.upsert({
      where: { alunoId_data: { alunoId, data } },
      update: { presente },
      create: { alunoId, serieId, data, presente },
    });
  });

  await prisma.$transaction(operacoes);

  const presentes = registros.filter((r) => r.presente).length;
  res.status(201).json({
    mensagem: 'Chamada salva com sucesso.',
    total: registros.length,
    presentes,
    faltas: registros.length - presentes,
  });
});

const historico = asyncHandler(async (req, res) => {
  const serieId = idValido(req.query.serieId, 'serieId');

  const dias = await prisma.presenca.groupBy({
    by: ['data', 'presente'],
    where: { serieId },
    _count: { _all: true },
    orderBy: { data: 'desc' },
  });

  const porDia = new Map();
  for (const linha of dias) {
    const item = porDia.get(linha.data) || { data: linha.data, presentes: 0, faltas: 0 };
    if (linha.presente) item.presentes = linha._count._all;
    else item.faltas = linha._count._all;
    porDia.set(linha.data, item);
  }

  res.json([...porDia.values()]);
});

module.exports = { buscar, salvar, historico };
