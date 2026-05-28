"use client";

import { useState } from "react";
import CapabilityFieldMap, { type DomainAnalytics } from "./CapabilityFieldMap";
import OutcomeMatrix from "./OutcomeMatrix";
import RidgelineChart from "./RidgelineChart";

type AnalyticsTabsProps = {
  domains: DomainAnalytics[];
};

type AnalyticsTab = "field" | "ridgeline" | "matrix";

export default function AnalyticsTabs({ domains }: AnalyticsTabsProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("field");

  return (
    <>
      <style jsx>{`
        .analytics-visuals {
          background: #ffffff;
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          overflow: hidden;
        }

        .tabs-header {
          background: #f7f9fc;
          border-bottom: 1px solid #e0e8f4;
          padding: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tab-button {
          border: 1px solid transparent;
          background: transparent;
          border-radius: 7px;
          color: #52667a;
          font-weight: 600;
          padding: 10px 16px;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .tab-button:hover {
          background: #edf4ff;
          color: #0d6efd;
        }

        .tab-button-active {
          color: #0d6efd;
          background: #ffffff;
          border-color: #cadcff;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.08);
        }

        .visual-content {
          padding: 26px;
        }

        .visual-heading {
          margin-bottom: 22px;
        }

        .visual-heading h2 {
          color: #102a43;
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .visual-heading p {
          color: #66788a;
          margin-bottom: 0;
        }

        @media (max-width: 767px) {
          .tab-button {
            flex: 1 1 100%;
          }

          .visual-content {
            padding: 18px;
          }
        }
      `}</style>

      <section className="analytics-visuals">
        <div className="tabs-header" role="tablist" aria-label="Analytics views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "field"}
            className={`tab-button ${
              activeTab === "field" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("field")}
          >
            Capability Field Map
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ridgeline"}
            className={`tab-button ${
              activeTab === "ridgeline" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("ridgeline")}
          >
            Score Distribution
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "matrix"}
            className={`tab-button ${
              activeTab === "matrix" ? "tab-button-active" : ""
            }`}
            onClick={() => setActiveTab("matrix")}
          >
            Outcome Matrix
          </button>
        </div>

        {activeTab === "field" && (
          <div className="visual-content" role="tabpanel">
            <div className="visual-heading">
              <h2>Capability Field Map</h2>
              <p>
                A view of domain outcomes. Hotter zones indicate
                stronger capability results; cooler zones highlight support
                priorities.
              </p>
            </div>

            <CapabilityFieldMap domains={domains} />
          </div>
        )}

        {activeTab === "ridgeline" && (
          <div className="visual-content" role="tabpanel">
            <div className="visual-heading">
              <h2>Score Distribution Ridgeline</h2>
              <p>
                Explore where completed carer scores cluster across the 1 to 5
                confidence scale for each domain.
              </p>
            </div>

            <RidgelineChart domains={domains} />
          </div>
        )}

        {activeTab === "matrix" && (
          <div className="visual-content" role="tabpanel">
            <div className="visual-heading">
              <h2>Outcome Matrix</h2>
              <p>
                Compare the percentage of strength, growth, and support results
                recorded for each assessment domain.
              </p>
            </div>

            <OutcomeMatrix domains={domains} />
          </div>
        )}
      </section>
    </>
  );
}