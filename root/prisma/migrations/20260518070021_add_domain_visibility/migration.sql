-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentDomain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "AssessmentDomain_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentDomain_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AssessmentDomain_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentDomain" ("createdAt", "createdById", "description", "id", "order", "questionnaireId", "title", "updatedAt", "updatedById") SELECT "createdAt", "createdById", "description", "id", "order", "questionnaireId", "title", "updatedAt", "updatedById" FROM "AssessmentDomain";
DROP TABLE "AssessmentDomain";
ALTER TABLE "new_AssessmentDomain" RENAME TO "AssessmentDomain";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
