# API Chamada Escolar

## Rodar em produção (primeira vez e a cada atualização)

```bash
npm install            # também roda "prisma generate" automaticamente
cp exemple.env .env    # e ajuste DATABASE_URL / PORT
npm run migrate:deploy # cria/atualiza as tabelas no banco (OBRIGATÓRIO em produção)
npm run seed           # (opcional) cria as séries iniciais
npm start
```

O servidor também aplica as migrations sozinho ao iniciar (desative com `SKIP_MIGRATE=true`).

Ou, de uma vez só: `npm run start:prod` (aplica as migrations e sobe o servidor).

> Use `migrate:deploy` em produção. `prisma:migrate` (migrate dev) é só para desenvolvimento.

## Diagnóstico

`GET /health` confirma se o banco responde:

- `{"ok":true,"db":"ok"}` → tudo certo.
- `{"ok":false,"db":"erro","codigo":"P2021"}` → tabelas não existem: rode `npm run migrate:deploy`.
- `codigo` `P1012`/`P1001`/`PrismaClientInitializationError` → `DATABASE_URL` ausente/inválida ou banco inacessível (confira o `.env`).
