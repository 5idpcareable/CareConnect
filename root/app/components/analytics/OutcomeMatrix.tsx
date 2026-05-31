"use client";

import { useState } from "react";
import type { DomainAnalytics } from "./CapabilityFieldMap";

type OutcomeMatrixProps = {
  domains: DomainAnalytics[];
};

function cellBackground(
  type: "strength" | "growth" | "support",
  percentage: number
) {
  const opacity = Math.max(0.1, percentage / 100);

  if (type === "strength") {
    return `rgba(16, 143, 82, ${opacity})`;
  }

  if (type === "growth") {
    return `rgba(13, 110, 253, ${opacity})`;
  }

  return `rgba(232, 166, 18, ${opacity})`;
}

function cellColour(percentage: number) {
  return percentage >= 52 ? "#ffffff" : "#102a43";
}

export default function OutcomeMatrix({ domains }: OutcomeMatrixProps) {
  const [selectedDomainId, setSelectedDomainId] = useState(
    domains[0]?.domainId || ""
  );

  const selectedDomain =
    domains.find((domain) => domain.domainId === selectedDomainId) ||
    domains[0] ||
    null;

  if (domains.length === 0) {
    return (
      <div className="matrix-empty">
        No completed assessment data is available for the outcome matrix.
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .matrix-layout {
          display: grid;
          grid-template-columns: minmax(470px, 1.7fr) minmax(260px, 0.8fr);
          gap: 22px;
        }

        .matrix-grid {
          display: grid;
          grid-template-columns:
            minmax(220px, 1.4fr)
            repeat(3, minmax(92px, 0.7fr));
          align-items: stretch;
          gap: 7px;
        }

        .matrix-row {
          display: contents;
        }

        .matrix-heading {
          color: #66788a;
          font-size: 0.72rem;
          text-transform: uppercase;
          font-weight: 700;
          padding: 9px 10px;
          text-align: center;
        }

        .matrix-heading:first-child {
          text-align: left;
        }

        .domain-button {
          border: 1px solid #e3ebf5;
          border-radius: 7px;
          background: #ffffff;
          color: #102a43;
          padding: 10px 12px;
          font-weight: 600;
          text-align: left;
          line-height: 1.3;
          transition: border-color 0.18s ease, background 0.18s ease;
        }

        .domain-button:hover,
        .domain-button-active {
          border-color: #0d6efd;
          background: #f4f8ff;
        }

        .matrix-cell {
          border: 0;
          border-radius: 7px;
          padding: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 48px;
        }

        .matrix-panel {
          background: #f8faff;
          border: 1px solid #e0e8f4;
          border-radius: 8px;
          padding: 20px;
        }

        .panel-label {
          color: #66788a;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .panel-title {
          color: #102a43;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 18px;
        }

        .score-summary {
          border-bottom: 1px solid #dee8f5;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }

        .average-score {
          font-size: 2rem;
          font-weight: 700;
          color: #0d6efd;
        }

        .progress-row {
          margin-bottom: 14px;
        }

        .progress-row:last-child {
          margin-bottom: 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 0.8rem;
          margin-bottom: 5px;
        }

        .track {
          background: #e8eef7;
          border-radius: 999px;
          height: 8px;
          overflow: hidden;
        }

        .fill {
          height: 100%;
          border-radius: 999px;
        }

        .fill-strength {
          background: #108f52;
        }

        .fill-growth {
          background: #0d6efd;
        }

        .fill-support {
          background: #e8a612;
        }

        .matrix-empty {
          border: 1px dashed #d5e0ed;
          border-radius: 8px;
          padding: 38px;
          text-align: center;
          color: #66788a;
        }

        @media (max-width: 991px) {
          .matrix-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 575px) {
          .matrix-grid {
            grid-template-columns: minmax(135px, 1fr) repeat(3, 62px);
            gap: 4px;
          }

          .matrix-cell,
          .domain-button {
            font-size: 0.73rem;
            padding: 7px 5px;
          }
        }
      `}</style>

      <div className="matrix-layout">
        <div className="matrix-grid">
          <div className="matrix-heading">Domain</div>
          <div className="matrix-heading">Strength</div>
          <div className="matrix-heading">Growth</div>
          <div className="matrix-heading">Support</div>

          {domains.map((domain) => (
            <div key={domain.domainId} className="matrix-row">
              <button
                type="button"
                className={`domain-button ${
                  selectedDomain?.domainId === domain.domainId
                    ? "domain-button-active"
                    : ""
                }`}
                onClick={() => setSelectedDomainId(domain.domainId)}
              >
                {domain.domainTitle}
              </button>

              <button
                type="button"
                className="matrix-cell"
                style={{
                  background: cellBackground(
                    "strength",
                    domain.strengthPercent
                  ),
                  color: cellColour(domain.strengthPercent),
                }}
                onClick={() => setSelectedDomainId(domain.domainId)}
              >
                {domain.strengthPercent}%
              </button>

              <button
                type="button"
                className="matrix-cell"
                style={{
                  background: cellBackground("growth", domain.growthPercent),
                  color: cellColour(domain.growthPercent),
                }}
                onClick={() => setSelectedDomainId(domain.domainId)}
              >
                {domain.growthPercent}%
              </button>

              <button
                type="button"
                className="matrix-cell"
                style={{
                  background: cellBackground("support", domain.supportPercent),
                  color: cellColour(domain.supportPercent),
                }}
                onClick={() => setSelectedDomainId(domain.domainId)}
              >
                {domain.supportPercent}%
              </button>
            </div>
          ))}
        </div>

        {selectedDomain && (
          <aside className="matrix-panel">
            <div className="panel-label">Selected Domain</div>
            <div className="panel-title">{selectedDomain.domainTitle}</div>

            <div className="score-summary">
              <small className="text-muted d-block">Average Score</small>

              <span className="average-score">
                {selectedDomain.averageScore.toFixed(1)}
              </span>

              <span className="text-muted"> / 5</span>

              <small className="text-muted d-block mt-2">
                {selectedDomain.completedCarers} completed carer
                {selectedDomain.completedCarers === 1 ? "" : "s"}
              </small>
            </div>

            <div className="progress-row">
              <div className="progress-header">
                <span>Strength area</span>
                <strong>{selectedDomain.strengthPercent}%</strong>
              </div>

              <div className="track">
                <div
                  className="fill fill-strength"
                  style={{ width: `${selectedDomain.strengthPercent}%` }}
                />
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-header">
                <span>Growth area</span>
                <strong>{selectedDomain.growthPercent}%</strong>
              </div>

              <div className="track">
                <div
                  className="fill fill-growth"
                  style={{ width: `${selectedDomain.growthPercent}%` }}
                />
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-header">
                <span>Support area</span>
                <strong>{selectedDomain.supportPercent}%</strong>
              </div>

              <div className="track">
                <div
                  className="fill fill-support"
                  style={{ width: `${selectedDomain.supportPercent}%` }}
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}