-- CreateTable
CREATE TABLE "Serie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "serieId" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aluno_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presenca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT true,
    "alunoId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "Presenca_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Presenca_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Serie_nome_key" ON "Serie"("nome");

-- CreateIndex
CREATE INDEX "Aluno_serieId_idx" ON "Aluno"("serieId");

-- CreateIndex
CREATE INDEX "Presenca_serieId_data_idx" ON "Presenca"("serieId", "data");

-- CreateIndex
CREATE UNIQUE INDEX "Presenca_alunoId_data_key" ON "Presenca"("alunoId", "data");
