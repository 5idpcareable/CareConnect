-- CreateTable
CREATE TABLE "AssessmentAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionnaireId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentAttempt_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentResponse_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "AssessmentDomain" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentAttempt_userId_questionnaireId_key" ON "AssessmentAttempt"("userId", "questionnaireId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResponse_attemptId_questionId_key" ON "AssessmentResponse"("attemptId", "questionId");
