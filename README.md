# Orbit Foresight v2

> Predict software risks before they become production incidents.
> Executive dashboard with Failure Simulator, interactive dependency graphs, and risk heatmaps.

## Architecture

```
orbit-foresight/
├── backend/
│   ├── main.py                 # FastAPI v2 — 4 risk profiles, failure simulation
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js       # 18 animations, glass tokens
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx              # Route transitions
        ├── index.css             # Glass, glow, skeleton utilities
        ├── hooks/
        │   └── useAnalysis.js    # AbortController, timeout, presets
        ├── pages/
        │   ├── Landing.jsx       # Full funnel with Failure Simulator
        │   └── Dashboard.jsx     # Executive Dashboard with stats bar
        └── components/
            ├── Navbar.jsx
            ├── Footer.jsx
            ├── HeroSection.jsx
            ├── FeatureCards.jsx
            ├── ArchitectureSection.jsx
            ├── CTASection.jsx
            ├── FeatureRequestInput.jsx
            ├── RiskScoreGauge.jsx
            ├── ImpactCard.jsx
            ├── HistoricalIncidents.jsx
            ├── DependencyGraph.jsx     # Interactive, clickable nodes
            ├── RecommendedActions.jsx
            ├── ImplementationPlan.jsx
            ├── FailureSimulator.jsx     # Container for all simulator modules
            ├── IncidentProbability.jsx  # Animated gauge
            ├── ConfidenceScore.jsx      # Meter with context
            ├── BlastRadiusViz.jsx       # SVG bubble chart
            ├── RiskTimeline.jsx         # Horizontal risk-over-time
            ├── DeploymentRecommendation.jsx  # Status badge with metrics
            ├── RiskHeatmap.jsx          # 4x3 grid heatmap
            ├── LoadingSkeleton.jsx
            ├── EmptyState.jsx
            └── ErrorBanner.jsx
```

## Failure Simulator

When a user submits a feature request, the system returns:

| Metric | Component |
|--------|-----------|
| Incident Probability | Animated gauge with progress bar |
| Confidence Score | Ring meter with contextual message |
| Deploy Recommendation | Status badge (blocked/caution/review/approved) with metrics |
| Failure Reasons | Grid of categorized failure reasons |
| Blast Radius | Interactive SVG bubble chart with severity legend |
| Risk Timeline | Dot timeline + bar chart projection |
| Risk Heatmap | 4x3 grid of likelihood vs. impact |

## Quick Start

```bash
cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
cd frontend && npm install && npm run dev
```

Open http://localhost:5173

Try: "Add payment retry support", "Implement OAuth 2.0 SSO", "Add full-text search", "Refactor billing module"

## API

`POST /analyze` returns risk score, failure simulation (incident probability, confidence, blast radius, risk timeline, deploy recommendation), impacted services/files, dependency analysis, historical changes, potential failures, prioritized actions, and implementation plan.
