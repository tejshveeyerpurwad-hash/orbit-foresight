from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Orbit Foresight API", version="4.0.0", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROFILES = {
    "payment": {
        "risk_score": lambda: random.randint(75, 92),
        "incident_probability": lambda: random.randint(68, 88),
        "confidence_score": lambda: random.randint(82, 95),
        "deploy_recommendation": "blocked",
        "severity": "critical",
        "impacted_services": ["Payment Service", "Billing Worker", "Transaction Logger"],
        "impacted_files": ["payment.py", "retry.py", "webhook_handler.py"],
        "impacted_teams": ["Payments", "Infrastructure", "QA"],
        "impacted_pipelines": ["CI/CD Build", "Integration Tests", "Deploy Staging", "E2E Tests"],
        "failure_reasons": [
            "Retry queue overflow probability elevated at peak load",
            "Payment gateway API version mismatch detected",
            "Missing circuit breaker in billing worker chain",
            "Webhook idempotency keys not implemented",
        ],
        "blast_radius": [
            {"name": "Payment Service", "severity": "critical", "pct": 92, "owner": "team-payments"},
            {"name": "Billing Worker", "severity": "high", "pct": 74, "owner": "team-infra"},
            {"name": "Transaction Logger", "severity": "medium", "pct": 45, "owner": "team-platform"},
            {"name": "PostgreSQL Primary", "severity": "medium", "pct": 38, "owner": "team-infra"},
            {"name": "Redis Queue", "severity": "high", "pct": 65, "owner": "team-infra"},
            {"name": "Email Service", "severity": "low", "pct": 18, "owner": "team-platform"},
        ],
    },
    "auth": {
        "risk_score": lambda: random.randint(45, 65),
        "incident_probability": lambda: random.randint(35, 55),
        "confidence_score": lambda: random.randint(70, 88),
        "deploy_recommendation": "caution",
        "severity": "high",
        "impacted_services": ["Auth Service", "User Service", "API Gateway"],
        "impacted_files": ["auth.py", "session.py", "middleware.py"],
        "impacted_teams": ["Security", "Platform", "QA"],
        "impacted_pipelines": ["Security Scan", "CI/CD Build", "Integration Tests"],
        "failure_reasons": [
            "Session token invalidation race condition",
            "Rate limiter false positive threshold too aggressive",
            "OAuth callback timeout exceeds SLO",
        ],
        "blast_radius": [
            {"name": "Auth Service", "severity": "high", "pct": 82, "owner": "team-security"},
            {"name": "User Service", "severity": "medium", "pct": 55, "owner": "team-platform"},
            {"name": "API Gateway", "severity": "medium", "pct": 48, "owner": "team-infra"},
            {"name": "Redis Session Store", "severity": "low", "pct": 22, "owner": "team-infra"},
        ],
    },
    "search": {
        "risk_score": lambda: random.randint(20, 40),
        "incident_probability": lambda: random.randint(12, 30),
        "confidence_score": lambda: random.randint(88, 98),
        "deploy_recommendation": "approved",
        "severity": "low",
        "impacted_services": ["Search Service", "Indexer Worker"],
        "impacted_files": ["search.py", "indexer.py", "query_builder.py"],
        "impacted_teams": ["Search", "Platform"],
        "impacted_pipelines": ["CI/CD Build", "Index Deploy"],
        "failure_reasons": [
            "Elasticsearch cluster CPU may spike during reindex",
            "Index lag could reach 30s under peak write throughput",
        ],
        "blast_radius": [
            {"name": "Search Service", "severity": "low", "pct": 28, "owner": "team-search"},
            {"name": "Indexer Worker", "severity": "low", "pct": 22, "owner": "team-search"},
            {"name": "Elasticsearch Cluster", "severity": "medium", "pct": 35, "owner": "team-infra"},
        ],
    },
}

DEFAULT = {
    "risk_score": lambda: random.randint(50, 85),
    "incident_probability": lambda: random.randint(40, 75),
    "confidence_score": lambda: random.randint(75, 90),
    "deploy_recommendation": "review",
    "severity": "medium",
    "impacted_services": ["Web Service", "API Gateway", "Background Worker"],
    "impacted_files": ["service.py", "handler.py", "config.py"],
    "impacted_teams": ["Platform", "Infrastructure", "QA"],
    "impacted_pipelines": ["CI/CD Build", "Integration Tests", "Deploy Staging"],
    "failure_reasons": [
        "Regression in existing API contracts possible",
        "Memory leak risk under sustained load",
        "Missing telemetry for new code path",
    ],
    "blast_radius": [
        {"name": "Web Service", "severity": "high", "pct": 76, "owner": "team-platform"},
        {"name": "API Gateway", "severity": "medium", "pct": 52, "owner": "team-infra"},
        {"name": "Background Worker", "severity": "medium", "pct": 44, "owner": "team-platform"},
        {"name": "PostgreSQL", "severity": "low", "pct": 20, "owner": "team-infra"},
    ],
}

RISK_TIMELINE = [
    {"phase": "Development", "risk": 25, "date": "Week 1"},
    {"phase": "Code Review", "risk": 40, "date": "Week 2"},
    {"phase": "Staging Tests", "risk": 65, "date": "Week 3"},
    {"phase": "Production Rollout", "risk": 82, "date": "Week 4"},
    {"phase": "Post-Deploy Monitor", "risk": 45, "date": "Week 5"},
]

SERVICES_COMMON = [
    {"name": "Payment Service", "risk": "high", "dependencies": ["Billing Worker", "Redis Queue"], "impacted_by": ["API Gateway"], "propagation_risk": 85, "owner": "team-payments"},
    {"name": "Billing Worker", "risk": "medium", "dependencies": ["Transaction Logger", "PostgreSQL"], "impacted_by": ["Payment Service"], "propagation_risk": 72, "owner": "team-infra"},
    {"name": "Transaction Logger", "risk": "low", "dependencies": ["PostgreSQL"], "impacted_by": ["Billing Worker"], "propagation_risk": 45, "owner": "team-platform"},
    {"name": "Redis Queue", "risk": "high", "dependencies": ["Payment Service"], "impacted_by": ["Payment Service", "Billing Worker"], "propagation_risk": 78, "owner": "team-infra"},
    {"name": "API Gateway", "risk": "medium", "dependencies": ["Auth Service", "Rate Limiter"], "impacted_by": [], "propagation_risk": 35, "owner": "team-infra"},
    {"name": "Auth Service", "risk": "medium", "dependencies": ["User Service", "Redis Session Store"], "impacted_by": ["API Gateway"], "propagation_risk": 52, "owner": "team-security"},
    {"name": "User Service", "risk": "low", "dependencies": ["PostgreSQL"], "impacted_by": ["Auth Service"], "propagation_risk": 28, "owner": "team-platform"},
    {"name": "PostgreSQL", "risk": "low", "dependencies": [], "impacted_by": ["Transaction Logger", "User Service"], "propagation_risk": 18, "owner": "team-infra"},
]

RISK_PATHS = [
    {"from": "Payment Service", "to": "Billing Worker", "risk": 78, "description": "Retry queue overflow propagates to billing"},
    {"from": "Billing Worker", "to": "Transaction Logger", "risk": 62, "description": "Transaction log backpressure"},
    {"from": "Payment Service", "to": "Redis Queue", "risk": 85, "description": "Queue backpressure under load"},
    {"from": "Redis Queue", "to": "Payment Service", "risk": 72, "description": "Dead letter queue cascade"},
    {"from": "API Gateway", "to": "Auth Service", "risk": 45, "description": "Auth timeout on gateway"},
]

SIMILAR_MRS = [
    {"mr": "MR #142", "description": "Failed integration tests due to missing retry config", "date": "2026-05-12", "author": "alice", "severity": "high", "outcome": "incident", "confidence": 87},
    {"mr": "MR #198", "description": "Caused retry queue overflow in production", "date": "2026-06-01", "author": "bob", "severity": "critical", "outcome": "incident", "confidence": 92},
    {"mr": "MR #211", "description": "Introduced N+1 query in billing report", "date": "2026-06-15", "author": "carol", "severity": "medium", "outcome": "near_miss", "confidence": 74},
    {"mr": "MR #87", "description": "Payment timeout regression after refactor", "date": "2026-04-20", "author": "alice", "severity": "high", "outcome": "incident", "confidence": 89},
    {"mr": "MR #305", "description": "Race condition in session invalidation handler", "date": "2026-07-02", "author": "dave", "severity": "critical", "outcome": "incident", "confidence": 91},
    {"mr": "MR #178", "description": "API pagination off-by-one in v2 endpoint", "date": "2026-05-28", "author": "carol", "severity": "low", "outcome": "no_incident", "confidence": 66},
]

SIMILAR_INCIDENTS = [
    {"incident": "Production outage - Payment pipeline down 45min", "date": "2026-06-01", "root_cause": "Retry queue overflow without circuit breaker", "impact": "All payment flows blocked", "duration": "45min"},
    {"incident": "Degraded billing processing - 3hr delay", "date": "2026-05-15", "root_cause": "Billing worker OOM from unbounded retry loop", "impact": "15K invoices delayed", "duration": "3hr"},
    {"incident": "Webhook delivery failure - partial data loss", "date": "2026-04-28", "root_cause": "Missing idempotency keys caused duplicate webhook events", "impact": "2% merchants affected", "duration": "2hr"},
]

ROOT_CAUSES = [
    {"cause": "Unbounded retry loops without backoff", "frequency": "high", "services_affected": 3},
    {"cause": "Missing circuit breakers on external API calls", "frequency": "high", "services_affected": 4},
    {"cause": "Configuration drift between environments", "frequency": "medium", "services_affected": 2},
    {"cause": "Insufficient integration test coverage", "frequency": "high", "services_affected": 5},
    {"cause": "Missing observability on critical code paths", "frequency": "medium", "services_affected": 3},
]

LESSONS_LEARNED = [
    {"lesson": "Always implement exponential backoff before retry queues reach 80% capacity", "priority": "critical", "team": "Payments"},
    {"lesson": "Circuit breakers must be tested with integration tests, not unit tests", "priority": "high", "team": "Infrastructure"},
    {"lesson": "Webhook handlers must validate idempotency keys before processing", "priority": "high", "team": "Platform"},
    {"lesson": "Deploy canary analysis should run for minimum 15 minutes before full rollout", "priority": "medium", "team": "SRE"},
]

SCENARIOS = [
    {
        "what": "Retry queue overflow during payment peak",
        "why": "Missing exponential backoff in retry handler causes 1000+ rapid retries on gateway timeout",
        "prevention": "Implement circuit breaker with configurable thresholds and exponential backoff starting at 100ms",
        "severity": "critical",
        "probability": 82,
    },
    {
        "what": "Payment gateway API version mismatch",
        "why": "Payment gateway upgraded to v3 while service still uses v2 endpoints that are deprecated",
        "prevention": "Add API version negotiation header and monitor deprecation warnings in gateway responses",
        "severity": "high",
        "probability": 67,
    },
    {
        "what": "Webhook duplicate delivery events",
        "why": "Missing idempotency keys in webhook handlers cause duplicate billing events",
        "prevention": "Implement idempotency with request-id headers and deduplication store in Redis",
        "severity": "medium",
        "probability": 43,
    },
    {
        "what": "Billing worker OOM under peak load",
        "why": "Unbounded in-memory queue in billing worker grows until heap exhaustion",
        "prevention": "Replace in-memory queue with bounded Redis list and set max concurrency to 50",
        "severity": "high",
        "probability": 58,
    },
]

PREDICTED_INCIDENTS = [
    {"incident": "Payment timeout spike >5s", "probability": 82, "severity": "critical", "timeframe": "Week 1-2", "impact": "All payment flows", "description": "Retry storm likely during peak load hours"},
    {"incident": "Billing worker OOM crash", "probability": 67, "severity": "high", "timeframe": "Week 2-3", "impact": "Billing pipeline only", "description": "Memory leak in retry chain"},
    {"incident": "Transaction log write latency", "probability": 43, "severity": "medium", "timeframe": "Week 3-4", "impact": "Audit trail delays", "description": "Increased contention on logger"},
    {"incident": "Webhook delivery failure", "probability": 28, "severity": "low", "timeframe": "Week 4+", "impact": "Some merchant notifications", "description": "Idempotency key collision risk"},
]

TEAMS = [
    {"team": "Payments", "impact": "high", "workload": "3 days", "description": "Circuit breaker and retry logic changes required", "engineers": 2, "risk": 88},
    {"team": "Infrastructure", "impact": "medium", "workload": "2 days", "description": "Redis queue scaling and monitoring updates", "engineers": 1, "risk": 62},
    {"team": "QA", "impact": "high", "workload": "4 days", "description": "Integration test suite expansion for payment flows", "engineers": 2, "risk": 45},
    {"team": "SRE", "impact": "low", "workload": "1 day", "description": "Dashboard and alert configuration updates", "engineers": 1, "risk": 22},
]

ACTIONS = [
    {"action": "Add retry queue integration tests", "priority": "critical"},
    {"action": "Review billing service for breaking changes", "priority": "high"},
    {"action": "Run full regression suite before merge", "priority": "high"},
    {"action": "Set up circuit breaker for payment gateway", "priority": "medium"},
]

PLAN = [
    {"phase": "Phase 1", "task": "Update payment service with retry logic", "duration": "2 days", "status": "pending"},
    {"phase": "Phase 2", "task": "Implement exponential backoff in retry handler", "duration": "1 day", "status": "pending"},
    {"phase": "Phase 3", "task": "Add unit and integration tests", "duration": "2 days", "status": "pending"},
    {"phase": "Phase 4", "task": "Deploy to staging for validation", "duration": "1 day", "status": "pending"},
    {"phase": "Phase 5", "task": "Monitor production rollout with feature flag", "duration": "2 days", "status": "pending"},
]


class FeatureRequest(BaseModel):
    description: str


@app.get("/health")
def health():
    return {"status": "ok", "version": "4.0.0"}


@app.post("/analyze")
def analyze(req: FeatureRequest):
    desc = req.description.lower()
    profile = DEFAULT
    for keyword, p in PROFILES.items():
        if keyword in desc:
            profile = p
            break

    rs = profile["risk_score"]()
    ip = profile["incident_probability"]()
    cs = profile["confidence_score"]()
    rec = profile["deploy_recommendation"]

    srvc = profile["impacted_services"]
    files = profile["impacted_files"]

    return {
        "risk_score": rs,
        "failure_simulation": {
            "incident_probability": ip,
            "confidence_score": cs,
            "deploy_recommendation": profile["deploy_recommendation"],
            "failure_reasons": profile["failure_reasons"],
            "blast_radius": profile["blast_radius"],
            "risk_timeline": RISK_TIMELINE,
        },
        "impacted_services": srvc,
        "impacted_files": files,
        "dependency_analysis": [
            {"service": s, "dependencies": d, "risk": "high" if r > 60 else "medium" if r > 30 else "low"}
            for s, d, r in [
                ("Payment Service", ["Billing Worker", "Transaction Logger"], 85),
                ("Billing Worker", ["Payment Service", "Transaction Logger"], 62),
                ("Transaction Logger", ["Payment Service"], 45),
            ]
        ],
        "potential_failures": profile["failure_reasons"],
        "recommended_actions": ACTIONS,
        "implementation_plan": PLAN,
        "incident_probability": {
            "probability": ip,
            "confidence": cs,
            "severity": profile["severity"],
            "risk_score": rs,
        },
        "historical_intelligence": {
            "similar_mrs": SIMILAR_MRS,
            "similar_incidents": SIMILAR_INCIDENTS,
            "root_causes": ROOT_CAUSES,
            "lessons_learned": LESSONS_LEARNED,
            "total_patterns_matched": random.randint(12, 28),
            "analysis_confidence": random.randint(78, 95),
        },
        "orbit_knowledge_graph": {
            "services": SERVICES_COMMON,
            "risk_paths": RISK_PATHS,
            "total_risk_paths": len(RISK_PATHS),
            "max_propagation_depth": 4,
        },
        "change_impact_analysis": {
            "impacted_services": srvc,
            "impacted_files": files,
            "impacted_teams": profile["impacted_teams"],
            "impacted_pipelines": profile["impacted_pipelines"],
            "total_impact_count": len(srvc) + len(files) + len(profile["impacted_teams"]) + len(profile["impacted_pipelines"]),
        },
        "ai_cto_report": {
            "executive_summary": (
                "This change introduces significant risk to the payment processing pipeline. "
                "Historical analysis shows 3 similar changes that caused production incidents in the past 90 days. "
                "The primary concern is retry queue overflow under peak load, which previously resulted in a 45-minute billing outage. "
                "Circuit breaker and exponential backoff are strongly recommended before deployment."
            ),
            "deploy_recommendation": rec,
            "team_impact": TEAMS,
            "release_readiness": max(15, 100 - rs - random.randint(0, 10)),
            "key_metrics": {
                "risk_score": rs,
                "incident_probability": ip,
                "confidence_score": cs,
                "teams_impacted": len(TEAMS),
                "estimated_effort": "5 days",
                "total_recommendations": 4,
            },
            "risk_mitigation_plan": [
                {"step": "Implement circuit breaker on payment gateway", "owner": "Payments", "timeline": "2 days", "priority": "critical"},
                {"step": "Add exponential backoff to retry handler", "owner": "Payments", "timeline": "1 day", "priority": "critical"},
                {"step": "Expand integration test coverage", "owner": "QA", "timeline": "3 days", "priority": "high"},
                {"step": "Configure Redis queue max length alert", "owner": "Infrastructure", "timeline": "1 day", "priority": "medium"},
            ],
        },
        "deployment_simulator": {
            "scenarios": SCENARIOS,
            "total_scenarios": len(SCENARIOS),
            "worst_case_severity": max(s["severity"] for s in SCENARIOS),
        },
    }
