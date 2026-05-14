"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type User = {
  id: string;
  firstName: string;
  lastName?: string;
  roles: string[];
};

type UserSummary = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type QuestionnaireListItem = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  domainCount: number;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

type AssessmentQuestion = {
  id: string;
  prompt: string;
  helpText: string | null;
  type: string;
  order: number;
  isRequired: boolean;
  isVisible: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: UserSummary | null;
  updatedBy?: UserSummary | null;
};

type AssessmentDomain = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: UserSummary | null;
  updatedBy?: UserSummary | null;
  questions: AssessmentQuestion[];
};

type QuestionnaireDetail = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: UserSummary | null;
  updatedBy?: UserSummary | null;
  domains: AssessmentDomain[];
};

type ActivePanel = "domain" | "question" | "existing";
type QuestionFilter = "active" | "all";

function fullName(user?: UserSummary | null) {
  if (!user) {
    return "Not recorded";
  }

  return `${user.firstName} ${user.lastName}`.trim();
}

export default function AdminQuestionnairesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireListItem[]>(
    []
  );
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState("");
  const [questionnaire, setQuestionnaire] =
    useState<QuestionnaireDetail | null>(null);

  const [activePanel, setActivePanel] = useState<ActivePanel>("domain");
  const [selectedDomainId, setSelectedDomainId] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [questionFilter, setQuestionFilter] =
    useState<QuestionFilter>("active");

  const [loading, setLoading] = useState(true);
  const [savingQuestionnaire, setSavingQuestionnaire] = useState(false);
  const [savingDomain, setSavingDomain] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [updatingQuestionId, setUpdatingQuestionId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadQuestionnaires(preferredId?: string) {
    const response = await fetch("/api/admin/questionnaires", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not load questionnaires.");
      return;
    }

    const list: QuestionnaireListItem[] = data.questionnaires || [];
    setQuestionnaires(list);

    const nextSelectedId = preferredId || selectedQuestionnaireId || list[0]?.id;

    if (nextSelectedId) {
      setSelectedQuestionnaireId(nextSelectedId);
      await loadQuestionnaireDetail(nextSelectedId);
    } else {
      setQuestionnaire(null);
      setSelectedQuestionnaireId("");
    }
  }

  async function loadQuestionnaireDetail(questionnaireId: string) {
    const response = await fetch(`/api/admin/questionnaires/${questionnaireId}`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not load questionnaire details.");
      return;
    }

    const detail: QuestionnaireDetail = data.questionnaire;
    setQuestionnaire(detail);

    if (detail.domains.length > 0) {
      setSelectedDomainId((currentDomainId) => {
        const stillExists = detail.domains.some(
          (domain) => domain.id === currentDomainId
        );

        return stillExists ? currentDomainId : detail.domains[0].id;
      });
    } else {
      setSelectedDomainId("");
    }
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        const currentUser: User | null = data.user;

        if (!currentUser) {
          window.location.href = "/login";
          return;
        }

        const canAccessAdmin =
          currentUser.roles.includes("admin") ||
          currentUser.roles.includes("super_admin");

        if (!canAccessAdmin) {
          window.location.href = "/carer/dashboard";
          return;
        }

        setUser(currentUser);
        await loadQuestionnaires();
      } catch {
        setError("Something went wrong loading the questionnaire builder.");
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  const questionsWithDomain = useMemo(() => {
    if (!questionnaire) {
      return [];
    }

    return questionnaire.domains.flatMap((domain) =>
      domain.questions.map((question) => ({
        ...question,
        domainId: domain.id,
        domainTitle: domain.title,
      }))
    );
  }, [questionnaire]);

  const filteredQuestions = useMemo(() => {
    let questions = questionsWithDomain;

    if (domainFilter !== "all") {
      questions = questions.filter(
        (question) => question.domainId === domainFilter
      );
    }

    if (questionFilter === "active") {
      questions = questions.filter(
        (question) => question.isVisible && !question.deletedAt
      );
    }

    return questions;
  }, [questionsWithDomain, domainFilter, questionFilter]);

  async function handleCreateQuestionnaire(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setError("");
    setSuccess("");
    setSavingQuestionnaire(true);

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/admin/questionnaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not create questionnaire.");
        return;
      }

      form.reset();
      setSuccess("Questionnaire created successfully.");

      await loadQuestionnaires(data.questionnaire.id);
      setActivePanel("domain");
    } catch {
      setError("Something went wrong creating the questionnaire.");
    } finally {
      setSavingQuestionnaire(false);
    }
  }

  async function handleCreateDomain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!questionnaire) {
      setError("Please create a questionnaire first.");
      return;
    }

    setError("");
    setSuccess("");
    setSavingDomain(true);

    const formData = new FormData(form);

    try {
      const response = await fetch(
        `/api/admin/questionnaires/${questionnaire.id}/domains`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: formData.get("title"),
            description: formData.get("description"),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not create domain.");
        return;
      }

      form.reset();
      setSuccess("Domain created successfully.");

      await loadQuestionnaireDetail(questionnaire.id);
      setSelectedDomainId(data.domain.id);
      setActivePanel("question");
    } catch {
      setError("Something went wrong creating the domain.");
    } finally {
      setSavingDomain(false);
    }
  }

  async function handleCreateQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!questionnaire) {
      setError("Please create a questionnaire first.");
      return;
    }

    if (!selectedDomainId) {
      setError("Please create or select a domain first.");
      return;
    }

    setError("");
    setSuccess("");
    setSavingQuestion(true);

    const formData = new FormData(form);

    try {
      const response = await fetch(
        `/api/admin/questionnaires/${questionnaire.id}/domains/${selectedDomainId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            prompt: formData.get("prompt"),
            helpText: formData.get("helpText"),
            type: formData.get("type"),
            isRequired: formData.get("isRequired") === "on",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not create question.");
        return;
      }

      form.reset();
      setSuccess("Question added successfully. It is hidden until activated.");

      await loadQuestionnaireDetail(questionnaire.id);
      setQuestionFilter("all");
      setActivePanel("existing");
    } catch {
      setError("Something went wrong creating the question.");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function handleQuestionAction(
    questionId: string,
    action: "toggle-visibility" | "soft-delete"
  ) {
    if (!questionnaire) {
      return;
    }

    setError("");
    setSuccess("");
    setUpdatingQuestionId(questionId);

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not update question.");
        return;
      }

      setSuccess(data.message || "Question updated successfully.");
      await loadQuestionnaireDetail(questionnaire.id);
      await loadQuestionnaires(questionnaire.id);
    } catch {
      setError("Something went wrong updating the question.");
    } finally {
      setUpdatingQuestionId("");
    }
  }

  function questionStatus(question: AssessmentQuestion) {
    if (question.deletedAt) {
      return <span className="badge bg-danger">Deleted</span>;
    }

    if (question.isVisible) {
      return <span className="badge bg-success">Visible</span>;
    }

    return <span className="badge bg-secondary">Hidden</span>;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-light py-5" style={{ minHeight: "70vh" }}>
          <div className="container">
            <div className="alert alert-info mb-0">
              Loading questionnaire builder...
            </div>
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
        .questionnaire-tab {
          transition: box-shadow 0.2s ease, transform 0.2s ease,
            border-color 0.2s ease;
          cursor: pointer;
        }

        .questionnaire-tab:hover {
          box-shadow: 0 14px 34px rgba(13, 110, 253, 0.16) !important;
          transform: translateY(-3px);
          border-color: #0d6efd !important;
        }

        .questionnaire-tab-active {
          border: 1px solid #0d6efd !important;
          box-shadow: 0 12px 28px rgba(13, 110, 253, 0.14) !important;
        }
      `}</style>

      <main className="bg-light py-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
            <div>
              <h1 className="fw-bold text-primary mb-1">
                Questionnaire Builder
              </h1>
              <p className="text-muted mb-0">
                Create domains, add assessment questions, and review the full
                question bank.
              </p>
            </div>

            <Link href="/admin/dashboard" className="btn btn-outline-primary">
              Back to Dashboard
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <button
                type="button"
                className={`card questionnaire-tab border-0 shadow-sm w-100 text-start h-100 ${
                  activePanel === "domain" ? "questionnaire-tab-active" : ""
                }`}
                onClick={() => setActivePanel("domain")}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="fw-bold mb-2">Create Domain</h4>
                      <p className="text-muted mb-0">
                        Add skill areas such as communication, planning, or care
                        coordination.
                      </p>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      Step 1
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="col-lg-4">
              <button
                type="button"
                className={`card questionnaire-tab border-0 shadow-sm w-100 text-start h-100 ${
                  activePanel === "question" ? "questionnaire-tab-active" : ""
                }`}
                onClick={() => setActivePanel("question")}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="fw-bold mb-2">Create Question</h4>
                      <p className="text-muted mb-0">
                        Select a domain and add the question carers will answer.
                      </p>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      Step 2
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="col-lg-4">
              <button
                type="button"
                className={`card questionnaire-tab border-0 shadow-sm w-100 text-start h-100 ${
                  activePanel === "existing" ? "questionnaire-tab-active" : ""
                }`}
                onClick={() => setActivePanel("existing")}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="fw-bold mb-2">Existing Questions</h4>
                      <p className="text-muted mb-0">
                        Review questions, domains, and admin audit details.
                      </p>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      Report
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {!questionnaire && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <h3 className="fw-bold text-primary mb-2">
                  Create First Questionnaire
                </h3>
                <p className="text-muted mb-4">
                  Create the main questionnaire first. After that, you can add
                  domains and questions.
                </p>

                <form onSubmit={handleCreateQuestionnaire}>
                  <div className="row g-3">
                    <div className="col-lg-5">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        name="title"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="CareAble Skills Assessment"
                        required
                      />
                    </div>

                    <div className="col-lg-7">
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <input
                        name="description"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Short description"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-4 px-4"
                    disabled={savingQuestionnaire}
                  >
                    {savingQuestionnaire
                      ? "Creating..."
                      : "Create Questionnaire"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {questionnaire && activePanel === "domain" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4">
                  <h3 className="fw-bold text-primary mb-1">Create Domain</h3>
                  <p className="text-muted mb-0">
                    Domains are the ribbon sections carers will see during their
                    assessment.
                  </p>
                </div>

                <form onSubmit={handleCreateDomain}>
                  <div className="row g-3">
                    <div className="col-lg-5">
                      <label className="form-label fw-semibold">
                        Domain Title
                      </label>
                      <input
                        name="title"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Example: Communication"
                        required
                      />
                    </div>

                    <div className="col-lg-7">
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <input
                        name="description"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Short explanation of this skill area"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-4 px-4"
                    disabled={savingDomain}
                  >
                    {savingDomain ? "Creating..." : "Create Domain"}
                  </button>
                </form>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">Created Domains</h5>

                <div className="d-flex flex-wrap gap-2">
                  {questionnaire.domains.map((domain) => (
                    <span
                      key={domain.id}
                      className="badge rounded-pill bg-light text-dark border px-3 py-2"
                    >
                      {domain.title}
                    </span>
                  ))}

                  {questionnaire.domains.length === 0 && (
                    <span className="text-muted">No domains created yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {questionnaire && activePanel === "question" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <div className="mb-4">
                  <h3 className="fw-bold text-primary mb-1">
                    Create Question
                  </h3>
                  <p className="text-muted mb-0">
                    New questions are hidden first. The creator or super admin
                    can make them visible after review.
                  </p>
                </div>

                {questionnaire.domains.length === 0 ? (
                  <div className="alert alert-warning mb-0">
                    Please create at least one domain before adding questions.
                  </div>
                ) : (
                  <form onSubmit={handleCreateQuestion}>
                    <div className="row g-3">
                      <div className="col-lg-4">
                        <label className="form-label fw-semibold">
                          Select Domain
                        </label>
                        <select
                          className="form-select form-select-lg"
                          value={selectedDomainId}
                          onChange={(event) =>
                            setSelectedDomainId(event.target.value)
                          }
                          required
                        >
                          {questionnaire.domains.map((domain) => (
                            <option key={domain.id} value={domain.id}>
                              {domain.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-4">
                        <label className="form-label fw-semibold">
                          Question Type
                        </label>
                        <select
                          name="type"
                          className="form-select form-select-lg"
                          defaultValue="LIKERT_1_5"
                        >
                          <option value="LIKERT_1_5">Rating 1 to 5</option>
                          <option value="YES_NO">Yes / No</option>
                          <option value="TEXT">Written Answer</option>
                        </select>
                      </div>

                      <div className="col-lg-4 d-flex align-items-end">
                        <div className="form-check mb-2">
                          <input
                            name="isRequired"
                            className="form-check-input"
                            type="checkbox"
                            id="isRequired"
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="isRequired"
                          >
                            Required question
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Question
                        </label>
                        <textarea
                          name="prompt"
                          className="form-control"
                          rows={4}
                          placeholder="Example: I can communicate clearly with health professionals and family members."
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Help Text
                        </label>
                        <textarea
                          name="helpText"
                          className="form-control"
                          rows={3}
                          placeholder="Optional guidance shown with the question"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary mt-4 px-4"
                      disabled={savingQuestion}
                    >
                      {savingQuestion ? "Adding..." : "Add Question"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {questionnaire && activePanel === "existing" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
                  <div>
                    <h3 className="fw-bold text-primary mb-1">
                      Existing Questions
                    </h3>
                    <p className="text-muted mb-0">
                      Show, hide, or delete questions without removing database
                      history.
                    </p>
                  </div>

                  <div className="d-flex flex-column flex-md-row gap-2">
                    <div style={{ minWidth: "220px" }}>
                      <label className="form-label fw-semibold">
                        Filter by Domain
                      </label>
                      <select
                        className="form-select"
                        value={domainFilter}
                        onChange={(event) =>
                          setDomainFilter(event.target.value)
                        }
                      >
                        <option value="all">All domains</option>
                        {questionnaire.domains.map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ minWidth: "180px" }}>
                      <label className="form-label fw-semibold">View</label>
                      <select
                        className="form-select"
                        value={questionFilter}
                        onChange={(event) =>
                          setQuestionFilter(
                            event.target.value as QuestionFilter
                          )
                        }
                      >
                        <option value="active">Visible only</option>
                        <option value="all">Show all</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Domain</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Created By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredQuestions.map((question) => (
                        <tr key={question.id}>
                          <td style={{ minWidth: "320px" }}>
                            <div className="fw-semibold">
                              {question.prompt}
                            </div>
                            {question.helpText && (
                              <small className="text-muted">
                                {question.helpText}
                              </small>
                            )}
                          </td>

                          <td>
                            <span className="badge bg-light text-dark border">
                              {question.domainTitle}
                            </span>
                          </td>

                          <td>{questionStatus(question)}</td>

                          <td>{question.type}</td>

                          <td>
                            {question.isRequired ? (
                              <span className="badge bg-success">Yes</span>
                            ) : (
                              <span className="badge bg-secondary">No</span>
                            )}
                          </td>

                          <td>{fullName(question.createdBy)}</td>

                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              {!question.deletedAt && (
                                <button
                                  type="button"
                                  className={`btn btn-sm ${
                                    question.isVisible
                                      ? "btn-outline-warning"
                                      : "btn-outline-success"
                                  }`}
                                  disabled={updatingQuestionId === question.id}
                                  onClick={() =>
                                    handleQuestionAction(
                                      question.id,
                                      "toggle-visibility"
                                    )
                                  }
                                >
                                  {question.isVisible ? "Hide" : "Show"}
                                </button>
                              )}

                              {!question.deletedAt && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  disabled={updatingQuestionId === question.id}
                                  onClick={() => {
                                    const confirmed = window.confirm(
                                      "Are you sure you want to delete this question? It will be hidden from carers but kept in the database history."
                                    );

                                    if (!confirmed) {
                                      return;
                                    }

                                    handleQuestionAction(
                                      question.id,
                                      "soft-delete"
                                    );
                                  }}
                                >
                                  Delete
                                </button>
                              )}

                              {question.deletedAt && (
                                <span className="text-muted small">
                                  No actions
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredQuestions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-muted">
                            No questions found for this selection.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
