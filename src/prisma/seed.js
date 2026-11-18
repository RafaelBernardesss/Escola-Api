require('dotenv').config();
const prisma = require('./client');

async function main() {
  const series = ['6º Ano A', '7º Ano A', '8º Ano A', '9º Ano A', '1º Ano EM', '2º Ano EM', '3º Ano EM'];

  for (const nome of series) {
    await prisma.serie.upsert({ where: { nome }, update: {}, create: { nome } });
  }

  console.log('Séries iniciais criadas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
