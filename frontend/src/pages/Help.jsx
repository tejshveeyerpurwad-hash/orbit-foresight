import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const searchCategories = [
  { label: 'Getting Started', icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' },
  { label: 'API Reference', icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z' },
  { label: 'Architecture', icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' },
  { label: 'Guides', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { label: 'SDKs', icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5' },
  { label: 'Changelog', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const quickStartCards = [
  {
    title: 'Set Up Your Workspace',
    icon: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
    time: '5 min',
    difficulty: 'Beginner',
    description: 'Create your Orbit Foresight account, configure your organization profile, and invite team members to collaborate on risk analysis.',
    steps: [
      { text: 'Navigate to app.orbitforesight.io and sign up with your work email', code: null },
      { text: 'Verify your email and complete the organization setup wizard', code: null },
      { text: 'Invite team members via Settings > Team Management', code: 'POST /api/teams/invite\n{\n  "email": "colleague@company.com",\n  "role": "member"\n}' },
      { text: 'Configure your organization name, logo, and default timezone', code: null },
      { text: 'Set up SSO if using SAML or OAuth providers', code: 'sso:\n  provider: "azure"\n  tenant_id: "your-tenant-id"\n  client_id: "your-client-id"' },
    ],
  },
  {
    title: 'Connect Data Sources',
    icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
    time: '10 min',
    difficulty: 'Beginner',
    description: 'Integrate your version control systems, CI/CD pipelines, and monitoring tools to feed data into the risk analysis engine.',
    steps: [
      { text: 'Go to Integrations > Data Sources in the sidebar', code: null },
      { text: 'Click "Connect" on GitHub and authorize the OAuth app', code: 'gh auth login --scopes "repo,read:org"\norbit connect github --token ghp_xxxx' },
      { text: 'Configure repository webhooks for real-time event streaming', code: '{\n  "repository": "org/repo",\n  "events": ["push", "pull_request", "deployment"],\n  "webhook_url": "https://api.orbitforesight.io/v1/webhooks/github"\n}' },
      { text: 'Connect your CI/CD provider (Jenkins, CircleCI, GitHub Actions)', code: null },
      { text: 'Verify connection status on the Integrations dashboard', code: null },
    ],
  },
  {
    title: 'Configure Risk Thresholds',
    icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75',
    time: '15 min',
    difficulty: 'Intermediate',
    description: 'Set custom risk score boundaries per service and team, defining warning and critical thresholds that match your operational tolerance.',
    steps: [
      { text: 'Open Settings > Risk Thresholds from the main navigation', code: null },
      { text: 'Select a service from the dropdown or apply global defaults', code: null },
      { text: 'Set the Warning threshold (default: 40) and Critical threshold (default: 70)', code: '{\n  "service_id": "payment-service",\n  "thresholds": {\n    "warning": 45,\n    "critical": 75,\n    "confidence_min": 0.8\n  }\n}' },
      { text: 'Optionally enable dynamic thresholds based on percentile baselines', code: null },
      { text: 'Save configuration and verify via the dashboard risk histogram', code: null },
    ],
  },
  {
    title: 'Run First Analysis',
    icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605',
    time: '8 min',
    difficulty: 'Beginner',
    description: 'Execute your first risk analysis on a recent deployment to understand the scoring system and output interpretation.',
    steps: [
      { text: 'Navigate to Analysis > New Analysis in the sidebar', code: null },
      { text: 'Select a recent deployment from the dropdown list', code: null },
      { text: 'Choose analysis depth: Standard (fast) or Deep (comprehensive)', code: null },
      { text: 'Click "Run Analysis" and wait for the ML engine to process', code: 'curl -X POST https://api.orbitforesight.io/v1/analyze \\\n  -H "Authorization: Bearer $API_KEY" \\\n  -d \'{\n    "deployment_id": "dep-abc123",\n    "depth": "standard"\n  }\'' },
      { text: 'Review the generated risk report with scores and recommendations', code: null },
    ],
  },
  {
    title: 'Interpret Dashboard',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    time: '10 min',
    difficulty: 'Intermediate',
    description: 'Learn to read the main dashboard widgets: risk heatmap, trend charts, deployment timeline, and the service dependency graph.',
    steps: [
      { text: 'The top banner shows the overall organization risk score (0-100)', code: null },
      { text: 'The heatmap visualizes risk per service, with color intensity indicating severity', code: null },
      { text: 'Trend charts show risk score history over 7/30/90 day windows', code: null },
      { text: 'The deployment timeline marks each deployment with its risk contribution', code: null },
      { text: 'Click any service node in the dependency graph to drill into detail', code: null },
    ],
  },
  {
    title: 'Set Up Alerts',
    icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
    time: '12 min',
    difficulty: 'Advanced',
    description: 'Configure multi-channel alert routing for risk threshold breaches, anomaly detection events, and scheduled health check reports.',
    steps: [
      { text: 'Navigate to Alerts > Notification Channels', code: null },
      { text: 'Add channels: Slack (webhook), PagerDuty (API key), Email (SMTP)', code: 'channels:\n  slack:\n    webhook_url: "https://hooks.slack.com/xxx"\n  pagerduty:\n    routing_key: "pd-key-xxx"\n  email:\n    recipients: ["oncall@company.com"]' },
      { text: 'Create alert rules: select metric, operator, threshold, and cooldown', code: null },
      { text: 'Set up escalation policies for unacknowledged alerts', code: null },
      { text: 'Test the alert pipeline with a simulated threshold breach', code: null },
    ],
  },
]

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/risk',
    description: 'Retrieve the current risk score and breakdown for a specified service or the entire organization.',
    params: [
      { name: 'service_id', type: 'string', required: false, description: 'Filter by service ID (UUID). If omitted, returns organization aggregate.' },
      { name: 'environment', type: 'string', required: false, description: 'Environment filter: production, staging, or development. Defaults to all.' },
      { name: 'timespan', type: 'string', required: false, description: 'Time window: 1h, 24h, 7d, 30d. Defaults to 24h.' },
    ],
    response: `{
  "status": "success",
  "data": {
    "overall_risk": 34.2,
    "services": [
      {
        "service_id": "srv-payment",
        "risk_score": 67.8,
        "confidence": 0.92,
        "blast_radius": 12,
        "trend": "increasing"
      }
    ],
    "generated_at": "2026-06-19T10:30:00Z"
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/analyze',
    description: 'Submit a deployment for risk analysis. Returns a risk assessment with recommendations.',
    params: [
      { name: 'deployment_id', type: 'string', required: true, description: 'Unique deployment identifier from your CI/CD system.' },
      { name: 'repository', type: 'string', required: true, description: 'Repository name in format owner/repo.' },
      { name: 'commit_sha', type: 'string', required: true, description: 'Full commit SHA of the deployment.' },
      { name: 'depth', type: 'string', required: false, description: 'Analysis depth: standard or deep. Defaults to standard.' },
    ],
    response: `{
  "status": "success",
  "data": {
    "analysis_id": "anl-xyz789",
    "risk_score": 42.5,
    "confidence": 0.87,
    "breakdown": {
      "deployment_velocity": 15.2,
      "dependency_depth": 8.3,
      "blast_radius": 10.1,
      "change_frequency": 8.9
    },
    "recommendations": [
      "Consider canary deployment to mitigate risk",
      "Run integration tests on downstream services"
    ]
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/deployments',
    description: 'List all deployments with associated risk scores, paginated and filterable.',
    params: [
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination. Defaults to 1.' },
      { name: 'per_page', type: 'integer', required: false, description: 'Items per page (max 100). Defaults to 20.' },
      { name: 'status', type: 'string', required: false, description: 'Filter by status: success, failure, in_progress, rolled_back.' },
      { name: 'from', type: 'string', required: false, description: 'Start date (ISO 8601) for time range filtering.' },
    ],
    response: `{
  "status": "success",
  "data": {
    "deployments": [
      {
        "id": "dep-abc123",
        "repository": "org/web-app",
        "commit_sha": "a1b2c3d4e5f6...",
        "risk_score": 28.1,
        "status": "success",
        "deployed_at": "2026-06-19T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/incidents',
    description: 'Create or report an incident. Used by the webhook receiver and API consumers.',
    params: [
      { name: 'title', type: 'string', required: true, description: 'Incident title or summary.' },
      { name: 'severity', type: 'string', required: true, description: 'Severity level: critical, high, medium, low.' },
      { name: 'service_id', type: 'string', required: true, description: 'Affected service identifier.' },
      { name: 'description', type: 'text', required: false, description: 'Detailed incident description and impact assessment.' },
    ],
    response: `{
  "status": "success",
  "data": {
    "incident_id": "inc-456def",
    "title": "Payment service latency spike",
    "severity": "high",
    "service_id": "srv-payment",
    "status": "open",
    "created_at": "2026-06-19T10:30:00Z",
    "risk_correlation": 0.76
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/teams',
    description: 'Retrieve team information, service ownership, and on-call schedules.',
    params: [
      { name: 'team_id', type: 'string', required: false, description: 'Filter by team ID. Returns all teams if omitted.' },
      { name: 'include_members', type: 'boolean', required: false, description: 'Include team member details. Defaults to false.' },
    ],
    response: `{
  "status": "success",
  "data": {
    "teams": [
      {
        "id": "team-payments",
        "name": "Payments Team",
        "member_count": 8,
        "services": ["srv-payment", "srv-billing"],
        "on_call": {
          "primary": "alice@company.com",
          "secondary": "bob@company.com"
        }
      }
    ]
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/health',
    description: 'Health check endpoint. Returns system status and component availability.',
    params: [
      { name: 'detailed', type: 'boolean', required: false, description: 'Set to true for per-component health breakdown. Defaults to false.' },
    ],
    response: `{
  "status": "ok",
  "timestamp": "2026-06-19T10:30:00Z",
  "version": "2.4.1",
  "components": {
    "api_gateway": { "status": "healthy", "latency_ms": 12 },
    "ml_engine": { "status": "healthy", "latency_ms": 45 },
    "database": { "status": "healthy", "latency_ms": 3 },
    "redis_cache": { "status": "healthy", "latency_ms": 1 },
    "websocket": { "status": "healthy", "connections": 142 }
  }
}`,
  },
]

const architectureLayers = [
  {
    name: 'Frontend',
    tech: ['React 18', 'Vite 5', 'TailwindCSS 3', 'Framer Motion'],
    description: 'Single-page application with real-time WebSocket updates, interactive visualizations using D3.js, and responsive design supporting mobile through 4K displays. Features optimistic UI updates and service worker caching for offline resilience.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'API Gateway',
    tech: ['FastAPI', 'Python 3.12', 'Redis', 'Nginx'],
    description: 'RESTful API gateway with automatic OpenAPI 3.1 documentation, request validation via Pydantic, rate limiting (1000 req/min per key), JWT authentication, and WebSocket upgrade handling. Routes requests to appropriate internal services.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'ML Engine',
    tech: ['scikit-learn', 'PyTorch', 'ONNX', 'Celery'],
    description: 'Risk prediction model ensemble using gradient-boosted trees and time-series transformers. Trained on 10K+ historical incidents with 94% accuracy. Features online learning for real-time adaptation and A/B model evaluation pipelines.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Database',
    tech: ['PostgreSQL 16', 'Redis 7', 'TimescaleDB'],
    description: 'Primary data store with TimescaleDB for time-series analytics, Redis for sub-millisecond caching (5s TTL for live data, 300s for historical), and PostgreSQL for relational data. Supports read replicas and automated sharding at 100GB per shard.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Infrastructure',
    tech: ['Docker', 'Kubernetes', 'Terraform', 'AWS EKS'],
    description: 'Containerized microservices deployed on Kubernetes (EKS) with horizontal pod autoscaling based on CPU/memory and custom metrics. Infrastructure as Code via Terraform. Multi-AZ deployment with 99.95% SLA and automated disaster recovery.',
    color: 'from-rose-500 to-pink-500',
  },
]

const tutorials = [
  { title: 'Getting Started with Orbit Foresight', duration: '12:30', difficulty: 'Beginner', description: 'A complete walkthrough of the platform from account creation through your first risk analysis and dashboard interpretation.', gradient: 'from-cyan-600 to-blue-600' },
  { title: 'Configuring Risk Thresholds', duration: '15:45', difficulty: 'Intermediate', description: 'Deep dive into threshold configuration including dynamic percentile baselines, per-environment overrides, and multi-service policies.', gradient: 'from-violet-600 to-purple-600' },
  { title: 'API Integration Guide', duration: '22:10', difficulty: 'Advanced', description: 'Comprehensive API tutorial covering authentication, rate limiting, webhook setup, and building custom integrations with the REST API.', gradient: 'from-emerald-600 to-teal-600' },
  { title: 'Understanding Blast Radius', duration: '08:50', difficulty: 'Intermediate', description: 'Learn how blast radius is calculated, how to interpret the dependency graph, and strategies for reducing service impact surface area.', gradient: 'from-amber-600 to-orange-600' },
  { title: 'Alert Configuration & Routing', duration: '18:20', difficulty: 'Advanced', description: 'Configure multi-channel alerting with Slack, PagerDuty, and email. Set up escalation policies, cooldown intervals, and alert suppression rules.', gradient: 'from-rose-600 to-pink-600' },
  { title: 'Dashboard & Reporting Deep Dive', duration: '14:35', difficulty: 'Beginner', description: 'Explore every widget on the main dashboard: risk heatmap, trend charts, deployment timeline, team view, and custom report builder.', gradient: 'from-indigo-600 to-blue-600' },
]

const bestPractices = [
  {
    title: 'Risk Threshold Configuration',
    category: 'Configuration',
    description: 'Set warning thresholds at 40 and critical at 70 for most services. Adjust lower (30/60) for payment processing and authentication services. Use dynamic percentile thresholds for variable-traffic services to avoid alert fatigue.',
    benefits: ['Reduces false positive alerts by 40%', 'Aligns risk tolerance with business criticality', 'Auto-adapts to traffic seasonality'],
  },
  {
    title: 'Deployment Validation',
    category: 'Deployment',
    description: 'Run risk analysis in CI/CD before every production deployment. Block deployments exceeding critical threshold. Use canary analysis for high-risk changes. Always tag deployments with environment and commit SHA for traceability.',
    benefits: ['Prevents 85% of high-risk deployments', 'Provides audit trail for compliance', 'Enables automated rollback decisions'],
  },
  {
    title: 'Incident Response',
    category: 'Operations',
    description: 'Configure instant alert routing to PagerDuty and Slack for critical threshold breaches. Establish a severity matrix mapping risk scores to response tiers. Run post-incident reviews correlated with risk score history.',
    benefits: ['Mean time to acknowledge under 2 minutes', 'Structured escalation with clear ownership', 'Blameless post-mortems with data'],
  },
  {
    title: 'Monitoring Setup',
    category: 'Observability',
    description: 'Integrate Datadog or Prometheus metrics to enrich risk calculations. Configure WebSocket dashboards for real-time risk visualization. Set up weekly risk report emails to stakeholders with trend analysis.',
    benefits: ['Correlates observability data with risk', 'Real-time visibility across all services', 'Automated stakeholder reporting'],
  },
  {
    title: 'Team Assignment',
    category: 'Organization',
    description: 'Assign each service to a primary team and at least one secondary team. Keep team size between 5-9 members for optimal bus factor. Configure on-call schedules per service group to ensure coverage.',
    benefits: ['Clear ownership reduces response time', 'Bus factor protection with secondary teams', 'Optimized on-call rotation coverage'],
  },
  {
    title: 'Data Source Integration',
    category: 'Integration',
    description: 'Connect all production repositories, not just critical ones. Enable webhook event streaming for real-time analysis. Validate webhook payloads regularly and monitor integration health on the Integrations dashboard.',
    benefits: ['Comprehensive risk coverage', 'Real-time event-driven analysis', 'Early detection of integration drift'],
  },
  {
    title: 'Security Hardening',
    category: 'Security',
    description: 'Rotate API keys every 90 days. Use service accounts with minimum required scopes. Enable IP allowlisting for API access. Audit webhook signatures and validate payload origins. Review access logs weekly.',
    benefits: ['Compliant with SOC 2 requirements', 'Reduces attack surface area', 'Full audit trail of all access'],
  },
  {
    title: 'Performance Optimization',
    category: 'Performance',
    description: 'Cache analysis results with 5-second TTL for frequently queried services. Use the deep analysis mode sparingly (max 5 concurrent). Schedule intensive batch analyses during off-peak hours via the Celery task queue.',
    benefits: ['API response times under 50ms', 'Efficient resource utilization', 'Scalable to 10K+ daily analyses'],
  },
]

const releaseNotes = [
  {
    version: 'v2.1.0',
    date: 'June 15, 2026',
    type: 'Feature',
    description: 'Real-time risk scoring with WebSocket push, enhanced dependency graph visualization, and new team management dashboard.',
    changes: [
      'Added WebSocket-based real-time risk score updates with sub-100ms latency',
      'New interactive dependency graph with 3-level deep blast radius visualization',
      'Team management dashboard with on-call schedule integration',
      'Custom webhook endpoints for CI/CD pipeline integration',
      'Export risk reports as PDF or CSV with custom date ranges',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'May 28, 2026',
    type: 'Breaking Change',
    description: 'Major API overhaul with v2 endpoint namespace, improved authentication, and new ML model architecture.',
    changes: [
      'Migrated from /v1/ to /v2/ API namespace with improved response schemas',
      'New ML model ensemble achieving 94% precision (up from 89%)',
      'Introduced per-service risk factor breakdown in API responses',
      'Deprecated /v1/ endpoints scheduled for removal August 2026',
      'JWT authentication now requires audience claim validation',
    ],
  },
  {
    version: 'v1.9.0',
    date: 'May 10, 2026',
    type: 'Feature',
    description: 'Slack integration with interactive commands, PagerDuty incident sync, and customizable alert suppression windows.',
    changes: [
      'Slack slash commands for quick risk lookups (/orbit-risk <service>)',
      'Bidirectional PagerDuty incident synchronization',
      'Alert suppression windows for planned maintenance',
      'Custom alert templates with service context variables',
      'Multi-workspace Slack support with channel routing',
    ],
  },
  {
    version: 'v1.8.2',
    date: 'April 22, 2026',
    type: 'Bug Fix',
    description: 'Fixed Redis cache invalidation race condition, corrected blast radius calculation for circular dependencies, and improved dashboard performance.',
    changes: [
      'Fixed cache invalidation race condition affecting real-time scores',
      'Corrected blast radius calculation for circular dependency graphs',
      'Reduced dashboard initial load time by 60% with lazy loading',
      'Fixed SSO session timeout handling for SAML providers',
      'Resolved WebSocket reconnection backoff exponential growth issue',
    ],
  },
  {
    version: 'v1.8.0',
    date: 'April 5, 2026',
    type: 'Improvement',
    description: 'Performance improvements across the board: 3x faster ML inference, optimized database queries, and reduced memory footprint.',
    changes: [
      'ONNX-optimized ML inference providing 3x throughput improvement',
      'Database query optimization reduced p95 latency from 120ms to 35ms',
      'Reduced service memory footprint by 40% with connection pooling',
      'Improved pagination performance for deployments with 100K+ entries',
      'Added database read replicas for dashboard query offloading',
    ],
  },
  {
    version: 'v1.7.0',
    date: 'March 15, 2026',
    type: 'Feature',
    description: 'Kubernetes integration for cluster-level risk analysis, namespace-based deployment tracking, and container vulnerability correlation.',
    changes: [
      'Kubernetes cluster integration with pod-level risk analysis',
      'Namespace-based deployment tracking and risk aggregation',
      'Container image vulnerability correlation with risk scores',
      'Custom resource definition (CRD) for Orbit risk annotations',
      'kubectl plugin for risk-aware deployment validation',
    ],
  },
]

const integrations = [
  {
    name: 'GitHub',
    initials: 'GH',
    status: 'connected',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
    description: 'Commit analysis, PR risk checks, deployment webhooks, and repository synchronization. Automatically detects push events, pull request merges, and deployment lifecycle changes.',
  },
  {
    name: 'GitLab',
    initials: 'GL',
    status: 'connected',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
    description: 'Merge request integration, CI/CD pipeline hooks, and project-level risk dashboards. Supports both self-hosted and GitLab SaaS instances.',
  },
  {
    name: 'PagerDuty',
    initials: 'PD',
    status: 'connected',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
    description: 'Incident ingestion, on-call schedule sync, and automated alert routing with escalation policies. Creates PagerDuty incidents when risk thresholds are breached.',
  },
  {
    name: 'Slack',
    initials: 'SL',
    status: 'connected',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500',
    description: 'Real-time risk notifications, interactive Slash commands, and dashboard embed. Supports multiple channels with per-channel notification filtering.',
  },
  {
    name: 'Docker',
    initials: 'DK',
    status: 'available',
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    dot: 'bg-slate-500',
    description: 'Container registry scanning, image vulnerability correlation, and deployment risk tracking. Scan Docker images for known CVEs before deployment.',
  },
  {
    name: 'Kubernetes',
    initials: 'K8',
    status: 'coming_soon',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500',
    description: 'Cluster state monitoring, pod-level risk analysis, and namespace-based deployment tracking. Native Kubernetes CRD integration planned for v2.3.',
  },
]

const faqs = [
  {
    q: 'How does the risk score work?',
    a: 'The risk score is calculated using a multi-factor ML model trained on 10,000+ historical incidents. It evaluates deployment velocity, dependency depth, team size, blast radius, change frequency, and failure correlation. Each factor is weighted using a gradient-boosted decision tree ensemble, producing a score from 0 (safe) to 100 (critical). The model achieves 94% precision against known production incidents and is retrained nightly.',
    category: 'General',
  },
  {
    q: 'What data sources are integrated?',
    a: 'Orbit Foresight integrates with GitHub (commits, PRs, actions), GitLab (merge requests, pipelines), PagerDuty (incidents, on-call schedules), Slack (notifications, alerts), Docker (container registries), Kubernetes (cluster state, deployments), Jenkins, CircleCI, GitHub Actions, Datadog (metrics), and custom webhooks. The integration layer supports both polling and event-driven ingestion via webhooks.',
    category: 'General',
  },
  {
    q: 'How often is data refreshed?',
    a: 'Dashboard data refreshes every 30 seconds via WebSocket push connections. Real-time risk scores are recalculated on each deployment event. Historical analysis is batched and reprocessed nightly for ML model retraining. API responses are cached with Redis (TTL: 5s for live data, 300s for historical). On-demand refresh is available via the refresh button in the dashboard header.',
    category: 'Technical',
  },
  {
    q: 'Can I customize risk thresholds?',
    a: 'Yes. Navigate to Settings > Risk Thresholds to configure per-service and per-team thresholds. You can set warning (yellow) and critical (red) boundaries independently. Thresholds support absolute values, percentile-based dynamic ranges, and time-windowed averages. Custom thresholds can be applied globally or scoped to specific environments (production, staging, development).',
    category: 'Technical',
  },
  {
    q: 'What is the pricing model?',
    a: 'Orbit Foresight offers three tiers: Starter (free, up to 5 services, 1,000 API calls/month), Pro ($99/month, up to 25 services, 50K API calls, SLA support), and Enterprise (custom pricing, unlimited services, dedicated ML model training, SSO, audit logs, 99.95% SLA). All plans include a 14-day free trial with full feature access.',
    category: 'Billing',
  },
  {
    q: 'How are incidents predicted?',
    a: 'Incident prediction uses a time-series transformer model trained on deployment events, service dependencies, historical incidents, and observability metrics. The model identifies anomaly patterns 15-45 minutes before they escalate to confirmed incidents. Predictions are surfaced as "risk alerts" in the dashboard and routed to Slack, PagerDuty, or email. The model retrains daily with a 7-day lookback window.',
    category: 'Technical',
  },
  {
    q: 'Is my data encrypted?',
    a: 'All data is encrypted at rest using AES-256-GCM with automatic key rotation every 90 days. Data in transit uses TLS 1.3 with perfect forward secrecy. Customer-managed encryption keys (CMEK) are available for Enterprise plans. Orbit Foresight maintains SOC 2 Type II certification with annual audits covering security, availability, and confidentiality controls.',
    category: 'Security',
  },
  {
    q: 'What is the blast radius metric?',
    a: 'Blast radius represents all downstream services that would be impacted if a given service fails. Orbit Foresight maps dependencies up to 3 levels deep using both static code analysis (import graphs) and runtime tracing (OpenTelemetry). The blast radius metric is weighted by service criticality, traffic volume, and team ownership overlap. It is a core input to the overall risk score calculation.',
    category: 'General',
  },
]

const learningPaths = [
  {
    name: 'Orbit Fundamentals',
    modules: 4,
    duration: '2h',
    progress: null,
    description: 'Everything you need to get started: account setup, data source connections, first analysis, and dashboard basics.',
    gradient: 'from-cyan-500 to-blue-500',
    modules_list: ['Platform Overview & Account Setup', 'Connecting Your First Data Sources', 'Running Your First Risk Analysis', 'Understanding the Dashboard'],
  },
  {
    name: 'Risk Analysis Deep Dive',
    modules: 6,
    duration: '3h',
    progress: 33,
    description: 'Master risk scoring: threshold configuration, blast radius analysis, ML model interpretation, and custom reporting.',
    gradient: 'from-violet-500 to-purple-500',
    modules_list: ['Risk Score Fundamentals', 'Threshold Configuration Strategies', 'Blast Radius & Dependency Analysis', 'ML Model Interpretation', 'Custom Report Builder', 'Alert Configuration & Routing'],
  },
  {
    name: 'API Integration',
    modules: 3,
    duration: '1.5h',
    progress: null,
    description: 'Build custom integrations with the Orbit Foresight REST API: authentication, webhooks, data ingestion, and automation.',
    gradient: 'from-emerald-500 to-teal-500',
    modules_list: ['API Authentication & Rate Limiting', 'Webhook Setup & Event Processing', 'Building Custom Dashboard Widgets'],
  },
  {
    name: 'Admin & Security',
    modules: 5,
    duration: '2.5h',
    progress: 66,
    description: 'Enterprise administration: RBAC, SSO configuration, audit logging, security best practices, and compliance reporting.',
    gradient: 'from-amber-500 to-orange-500',
    modules_list: ['Role-Based Access Control', 'SSO (SAML/OAuth) Configuration', 'Audit Logging & Compliance', 'Security Best Practices', 'Incident Response Planning'],
  },
]

const devResources = [
  { label: 'SDK Downloads', desc: 'Python, JS, Go, Java', icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3' },
  { label: 'API Keys', desc: 'Manage credentials & rotate keys', icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z' },
  { label: 'Status Page', desc: 'System health & uptime dashboard', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5' },
  { label: 'GitHub', desc: 'Open source & community', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const difficultyColors = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
}
const methodColors = { GET: 'text-emerald-400 bg-emerald-500/10', POST: 'text-blue-400 bg-blue-500/10' }

function SectionHeader({ title, subtitle, count }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {count !== undefined && <span className="text-[10px] text-slate-600 font-mono">{count}</span>}
    </div>
  )
}

function SectionCard({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all ${className}`}>
      {children}
    </div>
  )
}

function CodeBlock({ code }) {
  return (
    <pre className="mt-2 rounded-lg bg-slate-950 border border-white/[0.06] p-3 overflow-x-auto">
      <code className="text-[11px] text-green-400 font-mono leading-relaxed whitespace-pre">{code}</code>
    </pre>
  )
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedQuickStart, setExpandedQuickStart] = useState(null)
  const [expandedApi, setExpandedApi] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [expandedRelease, setExpandedRelease] = useState(null)

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 pb-16">
        {/* Section 1: Search Experience */}
        <motion.div variants={item} className="space-y-6">
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Developer Hub</h1>
              <p className="mt-1 text-sm text-slate-500 max-w-xl mx-auto">Comprehensive documentation, API reference, guides, and resources for Orbit Foresight</p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation, APIs, guides..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-11 pr-14 text-sm text-white placeholder-slate-600 backdrop-blur-sm transition-all focus:border-cyan-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <kbd className="inline-flex items-center gap-0.5 rounded-md border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                  <span>⌘</span><span>K</span>
                </kbd>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {searchCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSearchQuery(cat.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-400 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-300"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                  </svg>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section 2: Quick Start Guides */}
        <motion.div variants={item}>
          <SectionHeader title="Quick Start Guides" subtitle="Get up and running in minutes" count={`${quickStartCards.length} guides`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickStartCards.map((card) => (
              <div key={card.title} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-cyan-500/20 hover:bg-cyan-500/[0.03]">
                <button
                  onClick={() => setExpandedQuickStart(expandedQuickStart === card.title ? null : card.title)}
                  className="w-full p-4 text-left"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-slate-500 transition-colors group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                      </svg>
                    </div>
                    <svg
                      className={`h-3.5 w-3.5 text-slate-600 transition-transform duration-200 ${expandedQuickStart === card.title ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{card.title}</h3>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed line-clamp-2">{card.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-slate-600">{card.time}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${difficultyColors[card.difficulty]}`}>{card.difficulty}</span>
                  </div>
                </button>
                <AnimatePresence>
                  {expandedQuickStart === card.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 space-y-3">
                        {card.steps.map((step, si) => (
                          <div key={si}>
                            <div className="flex items-start gap-2.5">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[9px] font-bold text-cyan-400">{si + 1}</span>
                              <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">{step.text}</p>
                            </div>
                            {step.code && <CodeBlock code={step.code} />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 3: Architecture Diagrams */}
        <motion.div variants={item}>
          <SectionHeader title="Architecture Diagrams" subtitle="System architecture across all layers" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {architectureLayers.map((layer) => (
              <div key={layer.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-500/20">
                <div className="mb-3 flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${layer.color} text-white text-[10px] font-bold`}>
                    {layer.name[0]}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{layer.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {layer.tech.map((t) => (
                    <span key={t} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] text-slate-500 border border-white/[0.06]">{t}</span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">System Data Flow</h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 720 200" className="w-full max-w-4xl" fill="none">
                <defs>
                  <marker id="arrowCyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L10 5 L0 10 Z" fill="#06b6d4" />
                  </marker>
                  <marker id="arrowSlate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0 0 L10 5 L0 10 Z" fill="#475569" />
                  </marker>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient>
                  <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
                  <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
                </defs>
                <rect x="20" y="25" width="100" height="55" rx="8" fill="url(#g1)" fillOpacity="0.15" stroke="url(#g1)" strokeWidth="1.5" />
                <text x="70" y="49" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">Frontend</text>
                <text x="70" y="63" textAnchor="middle" fill="#64748b" fontSize="6">React + Tailwind</text>
                <line x1="120" y1="52" x2="163" y2="52" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                <rect x="170" y="25" width="110" height="55" rx="8" fill="url(#g2)" fillOpacity="0.15" stroke="url(#g2)" strokeWidth="1.5" />
                <text x="225" y="49" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">API Gateway</text>
                <text x="225" y="63" textAnchor="middle" fill="#64748b" fontSize="6">FastAPI + Nginx</text>
                <line x1="280" y1="40" x2="320" y2="40" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                <line x1="280" y1="65" x2="320" y2="65" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                <rect x="327" y="12" width="130" height="55" rx="8" fill="url(#g3)" fillOpacity="0.15" stroke="url(#g3)" strokeWidth="1.5" />
                <text x="392" y="36" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">ML Engine</text>
                <text x="392" y="50" textAnchor="middle" fill="#64748b" fontSize="6">PyTorch + Celery</text>
                <rect x="327" y="75" width="130" height="55" rx="8" fill="url(#g4)" fillOpacity="0.15" stroke="url(#g4)" strokeWidth="1.5" />
                <text x="392" y="99" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">Database</text>
                <text x="392" y="113" textAnchor="middle" fill="#64748b" fontSize="6">PostgreSQL + Redis</text>
                <line x1="457" y1="40" x2="497" y2="52" stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                <line x1="457" y1="102" x2="497" y2="68" stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                <rect x="505" y="25" width="110" height="55" rx="8" fill="url(#g5)" fillOpacity="0.15" stroke="url(#g5)" strokeWidth="1.5" />
                <text x="560" y="49" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="600">Infrastructure</text>
                <text x="560" y="63" textAnchor="middle" fill="#64748b" fontSize="6">Kubernetes + EKS</text>
                <line x1="615" y1="52" x2="648" y2="52" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arrowSlate)" />
                <rect x="655" y="18" width="55" height="68" rx="8" fill="white" fillOpacity="0.03" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <text x="682" y="49" textAnchor="middle" fill="#64748b" fontSize="7">Deploy</text>
                <text x="682" y="62" textAnchor="middle" fill="#64748b" fontSize="7">Arrow</text>
              </svg>
            </div>
            <p className="mt-4 text-[11px] text-slate-500 leading-relaxed text-center max-w-2xl mx-auto">
              <span className="font-semibold text-slate-300">Deployment Flow:</span> Frontend requests route through the API Gateway, which proxies to the ML Engine for risk analysis and the Database for persistent storage. All services run on Kubernetes (EKS) with auto-scaling across three availability zones.
            </p>
          </div>
        </motion.div>

        {/* Section 4: API Explorer */}
        <motion.div variants={item}>
          <SectionHeader title="API Explorer" subtitle="REST API endpoints with request/response schemas" count={`${apiEndpoints.length} endpoints`} />
          <div className="space-y-3">
            {apiEndpoints.map((ep) => (
              <div key={ep.path + ep.method} className="rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-cyan-500/20">
                <button
                  onClick={() => setExpandedApi(expandedApi === ep.path ? null : ep.path)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold font-mono ${methodColors[ep.method]}`}>{ep.method}</span>
                  <code className="flex-1 text-xs font-mono text-slate-300">{ep.path}</code>
                  <span className="hidden text-[10px] text-slate-500 sm:block truncate max-w-xs">{ep.description}</span>
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform duration-200 ${expandedApi === ep.path ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedApi === ep.path && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.06] px-4 pb-4 pt-3 space-y-4">
                        <div>
                          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-2">Request Parameters</h4>
                          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
                            <table className="w-full text-[11px]">
                              <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.03]">
                                  <th className="px-3 py-2 text-left font-medium text-slate-500">Name</th>
                                  <th className="px-3 py-2 text-left font-medium text-slate-500">Type</th>
                                  <th className="px-3 py-2 text-left font-medium text-slate-500">Required</th>
                                  <th className="px-3 py-2 text-left font-medium text-slate-500">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/[0.04]">
                                {ep.params.map((p) => (
                                  <tr key={p.name} className="text-slate-400">
                                    <td className="px-3 py-2 font-mono text-slate-300">{p.name}</td>
                                    <td className="px-3 py-2 text-slate-500">{p.type}</td>
                                    <td className="px-3 py-2">
                                      {p.required ? (
                                        <span className="text-rose-400 font-medium">Yes</span>
                                      ) : (
                                        <span className="text-slate-600">No</span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2">{p.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-2">Example Response</h4>
                          <pre className="rounded-lg bg-slate-950 border border-white/[0.06] p-4 overflow-x-auto">
                            <code className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre">{ep.response}</code>
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 5: Tutorials */}
        <motion.div variants={item}>
          <SectionHeader title="Tutorials" subtitle="Video walkthroughs and guided learning" count={`${tutorials.length} tutorials`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((vid) => (
              <div key={vid.title} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] cursor-pointer">
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${vid.gradient}`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all group-hover:bg-cyan-500/30 group-hover:scale-110">
                    <svg className="h-6 w-6 text-white/90 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono text-white/80">{vid.duration}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors mb-1">{vid.title}</h3>
                  <div className="mb-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${difficultyColors[vid.difficulty]}`}>{vid.difficulty}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{vid.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 6: Guides & Best Practices */}
        <motion.div variants={item}>
          <SectionHeader title="Guides & Best Practices" subtitle="Proven patterns and operational recommendations" count={`${bestPractices.length} guides`} />
          <div className="grid gap-4 sm:grid-cols-2">
            {bestPractices.map((bp) => (
              <div key={bp.title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-500/20 hover:bg-cyan-500/[0.03]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{bp.title}</h3>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[9px] text-slate-500">{bp.category}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{bp.description}</p>
                <div className="space-y-1.5">
                  {bp.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-[10px] text-slate-500">
                      <svg className="h-3 w-3 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 7: Release Notes */}
        <motion.div variants={item}>
          <SectionHeader title="Release Notes" subtitle="Latest updates and version history" />
          <div className="space-y-3">
            {releaseNotes.map((release) => (
              <div key={release.version} className="rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-cyan-500/20">
                <button
                  onClick={() => setExpandedRelease(expandedRelease === release.version ? null : release.version)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{release.version.replace('v', '')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">{release.version}</span>
                      <StatusBadge
                        status={
                          release.type === 'Feature' ? 'info' :
                          release.type === 'Bug Fix' ? 'success' :
                          release.type === 'Breaking Change' ? 'error' :
                          release.type === 'Improvement' ? 'running' : 'info'
                        }
                        label={release.type}
                      />
                      <span className="text-[10px] text-slate-600 ml-auto">{release.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{release.description}</p>
                  </div>
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform duration-200 ${expandedRelease === release.version ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedRelease === release.version && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.06] px-4 pb-4 pt-3">
                        <ul className="space-y-1.5">
                          {release.changes.map((change, ci) => (
                            <li key={ci} className="flex items-start gap-2 text-[11px] text-slate-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 mt-1.5 shrink-0" />
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 8: Integrations */}
        <motion.div variants={item}>
          <SectionHeader title="Integrations" subtitle="Connect your tools and services" count={`${integrations.length} integrations`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((ig) => (
              <div key={ig.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-xs font-bold text-slate-400 border border-white/[0.06]">
                    {ig.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{ig.name}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-medium capitalize ${ig.color}`}>
                        <span className={`h-1 w-1 rounded-full ${ig.dot}`} />
                        {ig.status === 'coming_soon' ? 'Coming Soon' : ig.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ig.description}</p>
                    <button className="mt-2 text-[10px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                      {ig.status === 'coming_soon' ? 'Notify me →' : 'View setup guide →'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 9: FAQ */}
        <motion.div variants={item}>
          <SectionHeader title="Frequently Asked Questions" subtitle="Quick answers to common questions" count={`${faqs.length} questions`} />
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-white/[0.04] last:border-b-0">
                <button
                  onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm text-slate-300 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider shrink-0 ${
                        faq.category === 'General' ? 'text-cyan-400 bg-cyan-500/10' :
                        faq.category === 'Technical' ? 'text-violet-400 bg-violet-500/10' :
                        faq.category === 'Billing' ? 'text-amber-400 bg-amber-500/10' :
                        'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {faq.category}
                    </span>
                    <span className="font-medium truncate">{faq.q}</span>
                  </div>
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform duration-200 ml-3 ${openFaq === faq.q ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <AnimatePresence>
                  {openFaq === faq.q && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.04] px-5 py-3.5 text-xs leading-relaxed text-slate-500 ml-14">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 10: Learning Center */}
        <motion.div variants={item}>
          <SectionHeader title="Learning Center" subtitle="Structured learning paths and developer resources" />
          <div className="grid gap-4 sm:grid-cols-2">
            {learningPaths.map((path) => (
              <div key={path.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-cyan-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${path.gradient} text-white text-[10px] font-bold`}>
                    {path.name[0]}
                  </div>
                  {path.progress !== null && (
                    <span className="text-[10px] text-cyan-400 font-medium">{path.progress}% complete</span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{path.name}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{path.description}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] text-slate-600">{path.modules} modules</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-600">{path.duration}</span>
                </div>
                {path.progress !== null && (
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] mb-4">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${path.progress}%` }} />
                  </div>
                )}
                <div className="space-y-1.5 mb-4">
                  {path.modules_list.map((m, mi) => (
                    <div key={mi} className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[8px] font-mono text-slate-600">{mi + 1}</span>
                      {m}
                    </div>
                  ))}
                </div>
                <button className="w-full rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-[11px] font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-300">
                  {path.progress ? 'Continue Learning →' : 'Start Path →'}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Developer Resources</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              {devResources.map((res) => (
                <button
                  key={res.label}
                  className="group rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-left transition-all hover:border-cyan-500/30 hover:bg-cyan-500/[0.05]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-slate-500 transition-colors group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 mb-2">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={res.icon} />
                    </svg>
                  </div>
                  <h4 className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">{res.label}</h4>
                  <p className="text-[9px] text-slate-600 mt-0.5">{res.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
