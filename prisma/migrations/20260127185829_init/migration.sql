-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ETABLISSEMENT', 'ETUDIANT');

-- CreateEnum
CREATE TYPE "TypePeriode" AS ENUM ('TRIMESTRE', 'SEMESTRE');

-- CreateEnum
CREATE TYPE "CategorieMatiere" AS ENUM ('SCIENCE', 'LITTERATURE', 'ART_SPORT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etablissement" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "telephone" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnneeScolaire" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etablissementId" TEXT NOT NULL,

    CONSTRAINT "AnneeScolaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classe" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etablissementId" TEXT NOT NULL,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periode" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "typePeriode" "TypePeriode" NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "anneeId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,

    CONSTRAINT "Periode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matiere" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT,
    "categorie" "CategorieMatiere" NOT NULL,
    "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,

    CONSTRAINT "Matiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etudiant" (
    "id" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3),
    "lieuNaissance" TEXT,
    "sexe" TEXT,
    "adresse" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "envies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "etablissementId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "surTotal" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "periodeId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appreciation" (
    "id" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "periodeId" TEXT NOT NULL,

    CONSTRAINT "Appreciation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatistiqueEtudiant" (
    "id" TEXT NOT NULL,
    "moyenneGenerale" DOUBLE PRECISION NOT NULL,
    "moyenneScience" DOUBLE PRECISION,
    "moyenneLitterature" DOUBLE PRECISION,
    "moyenneArtSport" DOUBLE PRECISION,
    "matieresFortes" TEXT,
    "matieresFaibles" TEXT,
    "rangClasse" INTEGER,
    "totalEleves" INTEGER,
    "periodeId" TEXT,
    "anneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etudiantId" TEXT NOT NULL,

    CONSTRAINT "StatistiqueEtudiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationIA" (
    "id" TEXT NOT NULL,
    "titre" TEXT,
    "messages" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etudiantId" TEXT NOT NULL,

    CONSTRAINT "ConversationIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etablissement_email_key" ON "Etablissement"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etablissement_userId_key" ON "Etablissement"("userId");

-- CreateIndex
CREATE INDEX "Etablissement_userId_idx" ON "Etablissement"("userId");

-- CreateIndex
CREATE INDEX "AnneeScolaire_etablissementId_idx" ON "AnneeScolaire"("etablissementId");

-- CreateIndex
CREATE INDEX "AnneeScolaire_active_idx" ON "AnneeScolaire"("active");

-- CreateIndex
CREATE INDEX "Classe_etablissementId_idx" ON "Classe"("etablissementId");

-- CreateIndex
CREATE UNIQUE INDEX "Classe_etablissementId_nom_key" ON "Classe"("etablissementId", "nom");

-- CreateIndex
CREATE INDEX "Periode_anneeId_idx" ON "Periode"("anneeId");

-- CreateIndex
CREATE INDEX "Periode_classeId_idx" ON "Periode"("classeId");

-- CreateIndex
CREATE UNIQUE INDEX "Periode_anneeId_classeId_numero_key" ON "Periode"("anneeId", "classeId", "numero");

-- CreateIndex
CREATE INDEX "Matiere_etablissementId_idx" ON "Matiere"("etablissementId");

-- CreateIndex
CREATE INDEX "Matiere_classeId_idx" ON "Matiere"("classeId");

-- CreateIndex
CREATE INDEX "Matiere_categorie_idx" ON "Matiere"("categorie");

-- CreateIndex
CREATE UNIQUE INDEX "Matiere_etablissementId_classeId_nom_key" ON "Matiere"("etablissementId", "classeId", "nom");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_matricule_key" ON "Etudiant"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_email_key" ON "Etudiant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_userId_key" ON "Etudiant"("userId");

-- CreateIndex
CREATE INDEX "Etudiant_userId_idx" ON "Etudiant"("userId");

-- CreateIndex
CREATE INDEX "Etudiant_etablissementId_idx" ON "Etudiant"("etablissementId");

-- CreateIndex
CREATE INDEX "Etudiant_classeId_idx" ON "Etudiant"("classeId");

-- CreateIndex
CREATE INDEX "Etudiant_matricule_idx" ON "Etudiant"("matricule");

-- CreateIndex
CREATE INDEX "Note_etudiantId_idx" ON "Note"("etudiantId");

-- CreateIndex
CREATE INDEX "Note_matiereId_idx" ON "Note"("matiereId");

-- CreateIndex
CREATE INDEX "Note_periodeId_idx" ON "Note"("periodeId");

-- CreateIndex
CREATE INDEX "Appreciation_etudiantId_idx" ON "Appreciation"("etudiantId");

-- CreateIndex
CREATE INDEX "Appreciation_periodeId_idx" ON "Appreciation"("periodeId");

-- CreateIndex
CREATE INDEX "StatistiqueEtudiant_etudiantId_idx" ON "StatistiqueEtudiant"("etudiantId");

-- CreateIndex
CREATE INDEX "StatistiqueEtudiant_periodeId_idx" ON "StatistiqueEtudiant"("periodeId");

-- CreateIndex
CREATE INDEX "StatistiqueEtudiant_anneeId_idx" ON "StatistiqueEtudiant"("anneeId");

-- CreateIndex
CREATE INDEX "ConversationIA_etudiantId_idx" ON "ConversationIA"("etudiantId");

-- CreateIndex
CREATE INDEX "ConversationIA_actif_idx" ON "ConversationIA"("actif");

-- AddForeignKey
ALTER TABLE "Etablissement" ADD CONSTRAINT "Etablissement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnneeScolaire" ADD CONSTRAINT "AnneeScolaire_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classe" ADD CONSTRAINT "Classe_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periode" ADD CONSTRAINT "Periode_anneeId_fkey" FOREIGN KEY ("anneeId") REFERENCES "AnneeScolaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periode" ADD CONSTRAINT "Periode_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matiere" ADD CONSTRAINT "Matiere_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matiere" ADD CONSTRAINT "Matiere_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etudiant" ADD CONSTRAINT "Etudiant_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appreciation" ADD CONSTRAINT "Appreciation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appreciation" ADD CONSTRAINT "Appreciation_periodeId_fkey" FOREIGN KEY ("periodeId") REFERENCES "Periode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatistiqueEtudiant" ADD CONSTRAINT "StatistiqueEtudiant_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationIA" ADD CONSTRAINT "ConversationIA_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
