"use client";

export default function LandingPageStyles() {
  return (
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }

      .landing-page {
        min-height: 100vh;
        color: #14263d;
        background: linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%);
        overflow-x: hidden;
      }

      .landing-page .btn-careable {
        background: #2563eb;
        border: 1px solid #2563eb;
        color: #ffffff;
        transition: transform 0.18s ease, background 0.18s ease;
      }

      .landing-page .btn-careable:hover {
        background: #1d4ed8;
        border-color: #1d4ed8;
        color: #ffffff;
        transform: translateY(-1px);
      }

      .landing-page .btn-outline-careable {
        border: 1px solid #bfd2ff;
        color: #2563eb;
        background: #ffffff;
      }

      .landing-page .btn-outline-careable:hover {
        background: #edf4ff;
        border-color: #2563eb;
        color: #2563eb;
      }

      .hero-section {
        position: relative;
        padding: 74px 0 94px;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid #d5e3ff;
        border-radius: 999px;
        background: #ffffff;
        color: #2563eb;
        padding: 9px 15px;
        font-size: 0.82rem;
        font-weight: 700;
        box-shadow: 0 6px 18px rgba(37, 99, 235, 0.06);
      }

      .badge-dot {
        width: 8px;
        height: 8px;
        flex-shrink: 0;
        background: #f59e0b;
        border-radius: 50%;
      }

      .hero-title {
        color: #10233f;
        font-size: clamp(2.35rem, 5vw, 3.75rem);
        line-height: 1.08;
        font-weight: 800;
        margin: 22px 0 20px;
        letter-spacing: 0;
      }

      .hero-copy {
        color: #5b6b82;
        font-size: 1.08rem;
        line-height: 1.7;
        max-width: 570px;
      }

      .assessment-note {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        flex-wrap: wrap;
        margin-top: 27px;
        padding: 11px 15px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.76);
        border: 1px solid #e1eaf7;
        color: #51647d;
        font-size: 0.88rem;
      }

      .assessment-note strong {
        color: #14263d;
      }

      .hero-visual {
        position: relative;
        min-height: 560px;
      }

      .image-panel {
        position: absolute;
        right: 0;
        top: 8px;
        width: 83%;
        height: 494px;
        border-radius: 24px;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 28px 62px rgba(23, 50, 86, 0.16);
      }

      .image-panel img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 42%,
          rgba(8, 34, 64, 0.42) 100%
        );
      }

      .dashboard-float,
      .certificate-float,
      .progress-float {
        position: absolute;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(15px);
        border: 1px solid #e4ebf5;
        border-radius: 14px;
        box-shadow: 0 16px 35px rgba(15, 35, 68, 0.12);
        animation: landingFloat 5s ease-in-out infinite;
      }

      .dashboard-float {
        left: 0;
        top: 90px;
        width: 202px;
        padding: 16px;
      }

      .certificate-float {
        right: -12px;
        bottom: 48px;
        width: 184px;
        padding: 15px;
        animation-delay: 1.2s;
      }

      .progress-float {
        left: 54px;
        bottom: 28px;
        width: 225px;
        padding: 15px;
        animation-delay: 0.6s;
      }

      .tiny-label {
        color: #64748b;
        font-size: 0.68rem;
        text-transform: uppercase;
        font-weight: 700;
      }

      .score-value {
        color: #10233f;
        font-size: 1.55rem;
        font-weight: 800;
      }

      .heat-row {
        display: flex;
        gap: 4px;
        margin-top: 11px;
      }

      .heat-cell {
        height: 21px;
        flex: 1;
        border-radius: 4px;
      }

      .stats-section {
        position: relative;
        margin-top: -30px;
      }

      .stats-card {
        border: 1px solid #e2eaf6;
        background: rgba(255, 255, 255, 0.91);
        backdrop-filter: blur(14px);
        border-radius: 16px;
        padding: 25px 14px;
        box-shadow: 0 14px 32px rgba(16, 42, 67, 0.06);
      }

      .stat-number {
        color: #2563eb;
        font-size: 2rem;
        font-weight: 800;
      }

      .stat-label {
        color: #64748b;
        font-size: 0.91rem;
      }

      .live-label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #64748b;
        font-size: 0.76rem;
        margin-top: 8px;
      }

      .live-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #16a34a;
      }

      .landing-section {
        padding: 88px 0;
      }

      .section-tag {
        color: #2563eb;
        font-size: 0.78rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      .section-title {
        color: #10233f;
        font-size: clamp(1.9rem, 3vw, 2.65rem);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: 0;
      }

      .section-copy {
        color: #64748b;
        line-height: 1.7;
        max-width: 660px;
      }

      .feature-card {
        height: 100%;
        border: 1px solid #e4ebf5;
        background: rgba(255, 255, 255, 0.84);
        border-radius: 12px;
        padding: 26px;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          border-color 0.2s ease;
      }

      .feature-card:hover {
        transform: translateY(-5px);
        border-color: #c2d7ff;
        box-shadow: 0 20px 42px rgba(37, 99, 235, 0.09);
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #2563eb;
        font-size: 0.82rem;
        font-weight: 800;
        background: linear-gradient(135deg, #e5efff, #fff3d7);
        margin-bottom: 19px;
      }

      .feature-title {
        font-size: 1.08rem;
        font-weight: 700;
        color: #10233f;
      }

      .active-assessment-panel {
        background: #ffffff;
        border: 1px solid #e1eaf7;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 14px 34px rgba(15, 35, 68, 0.05);
      }

      .domain-pill {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        border: 1px solid #e4ebf5;
        border-radius: 10px;
        background: #f8fbff;
        color: #193451;
        padding: 13px 15px;
        margin-bottom: 9px;
        font-weight: 600;
      }

      .domain-pill span:last-child {
        color: #64748b;
        font-size: 0.82rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .solution-image {
        position: relative;
        min-height: 555px;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 20px 46px rgba(15, 35, 68, 0.12);
      }

      .solution-image img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .solution-caption {
        position: absolute;
        bottom: 22px;
        left: 22px;
        right: 22px;
        padding: 18px;
        color: #ffffff;
        border-radius: 10px;
        background: rgba(15, 35, 68, 0.7);
        backdrop-filter: blur(8px);
      }

      .challenge-card {
        position: relative;
        border: 1px solid #e4ebf5;
        background: #ffffff;
        border-radius: 10px;
        padding: 17px 18px 17px 52px;
        margin-bottom: 12px;
      }

      .challenge-card.solution {
        border-color: #bed6ff;
        background: #f3f8ff;
      }

      .challenge-marker {
        position: absolute;
        left: 18px;
        top: 20px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 4px solid #dce8fb;
        background: #2563eb;
      }

      .challenge-card.solution .challenge-marker {
        background: #f59e0b;
      }

      .process-wrap {
        position: relative;
      }

      .process-card {
        position: relative;
        height: 100%;
        text-align: center;
        padding: 0 12px;
      }

      .process-icon {
        position: relative;
        z-index: 2;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #ffffff;
        border: 2px solid #d7e5ff;
        color: #2563eb;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-weight: 800;
        margin-bottom: 18px;
        box-shadow: 0 8px 19px rgba(37, 99, 235, 0.08);
      }

      .process-line {
        position: absolute;
        z-index: 1;
        top: 30px;
        left: 10%;
        right: 10%;
        height: 2px;
        background: linear-gradient(90deg, #dbe8ff, #2563eb, #dbe8ff);
      }

      .testimonial-card {
        height: 100%;
        background: #ffffff;
        border: 1px solid #e4ebf5;
        border-radius: 12px;
        padding: 27px;
        box-shadow: 0 12px 28px rgba(15, 35, 68, 0.04);
      }

      .quote-mark {
        color: #f59e0b;
        font-size: 2rem;
        line-height: 1;
        font-weight: 800;
      }

      .cta-panel {
        border-radius: 18px;
        padding: 62px 28px;
        color: #ffffff;
        background: linear-gradient(115deg, #1d4ed8, #2563eb 62%, #397cff);
        box-shadow: 0 24px 52px rgba(37, 99, 235, 0.2);
      }

      .fade-up {
        animation: landingFadeUp 0.65s ease both;
      }

      .delay-2 {
        animation-delay: 0.2s;
      }

      .loading-screen {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f8fafc;
      }

      @keyframes landingFadeUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes landingFloat {
        0%,
        100% {
          transform: translateY(0);
        }

        50% {
          transform: translateY(-8px);
        }
      }

      @media (max-width: 991px) {
        .hero-section {
          padding: 50px 0 62px;
        }

        .hero-visual {
          margin-top: 44px;
          min-height: 484px;
        }

        .image-panel {
          position: relative;
          width: 100%;
          height: 430px;
        }

        .dashboard-float {
          left: 8px;
        }

        .certificate-float {
          right: 8px;
        }

        .progress-float {
          left: 24px;
        }

        .process-line {
          display: none;
        }
      }

      @media (max-width: 575px) {
        .hero-title {
          font-size: 2.18rem;
        }

        .hero-visual {
          min-height: 405px;
        }

        .image-panel {
          height: 365px;
          border-radius: 18px;
        }

        .dashboard-float {
          width: 160px;
          padding: 12px;
        }

        .certificate-float {
          width: 148px;
          bottom: 8px;
        }

        .progress-float {
          display: none;
        }

        .landing-section {
          padding: 62px 0;
        }

        .solution-image {
          min-height: 420px;
        }

        .cta-panel {
          padding: 46px 22px;
        }
      }
    `}</style>
  );
}