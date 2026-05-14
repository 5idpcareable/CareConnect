-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentDomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "AssessmentDomain_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentDomain_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AssessmentDomain_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentDomain" ("createdAt", "description", "id", "order", "questionnaireId", "title", "updatedAt") SELECT "createdAt", "description", "id", "order", "questionnaireId", "title", "updatedAt" FROM "AssessmentDomain";
DROP TABLE "AssessmentDomain";
ALTER TABLE "new_AssessmentDomain" RENAME TO "AssessmentDomain";
CREATE TABLE "new_AssessmentQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "helpText" TEXT,
    "type" TEXT NOT NULL DEFAULT 'LIKERT_1_5',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "AssessmentQuestion_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "AssessmentDomain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentQuestion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AssessmentQuestion_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentQuestion" ("createdAt", "domainId", "helpText", "id", "isRequired", "order", "prompt", "type", "updatedAt") SELECT "createdAt", "domainId", "helpText", "id", "isRequired", "order", "prompt", "type", "updatedAt" FROM "AssessmentQuestion";
DROP TABLE "AssessmentQuestion";
ALTER TABLE "new_AssessmentQuestion" RENAME TO "AssessmentQuestion";
CREATE TABLE "new_Questionnaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "Questionnaire_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Questionnaire_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Questionnaire" ("createdAt", "description", "id", "isActive", "title", "updatedAt") SELECT "createdAt", "description", "id", "isActive", "title", "updatedAt" FROM "Questionnaire";
DROP TABLE "Questionnaire";
ALTER TABLE "new_Questionnaire" RENAME TO "Questionnaire";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
