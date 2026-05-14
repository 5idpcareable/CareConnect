-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "helpText" TEXT,
    "type" TEXT NOT NULL DEFAULT 'LIKERT_1_5',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    CONSTRAINT "AssessmentQuestion_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "AssessmentDomain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentQuestion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AssessmentQuestion_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentQuestion" ("createdAt", "createdById", "domainId", "helpText", "id", "isRequired", "order", "prompt", "type", "updatedAt", "updatedById") SELECT "createdAt", "createdById", "domainId", "helpText", "id", "isRequired", "order", "prompt", "type", "updatedAt", "updatedById" FROM "AssessmentQuestion";
DROP TABLE "AssessmentQuestion";
ALTER TABLE "new_AssessmentQuestion" RENAME TO "AssessmentQuestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
