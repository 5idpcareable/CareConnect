"use client";

import type { DomainAnalytics } from "./CapabilityFieldMap";

type RidgelineChartProps = {
  domains: DomainAnalytics[];
};

function outcomeColour(score: number) {
  if (score >= 4) {
    return {
      stroke: "#108f52",
      fill: "rgba(16, 143, 82, 0.2)",
      label: "Strength",
      badgeClass: "ridge-strength",
    };
  }

  if (score >= 3) {
    return {
      stroke: "#0d6efd",
      fill: "rgba(13, 110, 253, 0.18)",
      label: "Growth",
      badgeClass: "ridge-growth",
    };
  }

  return {
    stroke: "#d49308",
    fill: "rgba(232, 166, 18, 0.22)",
    label: "Support",
    badgeClass: "ridge-support",
  };
}

function createRidgePath(domain: DomainAnalytics) {
  const baseline = 62;
  const positions = [24, 112, 200, 288, 376];
  const maximumCount = Math.max(
    ...domain.scoreDistribution.map((distribution) => distribution.count),
    1
  );

  const points = domain.scoreDistribution.map((distribution, index) => ({
    x: positions[index],
    y: baseline - (distribution.count / maximumCount) * 46,
  }));

  let path = `M ${points[0].x} ${baseline}`;
  path += ` L ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const centreX = (previous.x + current.x) / 2;

    path += ` C ${centreX} ${previous.y}, ${centreX} ${current.y}, ${current.x} ${current.y}`;
  }

  path += ` L ${points[points.length - 1].x} ${baseline} Z`;

  return path;
}

export default function RidgelineChart({ domains }: RidgelineChartProps) {
  if (domains.length === 0) {
    return (
      <div className="ridge-empty">
        No completed assessment data is available for score distribution.
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .ridge-layout {
          background: #ffffff;
        }

        .ridge-key {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 6px;
        }

        .ridge-scale {
          width: min(100%, 470px);
          display: flex;
          justify-content: space-between;
          color: #66788a;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0 28px;
        }

        .ridge-row {
          display: grid;
          grid-template-columns: minmax(220px, 290px) 1fr 105px;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #edf2f8;
          padding: 8px 0;
        }

        .ridge-row:last-child {
          border-bottom: 0;
        }

        .domain-title {
          color: #102a43;
          font-weight: 600;
          line-height: 1.34;
          margin-bottom: 3px;
        }

        .domain-meta {
          color: #66788a;
          font-size: 0.75rem;
        }

        .ridge-svg {
          width: 100%;
          height: 76px;
          display: block;
        }

        .ridge-result {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }

        .average {
          color: #102a43;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .ridge-badge {
          display: inline-flex;
          border-radius: 999px;
          padding: 0.24rem 0.62rem;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .ridge-strength {
          color: #087443;
          background: #ddf3e7;
        }

        .ridge-growth {
          color: #1556b8;
          background: #e2edff;
        }

        .ridge-support {
          color: #956100;
          background: #fff0c9;
        }

        .ridge-footnote {
          color: #66788a;
          border-top: 1px solid #edf2f8;
          padding-top: 16px;
          margin-top: 10px;
          font-size: 0.82rem;
        }

        .ridge-empty {
          border: 1px dashed #d5e0ed;
          border-radius: 8px;
          padding: 38px;
          text-align: center;
          color: #66788a;
        }

        @media (max-width: 767px) {
          .ridge-key {
            display: none;
          }

          .ridge-row {
            grid-template-columns: 1fr;
            gap: 4px;
            padding: 13px 0;
          }

          .ridge-result {
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
          }
        }
      `}</style>

      <div className="ridge-layout">
        <div className="ridge-key">
          <div className="ridge-scale">
            <span>1 - Not yet</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5 - Very confident</span>
          </div>
        </div>

        {domains.map((domain) => {
          const colour = outcomeColour(domain.averageScore);

          return (
            <div className="ridge-row" key={domain.domainId}>
              <div>
                <div className="domain-title">{domain.domainTitle}</div>
                <div className="domain-meta">
                  {domain.completedCarers} completed carer
                  {domain.completedCarers === 1 ? "" : "s"}
                </div>
              </div>

              <svg
                className="ridge-svg"
                viewBox="0 0 400 76"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${domain.domainTitle} score distribution`}
              >
                <line
                  x1="24"
                  y1="62"
                  x2="376"
                  y2="62"
                  stroke="#d8e3f0"
                  strokeWidth="1.5"
                />

                {[24, 112, 200, 288, 376].map((position, index) => (
                  <g key={position}>
                    <line
                      x1={position}
                      y1="58"
                      x2={position}
                      y2="66"
                      stroke="#b7c7da"
                    />

                    <text
                      x={position}
                      y="75"
                      textAnchor="middle"
                      fill="#66788a"
                      fontSize="9"
                    >
                      {index + 1}
                    </text>
                  </g>
                ))}

                <path
                  d={createRidgePath(domain)}
                  fill={colour.fill}
                  stroke={colour.stroke}
                  strokeWidth="2.2"
                />
              </svg>

              <div className="ridge-result">
                <span className="average">
                  {domain.averageScore.toFixed(1)} / 5
                </span>

                <span className={`ridge-badge ${colour.badgeClass}`}>
                  {colour.label}
                </span>
              </div>
            </div>
          );
        })}

        <p className="ridge-footnote mb-0">
          Curves show the distribution of completed carer domain averages across
          the 1 to 5 self-assessment scale.
        </p>
      </div>
    </>
  );
}