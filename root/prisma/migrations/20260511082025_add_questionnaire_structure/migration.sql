-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AssessmentDomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentDomain_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "helpText" TEXT,
    "type" TEXT NOT NULL DEFAULT 'LIKERT_1_5',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentQuestion_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "AssessmentDomain" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
