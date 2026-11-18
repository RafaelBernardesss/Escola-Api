const { HttpError } = require('./errorHandler');

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function textoObrigatorio(valor, campo) {
  if (typeof valor !== 'string' || valor.trim().length < 2) {
    throw new HttpError(400, `O campo "${campo}" é obrigatório (mínimo 2 caracteres).`);
  }
  return valor.trim().replace(/\s+/g, ' ');
}

function idValido(valor, campo = 'id') {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) {
    throw new HttpError(400, `"${campo}" inválido.`);
  }
  return n;
}

function dataValida(valor, campo = 'data') {
  if (typeof valor !== 'string' || !DATA_REGEX.test(valor) || Number.isNaN(Date.parse(valor))) {
    throw new HttpError(400, `"${campo}" deve estar no formato AAAA-MM-DD.`);
  }
  return valor;
}

module.exports = { textoObrigatorio, idValido, dataValida };
