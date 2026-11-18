class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function notFound(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}

function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ erro: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com esses dados.' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ erro: 'Registro não encontrado.' });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = { HttpError, asyncHandler, notFound, errorHandler };
