"use client";

import { useMemo, useState } from "react";

export type ScoreDistribution = {
  score: number;
  count: number;
};

export type DomainAnalytics = {
  domainId: string;
  domainTitle: string;
  averageScore: number;
  completedCarers: number;
  strengthCount: number;
  growthCount: number;
  supportCount: number;
  strengthPercent: number;
  growthPercent: number;
  supportPercent: number;
  scoreDistribution: ScoreDistribution[];
};

type CarePathwayHeatmapProps = {
  domains: DomainAnalytics[];
};

type PathPosition = {
  x: number;
  y: number;
};

const pathwayPositions: PathPosition[] = [
  { x: 116, y: 118 },
  { x: 282, y: 82 },
  { x: 462, y: 116 },
  { x: 630, y: 76 },
  { x: 724, y: 190 },
  { x: 612, y: 294 },
  { x: 434, y: 334 },
  { x: 266, y: 290 },
  { x: 120, y: 342 },
  { x: 92, y: 224 },
  { x: 286, y: 190 },
  { x: 472, y: 222 },
];

function getPathPosition(index: number): PathPosition {
  if (index < pathwayPositions.length) {
    return pathwayPositions[index];
  }

  const additionalIndex = index - pathwayPositions.length;
  const column = additionalIndex % 4;
  const row = Math.floor(additionalIndex / 4);

  return {
    x: 150 + column * 165,
    y: 125 + (row % 3) * 92,
  };
}

function getHeatDetails(score: number) {
  if (score >= 4) {
    return {
      inner: "#16a34a",
      middle: "#4ade80",
      outer: "#bbf7d0",
      label: "Strength",
      badgeClass: "status-strength",
      meaning: "Strong demonstrated capability",
    };
  }

  if (score >= 3) {
    return {
      inner: "#f59e0b",
      middle: "#facc15",
      outer: "#fef3c7",
      label: "Growth",
      badgeClass: "status-growth",
      meaning: "Developing capability",
    };
  }

  return {
    inner: "#dc2626",
    middle: "#fb7185",
    outer: "#fecdd3",
    label: "Support",
    badgeClass: "status-support",
    meaning: "Support opportunity",
  };
}

export default function CapabilityFieldMap({
  domains,
}: CarePathwayHeatmapProps) {
  const [selectedDomainId, setSelectedDomainId] = useState(
    domains[0]?.domainId || ""
  );
  const [hoveredDomainId, setHoveredDomainId] = useState("");

  const activeDomainId = hoveredDomainId || selectedDomainId;

  const activeDomain = useMemo(() => {
    return (
      domains.find((domain) => domain.domainId === activeDomainId) ||
      domains[0] ||
      null
    );
  }, [domains, activeDomainId]);

  if (domains.length === 0) {
    return (
      <div className="pathway-empty">
        No completed assessment data is available for the care pathway heatmap.
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .pathway-layout {
          display: grid;
          grid-template-columns: minmax(500px, 1.75fr) minmax(270px, 0.9fr);
          gap: 22px;
          align-items: stretch;
        }

        .pathway-canvas {
          position: relative;
          min-height: 480px;
          overflow: hidden;
          border: 1px solid #dce7f5;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #f6fbff 0%,
            #edf5ff 52%,
            #f7fbff 100%
          );
        }

        .pathway-svg {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 480px;
        }

        .details-panel {
          display: flex;
          flex-direction: column;
          background: #f8faff;
          border: 1px solid #e0e8f4;
          border-radius: 10px;
          padding: 18px;
        }

        .panel-label {
          color: #0d6efd;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 5px;
        }

        .panel-copy {
          color: #66788a;
          font-size: 0.85rem;
          line-height: 1.48;
          margin-bottom: 18px;
        }

        .domain-list {
          display: grid;
          gap: 7px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 2px;
          margin-bottom: 18px;
        }

        .domain-button {
          border: 1px solid #e1eaf6;
          border-radius: 7px;
          background: #ffffff;
          padding: 9px 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          text-align: left;
          transition:
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .domain-button:hover,
        .domain-button-hovered {
          background: #f3ecff;
          border-color: #b79af5;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.12);
        }

        .domain-button-selected {
          background: #eef5ff;
          border-color: #98c0ff;
        }

        .domain-button:hover .domain-number,
        .domain-button-hovered .domain-number {
          color: #ffffff;
          background: #7c3aed;
        }

        .domain-button-selected .domain-number {
          color: #ffffff;
          background: #0d6efd;
        }

        .domain-number {
          width: 24px;
          height: 24px;
          flex: 0 0 24px;
          border-radius: 999px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          color: #0d6efd;
          background: #e7f0ff;
          font-size: 0.7rem;
          font-weight: 700;
          transition:
            color 0.18s ease,
            background 0.18s ease;
        }

        .domain-name {
          color: #102a43;
          font-size: 0.8rem;
          line-height: 1.3;
          font-weight: 600;
        }

        .selected-summary {
          margin-top: auto;
          border-top: 1px solid #e0e8f4;
          padding-top: 16px;
        }

        .selected-title {
          color: #102a43;
          font-weight: 700;
          line-height: 1.34;
          margin-bottom: 10px;
        }

        .score-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
        }

        .score-number {
          color: #102a43;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .status-badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.28rem 0.7rem;
          font-size: 0.71rem;
          font-weight: 700;
        }

        .status-strength {
          background: #dcfce7;
          color: #166534;
        }

        .status-growth {
          background: #fef3c7;
          color: #92400e;
        }

        .status-support {
          background: #fee2e2;
          color: #991b1b;
        }

        .meaning {
          color: #66788a;
          font-size: 0.78rem;
          margin-bottom: 13px;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }

        .stat-box {
          border: 1px solid #e1eaf6;
          border-radius: 7px;
          background: #ffffff;
          text-align: center;
          padding: 8px 4px;
        }

        .stat-box strong {
          display: block;
          color: #102a43;
          font-size: 0.84rem;
        }

        .stat-box span {
          color: #66788a;
          font-size: 0.64rem;
        }

        .pathway-empty {
          border: 1px dashed #d5e0ed;
          border-radius: 8px;
          padding: 38px;
          text-align: center;
          color: #66788a;
        }

        @media (max-width: 991px) {
          .pathway-layout {
            grid-template-columns: 1fr;
          }

          .pathway-canvas,
          .pathway-svg {
            min-height: 390px;
          }

          .domain-list {
            max-height: none;
          }
        }

        @media (max-width: 575px) {
          .pathway-canvas,
          .pathway-svg {
            min-height: 290px;
          }
        }
      `}</style>

      <div className="pathway-layout">
        <div className="pathway-canvas">
          <svg
            viewBox="0 0 820 440"
            className="pathway-svg"
            role="img"
            aria-label="Care pathway capability heatmap"
          >
            <defs>
              {domains.map((domain, index) => {
                const heat = getHeatDetails(domain.averageScore);

                return (
                  <radialGradient
                    key={domain.domainId}
                    id={`care-heat-${index}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop
                      offset="0%"
                      stopColor={heat.inner}
                      stopOpacity="0.92"
                    />
                    <stop
                      offset="32%"
                      stopColor={heat.middle}
                      stopOpacity="0.72"
                    />
                    <stop
                      offset="68%"
                      stopColor={heat.outer}
                      stopOpacity="0.34"
                    />
                    <stop
                      offset="100%"
                      stopColor={heat.outer}
                      stopOpacity="0"
                    />
                  </radialGradient>
                );
              })}

              <filter id="heat-soften">
                <feGaussianBlur stdDeviation="18" />
              </filter>

              <linearGradient id="journey-line" x1="0" x2="1">
                <stop offset="0%" stopColor="#91bfff" />
                <stop offset="50%" stopColor="#4f94fa" />
                <stop offset="100%" stopColor="#91bfff" />
              </linearGradient>
            </defs>

            <text
              x="38"
              y="38"
              fill="#102a43"
              fontSize="16"
              fontWeight="700"
            >
              Care Recognition Journey
            </text>

            <text x="38" y="59" fill="#66788a" fontSize="11">
              Capability heat zones mapped across lived care skills
            </text>

            <path
              d="M 78 212 C 110 106, 200 82, 280 98
                 C 366 114, 400 168, 458 168
                 C 537 168, 565 78, 652 92
                 C 755 108, 763 218, 695 262
                 C 626 307, 551 317, 463 331
                 C 353 349, 288 292, 220 309
                 C 129 332, 70 299, 78 212"
              fill="none"
              stroke="#d5e6fd"
              strokeWidth="50"
              strokeLinecap="round"
              opacity="0.55"
            />

            <path
              d="M 78 212 C 110 106, 200 82, 280 98
                 C 366 114, 400 168, 458 168
                 C 537 168, 565 78, 652 92
                 C 755 108, 763 218, 695 262
                 C 626 307, 551 317, 463 331
                 C 353 349, 288 292, 220 309
                 C 129 332, 70 299, 78 212"
              fill="none"
              stroke="url(#journey-line)"
              strokeWidth="3"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />

            {domains.map((domain, index) => {
              const position = getPathPosition(index);
              const radius = 62 + domain.averageScore * 8;

              return (
                <ellipse
                  key={`${domain.domainId}-heat`}
                  cx={position.x}
                  cy={position.y}
                  rx={radius}
                  ry={radius * 0.86}
                  fill={`url(#care-heat-${index})`}
                  filter="url(#heat-soften)"
                />
              );
            })}

            <circle
              cx="403"
              cy="219"
              r="75"
              fill="#ffffff"
              stroke="#dce8fa"
              strokeWidth="2"
            />

            <text
              x="403"
              y="207"
              textAnchor="middle"
              fill="#0d6efd"
              fontSize="12"
              fontWeight="700"
            >
              CAREABLE
            </text>

            <text
              x="403"
              y="226"
              textAnchor="middle"
              fill="#102a43"
              fontSize="13"
              fontWeight="700"
            >
              Skills
            </text>

            <text
              x="403"
              y="243"
              textAnchor="middle"
              fill="#66788a"
              fontSize="10"
            >
              Recognition
            </text>

            {domains.map((domain, index) => {
              const position = getPathPosition(index);
              const isSelected = domain.domainId === selectedDomainId;
              const isHovered = domain.domainId === hoveredDomainId;

              const markerFill = isHovered
                ? "#7c3aed"
                : isSelected
                  ? "#0d6efd"
                  : "#ffffff";

              const markerStroke = isHovered ? "#7c3aed" : "#0d6efd";

              const markerText = isHovered || isSelected ? "#ffffff" : "#0d6efd";

              return (
                <g
                  key={`${domain.domainId}-point`}
                  onMouseEnter={() => setHoveredDomainId(domain.domainId)}
                  onMouseLeave={() => setHoveredDomainId("")}
                  onClick={() => setSelectedDomainId(domain.domainId)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isHovered ? 18 : isSelected ? 17 : 14}
                    fill={markerFill}
                    stroke={markerStroke}
                    strokeWidth="2.5"
                  />

                  <text
                    x={position.x}
                    y={position.y + 4}
                    fill={markerText}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {index + 1}
                  </text>
                </g>
              );
            })}

            <g>
              <circle cx="50" cy="404" r="9" fill="#16a34a" />
              <text x="66" y="408" fill="#52667a" fontSize="11">
                Strength
              </text>

              <circle cx="135" cy="404" r="9" fill="#f59e0b" />
              <text x="151" y="408" fill="#52667a" fontSize="11">
                Growth
              </text>

              <circle cx="218" cy="404" r="9" fill="#dc2626" />
              <text x="234" y="408" fill="#52667a" fontSize="11">
                Support
              </text>

              <circle cx="308" cy="404" r="9" fill="#7c3aed" />
              <text x="324" y="408" fill="#52667a" fontSize="11">
                Hovered
              </text>
            </g>
          </svg>
        </div>

        <aside className="details-panel">
          <div className="panel-label">Capability Domains</div>

          <p className="panel-copy">
            Select a heat zone to view the result recorded for that care skill
            domain.
          </p>

          <div className="domain-list">
            {domains.map((domain, index) => {
              const isSelected = domain.domainId === selectedDomainId;
              const isHovered = domain.domainId === hoveredDomainId;

              return (
                <button
                  key={domain.domainId}
                  type="button"
                  className={`domain-button ${
                    isHovered ? "domain-button-hovered" : ""
                  } ${isSelected && !isHovered ? "domain-button-selected" : ""}`}
                  onMouseEnter={() => setHoveredDomainId(domain.domainId)}
                  onMouseLeave={() => setHoveredDomainId("")}
                  onClick={() => setSelectedDomainId(domain.domainId)}
                >
                  <span className="domain-number">{index + 1}</span>
                  <span className="domain-name">{domain.domainTitle}</span>
                </button>
              );
            })}
          </div>

          {activeDomain && (
            <div className="selected-summary">
              <div className="selected-title">{activeDomain.domainTitle}</div>

              <div className="score-line">
                <span className="score-number">
                  {activeDomain.averageScore.toFixed(1)} / 5
                </span>

                <span
                  className={`status-badge ${
                    getHeatDetails(activeDomain.averageScore).badgeClass
                  }`}
                >
                  {getHeatDetails(activeDomain.averageScore).label}
                </span>
              </div>

              <p className="meaning">
                {getHeatDetails(activeDomain.averageScore).meaning}
              </p>

              <div className="stat-grid">
                <div className="stat-box">
                  <strong>{activeDomain.strengthPercent}%</strong>
                  <span>Strength</span>
                </div>

                <div className="stat-box">
                  <strong>{activeDomain.growthPercent}%</strong>
                  <span>Growth</span>
                </div>

                <div className="stat-box">
                  <strong>{activeDomain.supportPercent}%</strong>
                  <span>Support</span>
                </div>
              </div>

              <p className="text-muted small mb-0 mt-3">
                Based on {activeDomain.completedCarers} completed assessment
                {activeDomain.completedCarers === 1 ? "" : "s"}.
              </p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}