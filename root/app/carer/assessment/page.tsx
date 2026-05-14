"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

type AssessmentQuestion = {
  id: string;
  prompt: string;
  helpText: string | null;
  type: string;
  order: number;
  isRequired: boolean;
};

type AssessmentDomain = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  questions: AssessmentQuestion[];
};

type Questionnaire = {
  id: string;
  title: string;
  description: string | null;
  domains: AssessmentDomain[];
};

type Attempt = {
  id: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
};

type AnswerValue = string;

export default function CarerAssessmentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [activeDomainId, setActiveDomainId] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [savedDomains, setSavedDomains] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAssessment() {
    try {
      const userResponse = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (!userResponse.ok) {
        window.location.href = "/login";
        return;
      }

      const userData = await userResponse.json();
      const currentUser: User | null = userData.user;

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      if (!currentUser.roles.includes("carer")) {
        window.location.href = "/";
        return;
      }

      setUser(currentUser);

      const assessmentResponse = await fetch("/api/carer/assessment", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      const assessmentData = await assessmentResponse.json();

      if (!assessmentResponse.ok) {
        setError(assessmentData.message || "Could not load your assessment.");
        return;
      }

      const activeQuestionnaire: Questionnaire = assessmentData.questionnaire;

      setQuestionnaire(activeQuestionnaire);
      setAttempt(assessmentData.attempt || null);
      setAnswers(assessmentData.answers || {});
      setSavedDomains(assessmentData.savedDomains || {});

      if (activeQuestionnaire.domains.length > 0 && !activeDomainId) {
        setActiveDomainId(activeQuestionnaire.domains[0].id);
      }
    } catch {
      setError("Something went wrong loading your assessment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssessment();
  }, []);

  const activeDomain = useMemo(() => {
    if (!questionnaire) {
      return null;
    }

    return (
      questionnaire.domains.find((domain) => domain.id === activeDomainId) ||
      questionnaire.domains[0] ||
      null
    );
  }, [questionnaire, activeDomainId]);

  const activeDomainIndex = useMemo(() => {
    if (!questionnaire || !activeDomain) {
      return -1;
    }

    return questionnaire.domains.findIndex(
      (domain) => domain.id === activeDomain.id
    );
  }, [questionnaire, activeDomain]);

  const completedDomainCount = useMemo(() => {
    return Object.values(savedDomains).filter(Boolean).length;
  }, [savedDomains]);

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  }

  function goToNextDomain() {
    if (!questionnaire || activeDomainIndex < 0) {
      return;
    }

    const nextDomain = questionnaire.domains[activeDomainIndex + 1];

    if (nextDomain) {
      setActiveDomainId(nextDomain.id);
      setSuccess("");
      setError("");
    }
  }

  function goToPreviousDomain() {
    if (!questionnaire || activeDomainIndex <= 0) {
      return;
    }

    const previousDomain = questionnaire.domains[activeDomainIndex - 1];

    if (previousDomain) {
      setActiveDomainId(previousDomain.id);
      setSuccess("");
      setError("");
    }
  }

  async function handleSaveSection() {
    if (!questionnaire || !activeDomain) {
      return;
    }

    setError("");
    setSuccess("");
    setSavingSection(true);

    const missingRequiredQuestion = activeDomain.questions.find(
      (question) => question.isRequired && !answers[question.id]
    );

    if (missingRequiredQuestion) {
      setSavingSection(false);
      setError("Please answer all required questions in this section.");
      return;
    }

    const sectionResponses = activeDomain.questions
      .filter((question) => answers[question.id])
      .map((question) => ({
        questionId: question.id,
        domainId: activeDomain.id,
        value: answers[question.id],
      }));

    try {
      const response = await fetch("/api/carer/assessment/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          questionnaireId: questionnaire.id,
          domainId: activeDomain.id,
          responses: sectionResponses,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not save this section.");
        return;
      }

      setSuccess(data.message || "Section saved successfully.");
      await loadAssessment();
    } catch {
      setError("Something went wrong saving this section.");
    } finally {
      setSavingSection(false);
    }
  }

  function renderQuestionInput(question: AssessmentQuestion) {
    const value = answers[question.id] || "";

    if (question.type === "YES_NO") {
      return (
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn ${
              value === "yes" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleAnswerChange(question.id, "yes")}
          >
            Yes
          </button>

          <button
            type="button"
            className={`btn ${
              value === "no" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleAnswerChange(question.id, "no")}
          >
            No
          </button>
        </div>
      );
    }

    if (question.type === "TEXT") {
      return (
        <textarea
          className="form-control"
          rows={4}
          value={value}
          onChange={(event) =>
            handleAnswerChange(question.id, event.target.value)
          }
          placeholder="Write your answer"
        />
      );
    }

    return (
      <div className="d-flex flex-wrap gap-2">
        {["1", "2", "3", "4", "5"].map((rating) => (
          <button
            key={rating}
            type="button"
            className={`btn ${
              value === rating ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleAnswerChange(question.id, rating)}
          >
            {rating}
          </button>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">Loading assessment...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      <style jsx>{`
        .domain-tab {
          border: 1px solid #dee2e6;
          background: #ffffff;
          transition: box-shadow 0.2s ease, transform 0.2s ease,
            border-color 0.2s ease;
        }

        .domain-tab:hover {
          box-shadow: 0 12px 28px rgba(13, 110, 253, 0.14);
          transform: translateY(-2px);
          border-color: #0d6efd;
        }

        .domain-tab-active {
          background: #0d6efd;
          color: #ffffff;
          border-color: #0d6efd;
        }

        .question-card {
          border: 1px solid #e9ecef;
          transition: box-shadow 0.2s ease;
        }

        .question-card:hover {
          box-shadow: 0 10px 24px rgba(33, 37, 41, 0.08);
        }
      `}</style>

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">Carer Assessment</h1>
              <p className="text-muted mb-0">
                Complete your assessment one section at a time.
              </p>

              {questionnaire && questionnaire.domains.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {completedDomainCount} of {questionnaire.domains.length}{" "}
                    sections saved
                  </span>

                  {attempt && (
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        attempt.status === "COMPLETED"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {attempt.status === "COMPLETED"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link href="/carer/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!questionnaire && !error && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-2">No Assessment Available</h4>
                <p className="text-muted mb-0">
                  Please wait for an admin to activate a questionnaire.
                </p>
              </div>
            </div>
          )}

          {questionnaire && questionnaire.domains.length === 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-2">No Questions Available</h4>
                <p className="text-muted mb-0">
                  The active questionnaire does not have visible questions yet.
                </p>
              </div>
            </div>
          )}

          {questionnaire && questionnaire.domains.length > 0 && (
            <>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {questionnaire.domains.map((domain, index) => {
                  const isActive = domain.id === activeDomain?.id;
                  const isSaved = savedDomains[domain.id];

                  return (
                    <button
                      key={domain.id}
                      type="button"
                      className={`btn domain-tab rounded-pill px-4 ${
                        isActive ? "domain-tab-active" : ""
                      }`}
                      onClick={() => {
                        setActiveDomainId(domain.id);
                        setSuccess("");
                        setError("");
                      }}
                    >
                      {index + 1}. {domain.title}
                      {isSaved ? " Saved" : ""}
                    </button>
                  );
                })}
              </div>

              {activeDomain && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4 p-lg-5">
                    <div className="mb-4">
                      <h2 className="fw-bold text-primary mb-1">
                        {activeDomain.title}
                      </h2>
                      <p className="text-muted mb-0">
                        {activeDomain.description ||
                          "Answer the questions in this section."}
                      </p>
                    </div>

                    <div className="d-grid gap-3">
                      {activeDomain.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="question-card bg-white rounded-4 p-4"
                        >
                          <div className="d-flex justify-content-between gap-3 mb-3">
                            <div>
                              <h5 className="fw-bold mb-1">
                                Question {index + 1}
                              </h5>
                              <p className="mb-1">{question.prompt}</p>

                              {question.helpText && (
                                <small className="text-muted">
                                  {question.helpText}
                                </small>
                              )}
                            </div>

                            {question.isRequired && (
                              <span className="badge bg-danger align-self-start">
                                Required
                              </span>
                            )}
                          </div>

                          {renderQuestionInput(question)}
                        </div>
                      ))}
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={goToPreviousDomain}
                        disabled={activeDomainIndex <= 0}
                      >
                        Previous Section
                      </button>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveSection}
                          disabled={savingSection}
                        >
                          {savingSection ? "Saving..." : "Save Section"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={goToNextDomain}
                          disabled={
                            !questionnaire ||
                            activeDomainIndex >=
                              questionnaire.domains.length - 1
                          }
                        >
                          Next Section
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
