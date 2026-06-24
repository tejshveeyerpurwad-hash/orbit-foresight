import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import MetricCard from '../components/MetricCard'
import PageHero from '../components/PageHero'
import ExecutiveSummary from '../components/ExecutiveSummary'
import AIRecommendations from '../components/AIRecommendations'

const services = [
  { name: 'Payment Service', risk: 87, files: 12, teams: ['Payments'], pipelines: ['CI/CD Payments'], status: 'critical', deps: ['Billing Service', 'Auth Service'], db: 'payment_db' },
  { name: 'Billing Service', risk: 65, files: 8, teams: ['Billing'], pipelines: ['CI/CD Billing'], status: 'warning', deps: ['Auth Service'], db: 'billing_db' },
  { name: 'Auth Service', risk: 23, files: 3, teams: ['Security'], pipelines: ['CI/CD Auth'], status: 'safe', deps: [], db: 'auth_db' },
  { name: 'Notification Service', risk: 45, files: 5, teams: ['Platform'], pipelines: ['CI/CD Notifications'], status: 'warning', deps: ['Auth Service'], db: null },
  { name: 'API Gateway', risk: 72, files: 9, teams: ['Platform', 'Infra'], pipelines: ['CI/CD Gateway'], status: 'critical', deps: ['Payment Service', 'Auth Service'], db: null },
]

const serviceDetails = {
  'Payment Service': {
    description: 'Core payment processing, transaction orchestration, and refund handling',
    riskBreakdown: { complexity: 82, dependencies: 91, dataSensitivity: 88, historicalFailures: 78 },
    depChain: ['Billing Service', 'Notification Service'],
    depOf: ['API Gateway'],
    linesChanged: 120,
    testCoverage: 68,
    alerts: 12,
  },
  'Billing Service': {
    description: 'Invoice generation, metering, usage calculation, and billing cycles',
    riskBreakdown: { complexity: 60, dependencies: 70, dataSensitivity: 55, historicalFailures: 45 },
    depChain: ['Notification Service'],
    depOf: ['Payment Service'],
    linesChanged: 45,
    testCoverage: 74,
    alerts: 5,
  },
  'Auth Service': {
    description: 'Authentication, authorization, token management, and SSO integration',
    riskBreakdown: { complexity: 35, dependencies: 25, dataSensitivity: 70, historicalFailures: 15 },
    depChain: [],
    depOf: ['Payment Service', 'Billing Service', 'API Gateway', 'Notification Service'],
    linesChanged: 12,
    testCoverage: 92,
    alerts: 1,
  },
  'Notification Service': {
    description: 'Email, SMS, push notification delivery with template management',
    riskBreakdown: { complexity: 50, dependencies: 40, dataSensitivity: 30, historicalFailures: 35 },
    depChain: [],
    depOf: ['Payment Service', 'Billing Service'],
    linesChanged: 28,
    testCoverage: 81,
    alerts: 3,
  },
  'API Gateway': {
    description: 'API routing, rate limiting, authentication proxy, and request transformation',
    riskBreakdown: { complexity: 75, dependencies: 80, dataSensitivity: 65, historicalFailures: 55 },
    depChain: ['Payment Service', 'Auth Service'],
    depOf: [],
    linesChanged: 67,
    testCoverage: 72,
    alerts: 8,
  },
}

const changes = [
  { file: 'src/services/payment/retry.go', type: 'modify', risk: 'high', lines: '+45/-12', author: '@alice', commit: 'a3f2b1c', timestamp: '2026-06-19 14:32', reviewers: ['@bob', '@carol'] },
  { file: 'src/services/payment/config.go', type: 'modify', risk: 'medium', lines: '+8/-2', author: '@alice', commit: 'b4c3d2e', timestamp: '2026-06-19 14:30', reviewers: ['@bob'] },
  { file: 'src/services/billing/invoice.go', type: 'modify', risk: 'medium', lines: '+22/-5', author: '@bob', commit: 'c5d4e3f', timestamp: '2026-06-19 13:15', reviewers: ['@alice', '@dave'] },
  { file: 'src/services/payment/webhook.go', type: 'delete', risk: 'low', lines: '0/-34', author: '@carol', commit: 'd6e5f4g', timestamp: '2026-06-19 11:45', reviewers: ['@alice'] },
  { file: 'src/services/api-gateway/router.go', type: 'modify', risk: 'high', lines: '+67/-23', author: '@dave', commit: 'e7f6g5h', timestamp: '2026-06-18 16:20', reviewers: ['@alice', '@bob', '@carol'] },
  { file: 'src/services/notification/templates.go', type: 'add', risk: 'low', lines: '+34/-0', author: '@carol', commit: 'f8g7h6i', timestamp: '2026-06-18 15:10', reviewers: ['@bob'] },
  { file: 'src/services/billing/metering.go', type: 'modify', risk: 'medium', lines: '+15/-8', author: '@bob', commit: 'g9h8i7j', timestamp: '2026-06-18 14:00', reviewers: ['@alice'] },
  { file: 'src/services/auth/sso.go', type: 'modify', risk: 'low', lines: '+5/-1', author: '@eve', commit: 'h0i9j8k', timestamp: '2026-06-18 12:30', reviewers: ['@dave'] },
  { file: 'src/services/payment/refund.go', type: 'modify', risk: 'high', lines: '+89/-34', author: '@alice', commit: 'i1j0k9l', timestamp: '2026-06-17 18:00', reviewers: ['@bob', '@carol', '@dave'] },
  { file: 'src/services/api-gateway/ratelimit.go', type: 'modify', risk: 'medium', lines: '+12/-7', author: '@dave', commit: 'j2k1l0m', timestamp: '2026-06-17 16:45', reviewers: ['@eve'] },
  { file: 'src/services/notification/sms.go', type: 'modify', risk: 'low', lines: '+9/-3', author: '@carol', commit: 'k3l2m1n', timestamp: '2026-06-17 15:30', reviewers: ['@bob'] },
  { file: 'src/services/billing/usage.go', type: 'modify', risk: 'medium', lines: '+18/-6', author: '@bob', commit: 'l4m3n2o', timestamp: '2026-06-17 14:20', reviewers: ['@alice', '@eve'] },
  { file: 'src/services/payment/transaction.go', type: 'modify', risk: 'high', lines: '+56/-18', author: '@alice', commit: 'm5n4o3p', timestamp: '2026-06-17 12:10', reviewers: ['@bob', '@dave'] },
  { file: 'src/services/billing/reporting.go', type: 'modify', risk: 'low', lines: '+7/-2', author: '@bob', commit: 'n6o5p4q', timestamp: '2026-06-16 18:30', reviewers: ['@carol'] },
  { file: 'src/services/api-gateway/auth.go', type: 'modify', risk: 'medium', lines: '+14/-9', author: '@dave', commit: 'o7p6q5r', timestamp: '2026-06-16 17:00', reviewers: ['@eve', '@alice'] },
]

const pipelines = [
  { name: 'CI/CD Payments', risk: 'high', status: 'failing', lastRun: '2h ago', duration: '14m 32s', tests: 245, failures: 3, coverage: 68, stages: 8, artifacts: 12 },
  { name: 'CI/CD Billing', risk: 'medium', status: 'passed', lastRun: '1h ago', duration: '8m 12s', tests: 156, failures: 0, coverage: 74, stages: 6, artifacts: 8 },
  { name: 'CI/CD Gateway', risk: 'high', status: 'running', lastRun: '30m ago', duration: '11m 45s', tests: 312, failures: 2, coverage: 72, stages: 9, artifacts: 15 },
  { name: 'CI/CD Auth', risk: 'low', status: 'passed', lastRun: '45m ago', duration: '5m 20s', tests: 198, failures: 0, coverage: 92, stages: 5, artifacts: 6 },
  { name: 'CI/CD Notifications', risk: 'medium', status: 'passed', lastRun: '20m ago', duration: '6m 33s', tests: 112, failures: 0, coverage: 81, stages: 5, artifacts: 4 },
]

const databases = [
  { name: 'payment_db', type: 'PostgreSQL 15', impact: 'High', migrationRisk: 82, rollbackPlan: 'Point-in-time recovery + schema version rollback', tables: 34, estimatedDowntime: '45s', replicationLag: '200ms', indexes: 67, size: '240GB', connections: 120 },
  { name: 'billing_db', type: 'PostgreSQL 15', impact: 'Medium', migrationRisk: 55, rollbackPlan: 'Feature flag revert + data backfill', tables: 22, estimatedDowntime: '30s', replicationLag: '150ms', indexes: 41, size: '120GB', connections: 85 },
  { name: 'auth_db', type: 'PostgreSQL 15', impact: 'Low', migrationRisk: 12, rollbackPlan: 'No migration required - additive only', tables: 8, estimatedDowntime: '0s', replicationLag: '50ms', indexes: 14, size: '18GB', connections: 200 },
  { name: 'analytics_db', type: 'ClickHouse', impact: 'None', migrationRisk: 0, rollbackPlan: 'No impact - read replica only', tables: 56, estimatedDowntime: '0s', replicationLag: '5s', indexes: 23, size: '1.2TB', connections: 45 },
  { name: 'cache_cluster', type: 'Redis 7', impact: 'Low', migrationRisk: 8, rollbackPlan: 'Cache warmup from DB on restart', tables: 0, estimatedDowntime: '10s', replicationLag: '2ms', indexes: 0, size: '32GB', connections: 350 },
]

const teams = [
  { name: 'Payments', loadPercentage: 85, impactedCode: 40, availability: '96%', members: 8, onCall: '@alice', prCount: 6, sprintPoints: 120, completedPoints: 78, incidents: 3 },
  { name: 'Billing', loadPercentage: 60, impactedCode: 25, availability: '98%', members: 5, onCall: '@bob', prCount: 3, sprintPoints: 80, completedPoints: 62, incidents: 1 },
  { name: 'Platform', loadPercentage: 45, impactedCode: 15, availability: '99%', members: 12, onCall: '@carol', prCount: 2, sprintPoints: 150, completedPoints: 135, incidents: 0 },
  { name: 'Infra', loadPercentage: 70, impactedCode: 20, availability: '97%', members: 6, onCall: '@dave', prCount: 4, sprintPoints: 90, completedPoints: 55, incidents: 2 },
  { name: 'Security', loadPercentage: 30, impactedCode: 5, availability: '100%', members: 4, onCall: '@eve', prCount: 1, sprintPoints: 60, completedPoints: 58, incidents: 0 },
]

const riskCategories = [
  { name: 'Critical', count: 1, threshold: '>80%', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', services: ['Payment Service'] },
  { name: 'High', count: 2, threshold: '60-80%', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', services: ['API Gateway', 'Billing Service'] },
  { name: 'Medium', count: 2, threshold: '30-60%', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', services: ['Notification Service'] },
  { name: 'Low', count: 1, threshold: '<30%', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', services: ['Auth Service'] },
]

const historicalChanges = [
  { date: '2026-06-12', change: 'Payment retry logic refactor', services: 3, riskScore: 68, outcome: 'success', incidents: 0, duration: '6d', rollbacks: 0, author: '@alice', criticalBugs: 0 },
  { date: '2026-06-05', change: 'Billing metering v2 migration', services: 2, riskScore: 55, outcome: 'success', incidents: 0, duration: '4d', rollbacks: 0, author: '@bob', criticalBugs: 0 },
  { date: '2026-05-28', change: 'API Gateway rate limit update', services: 1, riskScore: 42, outcome: 'partial', incidents: 1, duration: '2d', rollbacks: 1, author: '@dave', criticalBugs: 1 },
  { date: '2026-05-15', change: 'Auth SSO integration', services: 4, riskScore: 81, outcome: 'failure', incidents: 3, duration: '8d', rollbacks: 1, author: '@eve', criticalBugs: 2 },
  { date: '2026-05-01', change: 'Notification template engine', services: 1, riskScore: 35, outcome: 'success', incidents: 0, duration: '3d', rollbacks: 0, author: '@carol', criticalBugs: 0 },
  { date: '2026-04-20', change: 'Payment schema migration v3', services: 2, riskScore: 72, outcome: 'success', incidents: 0, duration: '5d', rollbacks: 0, author: '@alice', criticalBugs: 0 },
  { date: '2026-04-10', change: 'Billing invoice redesign', services: 1, riskScore: 38, outcome: 'partial', incidents: 1, duration: '3d', rollbacks: 0, author: '@bob', criticalBugs: 1 },
  { date: '2026-03-28', change: 'Infra Kubernetes upgrade', services: 5, riskScore: 92, outcome: 'failure', incidents: 4, duration: '12d', rollbacks: 2, author: '@dave', criticalBugs: 3 },
  { date: '2026-03-15', change: 'Payment webhook retry', services: 1, riskScore: 48, outcome: 'success', incidents: 0, duration: '4d', rollbacks: 0, author: '@carol', criticalBugs: 0 },
  { date: '2026-03-01', change: 'Billing currency support', services: 2, riskScore: 62, outcome: 'success', incidents: 0, duration: '6d', rollbacks: 0, author: '@bob', criticalBugs: 0 },
]

const aiRecommendations = [
  { priority: 'P0', action: 'Run full regression suite on Payment Service', impact: 'Critical path - 87% risk', effort: '2h', owner: '@alice', category: 'testing', reasoning: '83% of recent failures originated in payment processing path' },
  { priority: 'P0', action: 'Enable enhanced monitoring for API Gateway', impact: 'Detects 92% propagation risk early', effort: '30m', owner: '@dave', category: 'monitoring', reasoning: 'Gateway is the primary ingress point for all traffic' },
  { priority: 'P1', action: 'Prepare automated rollback script for payment_db', impact: 'Reduces MTTR by 65%', effort: '4h', owner: '@infra-team', category: 'rollback', reasoning: 'Database migrations have 82% failure probability under load' },
  { priority: 'P1', action: 'Review Billing Service downstream dependencies', impact: 'Mitigates 65% propagation risk', effort: '1h', owner: '@bob', category: 'review', reasoning: 'Billing changes cascade to Notification Service' },
  { priority: 'P2', action: 'Update Auth Service test coverage for SSO paths', impact: 'Current coverage 92% - edge cases', effort: '3h', owner: '@eve', category: 'testing', reasoning: 'Auth failures cause cascade failures across 4 dependent services' },
  { priority: 'P2', action: 'Create canary deployment strategy for Payment Service', impact: 'Limits blast radius to 20% of traffic', effort: '6h', owner: '@platform-team', category: 'deployment', reasoning: 'Payment is highest-risk service with no canary in place' },
  { priority: 'P3', action: 'Document rollback procedure for Notification templates', impact: 'Team knowledge gap mitigation', effort: '1h', owner: '@carol', category: 'documentation', reasoning: 'No existing rollback documentation for notification changes' },
  { priority: 'P3', action: 'Schedule load test for API Gateway rate limits', impact: 'Validates 72% risk assessment', effort: '4h', owner: '@dave', category: 'testing', reasoning: 'Rate limit changes have caused incidents in 2 of last 5 deployments' },
  { priority: 'P2', action: 'Review Payment Service data migration scripts', impact: 'Reduces migration risk from 82%', effort: '3h', owner: '@alice', category: 'review', reasoning: 'Database schema changes are the highest single point of failure' },
]

const rollbackPlans = [
  { service: 'Payment Service', steps: ['Revert retry.go', 'Revert config.go', 'Payment db migration rollback', 'Verify transaction integrity', 'Run smoke tests'], estimatedTime: '12m', type: 'automated', verification: 'Transaction success rate > 99.9%', playbook: 'docs/rollback/payment.md', owner: '@alice', lastTested: '2026-06-15' },
  { service: 'Billing Service', steps: ['Revert invoice.go', 'Revert metering.go', 'Data backfill if needed', 'Validate invoice generation'], estimatedTime: '8m', type: 'semi-automated', verification: 'Invoice generation matches expected', playbook: 'docs/rollback/billing.md', owner: '@bob', lastTested: '2026-06-10' },
  { service: 'API Gateway', steps: ['Deploy previous router.go', 'Revert rate limit config', 'Verify routing rules', 'Health check all endpoints'], estimatedTime: '5m', type: 'automated', verification: 'All routes respond 200', playbook: 'docs/rollback/gateway.md', owner: '@dave', lastTested: '2026-06-12' },
  { service: 'Auth Service', steps: ['SSO config rollback', 'Token validation pass', 'Verify session continuity'], estimatedTime: '3m', type: 'automated', verification: 'SSO login flow passes', playbook: 'docs/rollback/auth.md', owner: '@eve', lastTested: '2026-06-08' },
  { service: 'Notification Service', steps: ['Revert template changes', 'Re-send failed notifications', 'Verify delivery rates'], estimatedTime: '4m', type: 'semi-automated', verification: 'Template rendering matches', playbook: 'docs/rollback/notification.md', owner: '@carol', lastTested: '2026-05-28' },
]

const timelinePhases = [
  { name: 'Code Review', status: 'completed', services: { 'Payment Service': 'approved', 'Billing Service': 'approved', 'API Gateway': 'changes-requested', 'Auth Service': 'approved', 'Notification Service': 'pending' } },
  { name: 'Unit Test', status: 'completed', services: { 'Payment Service': 'passed', 'Billing Service': 'passed', 'API Gateway': 'failed-3', 'Auth Service': 'passed', 'Notification Service': 'passed' } },
  { name: 'Staging Deploy', status: 'in-progress', services: { 'Payment Service': 'deployed', 'Billing Service': 'deployed', 'API Gateway': 'deploying', 'Auth Service': 'pending', 'Notification Service': 'pending' } },
  { name: 'Canary Release', status: 'pending', services: { 'Payment Service': 'queued', 'Billing Service': 'queued', 'API Gateway': 'blocked', 'Auth Service': '-', 'Notification Service': '-' } },
  { name: 'Production Deploy', status: 'blocked', services: { 'Payment Service': 'pending', 'Billing Service': 'pending', 'API Gateway': 'blocked', 'Auth Service': '-', 'Notification Service': '-' } },
  { name: 'Post-Deploy Monitor', status: 'pending', services: { 'Payment Service': '-', 'Billing Service': '-', 'API Gateway': '-', 'Auth Service': '-', 'Notification Service': '-' } },
]

const approvals = [
  { service: 'Payment Service', riskLevel: 'critical', requiredApprovers: ['Lead Engineer', 'Engineering Manager', 'VP Engineering', 'DBA'], currentApprovals: 2, status: 'partial', action: 'Escalate', approvers: [{ name: 'Alice Chen', role: 'Lead Engineer', approved: true, time: '2026-06-19 14:00' }, { name: 'Bob Smith', role: 'Engineering Manager', approved: true, time: '2026-06-19 15:30' }, { name: 'Carol Davis', role: 'VP Engineering', approved: false, time: null }, { name: 'Dave Wilson', role: 'DBA', approved: false, time: null }] },
  { service: 'API Gateway', riskLevel: 'critical', requiredApprovers: ['Lead Engineer', 'Engineering Manager', 'VP Engineering'], currentApprovals: 2, status: 'partial', action: 'Escalate', approvers: [{ name: 'Dave Wilson', role: 'Lead Engineer', approved: true, time: '2026-06-19 13:00' }, { name: 'Eve Torres', role: 'Engineering Manager', approved: true, time: '2026-06-19 16:00' }, { name: 'Carol Davis', role: 'VP Engineering', approved: false, time: null }] },
  { service: 'Billing Service', riskLevel: 'high', requiredApprovers: ['Lead Engineer', 'Engineering Manager'], currentApprovals: 1, status: 'pending', action: 'Remind', approvers: [{ name: 'Bob Smith', role: 'Lead Engineer', approved: true, time: '2026-06-19 12:00' }, { name: 'Alice Chen', role: 'Engineering Manager', approved: false, time: null }] },
  { service: 'Notification Service', riskLevel: 'medium', requiredApprovers: ['Lead Engineer'], currentApprovals: 0, status: 'pending', action: 'Assign', approvers: [{ name: 'Carol Davis', role: 'Lead Engineer', approved: false, time: null }] },
  { service: 'Auth Service', riskLevel: 'low', requiredApprovers: ['Peer Review'], currentApprovals: 1, status: 'approved', action: 'None', approvers: [{ name: 'Eve Torres', role: 'Peer Reviewer', approved: true, time: '2026-06-19 10:00' }] },
]

const propagationPaths = [
  { from: 'Payment Service', to: 'API Gateway', risk: 92, type: 'direct', latency: '5ms', cascade: true, trafficPercent: 78, failureHistory: 3 },
  { from: 'Payment Service', to: 'Billing Service', risk: 87, type: 'direct', latency: '12ms', cascade: true, trafficPercent: 65, failureHistory: 2 },
  { from: 'API Gateway', to: 'Auth Service', risk: 54, type: 'indirect', latency: '3ms', cascade: false, trafficPercent: 100, failureHistory: 1 },
  { from: 'Billing Service', to: 'Notification Service', risk: 65, type: 'indirect', latency: '8ms', cascade: true, trafficPercent: 34, failureHistory: 2 },
  { from: 'Payment Service', to: 'Notification Service', risk: 48, type: 'transitive', latency: '15ms', cascade: false, trafficPercent: 22, failureHistory: 0 },
  { from: 'Payment Service', to: 'Auth Service', risk: 38, type: 'transitive', latency: '7ms', cascade: false, trafficPercent: 100, failureHistory: 0 },
  { from: 'API Gateway', to: 'Notification Service', risk: 22, type: 'transitive', latency: '10ms', cascade: false, trafficPercent: 22, failureHistory: 0 },
]

const blastZones = [
  { name: 'Payment Service', radius: 140, risk: 87, color: '#ef4444', layer: 0, x: 300, y: 250, label: 'Inner Zone' },
  { name: 'Billing Service', radius: 100, risk: 65, color: '#f97316', layer: 1, x: 150, y: 140, label: 'Secondary Zone' },
  { name: 'API Gateway', radius: 100, risk: 72, color: '#f97316', layer: 1, x: 460, y: 140, label: 'Secondary Zone' },
  { name: 'Auth Service', radius: 75, risk: 23, color: '#22c55e', layer: 2, x: 180, y: 360, label: 'Outer Zone' },
  { name: 'Notification Service', radius: 75, risk: 45, color: '#eab308', layer: 2, x: 420, y: 360, label: 'Outer Zone' },
]

const costImpact = [
  { service: 'Payment Service', computeCost: '$2,450/mo', storageCost: '$890/mo', networkCost: '$1,200/mo', totalCost: '$4,540/mo', changeCost: '$680', rollbackCost: '$340', riskPremium: '$1,360' },
  { service: 'Billing Service', computeCost: '$1,200/mo', storageCost: '$450/mo', networkCost: '$600/mo', totalCost: '$2,250/mo', changeCost: '$320', rollbackCost: '$160', riskPremium: '$675' },
  { service: 'API Gateway', computeCost: '$3,100/mo', storageCost: '$120/mo', networkCost: '$2,400/mo', totalCost: '$5,620/mo', changeCost: '$780', rollbackCost: '$390', riskPremium: '$1,686' },
  { service: 'Auth Service', computeCost: '$800/mo', storageCost: '$60/mo', networkCost: '$300/mo', totalCost: '$1,160/mo', changeCost: '$140', rollbackCost: '$70', riskPremium: '$348' },
  { service: 'Notification Service', computeCost: '$950/mo', storageCost: '$200/mo', networkCost: '$450/mo', totalCost: '$1,600/mo', changeCost: '$210', rollbackCost: '$105', riskPremium: '$480' },
]

const complianceImpact = [
  { framework: 'SOC 2', control: 'CC6.1 - Logical Access', status: 'affected', risk: 'Payment Service auth config changes', remediation: 'Re-certify access controls post-deploy', deadline: '2026-06-30', owner: '@eve' },
  { framework: 'PCI DSS', control: 'Req 3 - Data Protection', status: 'critical', risk: 'Payment transaction data flow modified', remediation: 'Full PCI scan required', deadline: '2026-06-25', owner: '@alice' },
  { framework: 'GDPR', control: 'Art 17 - Right to Erasure', status: 'review', risk: 'Billing data retention policy change', remediation: 'DPIA assessment update', deadline: '2026-07-05', owner: '@bob' },
  { framework: 'HIPAA', control: '164.312 - Audit Controls', status: 'unaffected', risk: 'No PHI data paths modified', remediation: 'No action required', deadline: null, owner: null },
]

const endpointImpact = [
  { service: 'Payment Service', endpoint: 'POST /v1/charges', method: 'POST', changeType: 'modify', risk: 'high', trafficPercent: 45, sla: '200ms', latency: '180ms', dependsOn: ['Billing', 'Auth'] },
  { service: 'Payment Service', endpoint: 'POST /v1/refunds', method: 'POST', changeType: 'modify', risk: 'high', trafficPercent: 12, sla: '500ms', latency: '350ms', dependsOn: ['Billing'] },
  { service: 'Payment Service', endpoint: 'GET /v1/transactions', method: 'GET', changeType: 'modify', risk: 'medium', trafficPercent: 30, sla: '100ms', latency: '85ms', dependsOn: [] },
  { service: 'Billing Service', endpoint: 'POST /v1/invoices', method: 'POST', changeType: 'modify', risk: 'medium', trafficPercent: 18, sla: '300ms', latency: '220ms', dependsOn: ['Auth'] },
  { service: 'Billing Service', endpoint: 'GET /v1/usage', method: 'GET', changeType: 'modify', risk: 'low', trafficPercent: 25, sla: '150ms', latency: '95ms', dependsOn: [] },
  { service: 'API Gateway', endpoint: '/*', method: 'ALL', changeType: 'modify', risk: 'high', trafficPercent: 100, sla: '10ms', latency: '8ms', dependsOn: ['Auth'] },
  { service: 'Notification Service', endpoint: 'POST /v1/send', method: 'POST', changeType: 'add', risk: 'low', trafficPercent: 8, sla: '1s', latency: '750ms', dependsOn: ['Auth'] },
]

const monitoringAlerts = [
  { service: 'Payment Service', alertType: 'Error Rate', threshold: '> 1%', current: '2.3%', status: 'triggered', severity: 'critical', action: 'Investigate immediately', owner: '@alice' },
  { service: 'Payment Service', alertType: 'P99 Latency', threshold: '> 500ms', current: '420ms', status: 'warning', severity: 'high', action: 'Monitor during deploy', owner: '@alice' },
  { service: 'API Gateway', alertType: '5xx Rate', threshold: '> 0.5%', current: '0.8%', status: 'triggered', severity: 'critical', action: 'Rollback if persists', owner: '@dave' },
  { service: 'API Gateway', alertType: 'Connection Pool', threshold: '> 80%', current: '76%', status: 'warning', severity: 'high', action: 'Scale up if needed', owner: '@dave' },
  { service: 'Billing Service', alertType: 'Throughput', threshold: '< 100 rpm', current: '85 rpm', status: 'warning', severity: 'medium', action: 'Check queue depth', owner: '@bob' },
  { service: 'Auth Service', alertType: 'Token Validation', threshold: '> 99.9%', current: '99.95%', status: 'ok', severity: 'low', action: 'No action', owner: '@eve' },
  { service: 'Notification Service', alertType: 'Delivery Rate', threshold: '> 98%', current: '97.5%', status: 'warning', severity: 'medium', action: 'Check provider status', owner: '@carol' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function ChangeImpactAnalysis() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        <PageHero
          title="Boardroom Decision Center"
          subtitle="Executive impact analysis quantifying business risk, revenue exposure, and remediation ROI across all services."
          impact="$2.8M"
          impactLabel="Revenue at Risk"
          confidence={92}
          actionLabel="View CTO Report"
          actionTo="/cto-report"
        />

        <ExecutiveSummary
          pageTitle="Boardroom Impact Overview"
          metrics={{
            revenueProtected: '$2.4M',
            costAvoided: '$840K', 
            downtimePrevented: '47min',
            incidentsAnalyzed: 128,
            aiConfidence: 94,
            criticalRisks: 3,
            servicesMonitored: 47
          }}
          confidence={94}
        />

        <AIRecommendations />

        <motion.div variants={item}>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Change Impact Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">Service-level risk propagation and blast radius visualization</p>
        </motion.div>

        <motion.div variants={item} className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Impacted Services" value="5" color="text-red-400" trend="↑ 2 from last change" />
          <StatCard label="Files Changed" value="15" color="text-yellow-400" trend="+11 vs last sprint" />
          <StatCard label="Impacted Teams" value="5" color="text-orange-400" trend="Cross-team coordination" />
          <StatCard label="Databases Affected" value="3" color="text-blue-400" trend="Migration required" />
          <StatCard label="Pipelines Triggered" value="5" color="text-purple-400" trend="3 critical paths" />
          <StatCard label="Overall Risk Score" value="72%" color="text-red-400" trend="↑ 15% from baseline" />
        </motion.div>

        <div className="grid gap-3 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Service Impact Map</h3>
              <StatusBadge status="warning" label="5 services" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {services.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedService(selectedService?.name === s.name ? null : s)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    selectedService?.name === s.name
                      ? 'border-brand/30 bg-brand/[0.06]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{s.name}</span>
                    <StatusBadge status={s.status} label={`${s.risk}%`} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-600">
                    <span>{s.files} files</span>
                    <span>{s.teams.join(', ')}</span>
                    {s.db && <span>{s.db}</span>}
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-slate-800">
                    <div
                      className={`h-1 rounded-full transition-all ${
                        s.risk > 70 ? 'bg-red-500' : s.risk > 40 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${s.risk}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-600">
                    <span>{s.pipelines[0]}</span>
                    <span>{s.deps.length} deps</span>
                  </div>
                </button>
              ))}
            </div>
            {selectedService && serviceDetails[selectedService.name] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 rounded-lg border border-brand/20 bg-brand/[0.04] p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-brand-light">{selectedService.name} — Full Dependency Chain</h4>
                  <StatusBadge status={selectedService.status} label={`${selectedService.risk}% Risk`} />
                </div>
                <p className="text-xs text-slate-500 mb-3">{serviceDetails[selectedService.name].description}</p>
                <div className="grid gap-2 sm:grid-cols-4 mb-3">
                  {Object.entries(serviceDetails[selectedService.name].riskBreakdown).map(([k, v]) => (
                    <div key={k} className="rounded bg-white/[0.04] p-2">
                      <span className="text-[10px] text-slate-600 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-800">
                          <div className={`h-1.5 rounded-full ${v > 70 ? 'bg-red-500' : v > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${v}%` }} />
                        </div>
                        <span className="text-xs text-white">{v}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <span className="text-[10px] text-slate-600">Teams</span>
                    <div className="flex gap-1 mt-1">
                      {selectedService.teams.map(t => (
                        <span key={t} className="rounded bg-white/[0.06] px-2 py-1 text-xs text-slate-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Upstream Dependencies</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {selectedService.deps.length > 0 ? selectedService.deps.map(d => (
                        <span key={d} className="rounded bg-white/[0.06] px-2 py-1 text-xs text-slate-400">{d}</span>
                      )) : <span className="text-xs text-slate-600">None</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Downstream Dependents</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {serviceDetails[selectedService.name].depOf.length > 0 ? serviceDetails[selectedService.name].depOf.map(d => (
                        <span key={d} className="rounded bg-white/[0.06] px-2 py-1 text-xs text-slate-400">{d}</span>
                      )) : <span className="text-xs text-slate-600">None</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Database</span>
                    <div className="mt-1 text-xs text-slate-400">{selectedService.db || 'No database'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Lines Changed</span>
                    <div className="mt-1 text-xs text-slate-400">{serviceDetails[selectedService.name].linesChanged}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Test Coverage</span>
                    <div className="mt-1 text-xs text-slate-400">{serviceDetails[selectedService.name].testCoverage}%</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
            <h3 className="text-sm font-semibold text-white mb-3">Change Set Analysis</h3>
            <div className="space-y-2">
              {changes.slice(0, 10).map((c, i) => (
                <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">{c.file.split('/').pop()}</span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={c.risk} label={c.risk} dot={false} />
                      <span className="text-[10px] text-slate-600">{c.lines}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span className="capitalize">{c.type}</span>
                      <span>by {c.author}</span>
                    </div>
                    <div className="flex gap-1">
                      {c.reviewers.slice(0, 2).map((r, j) => (
                        <span key={j} className="text-[9px] text-slate-700 bg-white/[0.04] px-1 rounded">{r}</span>
                      ))}
                      {c.reviewers.length > 2 && <span className="text-[9px] text-slate-600">+{c.reviewers.length - 2}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-700">
                    <span>{c.commit?.substring(0, 7)}</span>
                    <span>{c.timestamp?.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 text-xs text-slate-500 hover:text-slate-400 transition-colors">View all 15 changes →</button>
          </motion.div>
        </div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Dependency Intelligence</h3>
            <StatusBadge status="warning" label="7 dependency paths" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {propagationPaths.map((p, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-white">
                    <span>{p.from.split(' ')[0]}</span>
                    <span className="text-slate-600">→</span>
                    <span>{p.to.split(' ')[0]}</span>
                  </div>
                  <StatusBadge status={p.risk > 70 ? 'critical' : p.risk > 40 ? 'warning' : 'safe'} label={`${p.risk}%`} />
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 mb-2">
                  <div
                    className={`h-1.5 rounded-full ${p.risk > 70 ? 'bg-red-500' : p.risk > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${p.risk}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span className="capitalize">{p.type}</span>
                  <span>{p.latency}</span>
                  <span>{p.trafficPercent}% traffic</span>
                  {p.cascade && <span className="text-yellow-400">cascade</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Blast Radius Visualization</h3>
            <StatusBadge status="warning" label="5 services" />
          </div>
          <div className="flex justify-center">
            <svg viewBox="0 0 600 500" className="w-full max-w-2xl h-auto">
              <defs>
                {blastZones.map((z, i) => (
                  <radialGradient key={i} id={`grad-${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={z.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={z.color} stopOpacity="0.02" />
                  </radialGradient>
                ))}
              </defs>
              <circle cx="300" cy="250" r="180" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="300" cy="250" r="120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="300" cy="250" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
              {blastZones.map((z, i) => (
                <g key={i}>
                  <circle cx={z.x} cy={z.y} r={z.radius} fill={`url(#grad-${i})`} stroke={z.color} strokeWidth="1.5" strokeOpacity="0.5" />
                  <text x={z.x} y={z.y - 8} textAnchor="middle" fill={z.color} fontSize="11" fontWeight="600" fontFamily="monospace">{z.name}</text>
                  <text x={z.x} y={z.y + 10} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">{z.risk}% risk</text>
                </g>
              ))}
              {blastZones.map((z, i) => {
                if (i === 0) return null
                const cx = (blastZones[0].x + z.x) / 2
                const cy = (blastZones[0].y + z.y) / 2
                const opacity = z.risk > 60 ? '0.6' : '0.3'
                return (
                  <line key={`line-${i}`} x1={blastZones[0].x} y1={blastZones[0].y} x2={z.x} y2={z.y} stroke={z.color} strokeWidth="0.5" strokeOpacity={opacity} strokeDasharray="3 2" />
                )
              })}
              {blastZones.filter(z => z.layer === 2).map((z, i) => {
                const partner = blastZones.filter(b => b.layer === 2).find(b => b.name !== z.name)
                if (!partner) return null
                return (
                  <line key={`outer-${i}`} x1={z.x} y1={z.y} x2={partner.x} y2={partner.y} stroke={z.color} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 3" />
                )
              })}
              <text x="300" y="480" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace">Concentric rings represent blast radius zones — inner (Payment) → outer (Auth + Notifications)</text>
            </svg>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Risk Propagation Map</h3>
            <StatusBadge status="critical" label="7 active paths" />
          </div>
          <div className="space-y-2">
            {propagationPaths.map((p, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{p.from.split(' ')[0]}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={p.risk > 70 ? '#ef4444' : p.risk > 40 ? '#f97316' : '#22c55e'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium text-white">{p.to.split(' ')[0]}</span>
                    <StatusBadge status={p.risk > 70 ? 'critical' : p.risk > 40 ? 'warning' : 'safe'} label={`${p.risk}%`} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <span className="capitalize">{p.type}</span>
                    <span>{p.latency}</span>
                    <span>{p.trafficPercent}% traffic</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.risk}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-2 rounded-full ${p.risk > 70 ? 'bg-red-500' : p.risk > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                  />
                </div>
                {p.cascade && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] text-yellow-500">⚠ Cascade risk</span>
                    <span className="text-[9px] text-slate-600">Failure propagates to downstream services</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <h3 className="text-sm font-semibold text-white mb-3">Impacted Pipelines</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {pipelines.map((p, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{p.name}</span>
                  <StatusBadge status={p.risk} label={p.risk} dot={false} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    p.status === 'passed' ? 'bg-green-500/10 text-green-400' :
                    p.status === 'failing' ? 'bg-red-500/10 text-red-400' :
                    p.status === 'running' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                  }`}>{p.status}</span>
                  <span className="text-[10px] text-slate-600">{p.lastRun}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                  <span>Duration: {p.duration}</span>
                  <span>Tests: {p.tests}</span>
                  <span>Failures: {p.failures}</span>
                  <span>Coverage: {p.coverage}%</span>
                  <span>Stages: {p.stages}</span>
                  <span>Artifacts: {p.artifacts}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Database Impact Assessment</h3>
            <StatusBadge status="warning" label="5 data stores" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {databases.map((db, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-white">{db.name}</span>
                    <span className="text-[10px] text-slate-600 ml-2">{db.type}</span>
                  </div>
                  <StatusBadge status={db.impact === 'High' ? 'critical' : db.impact === 'Medium' ? 'warning' : db.impact === 'Low' ? 'warning' : 'safe'} label={db.impact} />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-[10px] text-slate-600">Migration Risk</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800">
                        <div className={`h-1.5 rounded-full ${db.migrationRisk > 70 ? 'bg-red-500' : db.migrationRisk > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${db.migrationRisk}%` }} />
                      </div>
                      <span className="text-xs text-white">{db.migrationRisk}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Tables</span>
                    <span className="text-xs text-white ml-1">{db.tables}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Indexes</span>
                    <span className="text-xs text-white ml-1">{db.indexes}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Size</span>
                    <span className="text-xs text-white ml-1">{db.size}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Est. Downtime</span>
                    <span className="text-xs text-white ml-1">{db.estimatedDowntime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600">Replication Lag</span>
                    <span className="text-xs text-white ml-1">{db.replicationLag}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600">Rollback Plan</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{db.rollbackPlan}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Team Impact Assessment</h3>
            <StatusBadge status="warning" label="5 teams affected" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {teams.map((t, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{t.name}</span>
                  <span className="text-[10px] text-slate-600">{t.members} members</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                      <span>Sprint Load</span>
                      <span>{t.loadPercentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div className={`h-1.5 rounded-full ${t.loadPercentage > 80 ? 'bg-red-500' : t.loadPercentage > 50 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${t.loadPercentage}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Impacted Code</span>
                    <span>{t.impactedCode}%</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Availability</span>
                    <span>{t.availability}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Open PRs</span>
                    <span>{t.prCount}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Sprint Points</span>
                    <span>{t.completedPoints}/{t.sprintPoints}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>On-Call</span>
                    <span className="text-slate-400">{t.onCall}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Incidents (30d)</span>
                    <span className={t.incidents > 0 ? 'text-yellow-400' : 'text-green-400'}>{t.incidents}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Cost Impact Analysis</h3>
            <StatusBadge status="warning" label="5 services" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {costImpact.map((c, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{c.service}</span>
                  <span className="text-xs text-slate-400">{c.totalCost}</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-600">
                  <div className="flex justify-between"><span>Compute</span><span>{c.computeCost}</span></div>
                  <div className="flex justify-between"><span>Storage</span><span>{c.storageCost}</span></div>
                  <div className="flex justify-between"><span>Network</span><span>{c.networkCost}</span></div>
                  <div className="border-t border-white/[0.04] pt-1 mt-1">
                    <div className="flex justify-between"><span>Change Cost</span><span className="text-yellow-400">{c.changeCost}</span></div>
                    <div className="flex justify-between"><span>Rollback Cost</span><span className="text-orange-400">{c.rollbackCost}</span></div>
                    <div className="flex justify-between"><span>Risk Premium</span><span className="text-red-400">{c.riskPremium}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Compliance & Audit Impact</h3>
            <StatusBadge status="critical" label="3 affected" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {complianceImpact.map((ci, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-white">{ci.framework}</span>
                    <span className="text-[10px] text-slate-600 ml-2">{ci.control}</span>
                  </div>
                  <StatusBadge status={ci.status === 'critical' ? 'critical' : ci.status === 'affected' ? 'warning' : ci.status === 'review' ? 'warning' : 'safe'} label={ci.status} dot={false} />
                </div>
                <p className="text-[11px] text-slate-400 mb-2 leading-tight">{ci.risk}</p>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Remediation</span>
                </div>
                <p className="text-[10px] text-yellow-400 mb-1">{ci.remediation}</p>
                {ci.deadline && <div className="flex justify-between text-[10px] text-slate-600"><span>Deadline</span><span className="text-red-400">{ci.deadline}</span></div>}
                {ci.owner && <div className="flex justify-between text-[10px] text-slate-600"><span>Owner</span><span>{ci.owner}</span></div>}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Endpoint Impact Analysis</h3>
            <StatusBadge status="warning" label="7 endpoints" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {endpointImpact.map((ep, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-white truncate max-w-[140px]">{ep.endpoint}</span>
                  <span className={`text-[9px] px-1 rounded ${
                    ep.method === 'POST' ? 'bg-green-500/10 text-green-400' :
                    ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>{ep.method}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[9px] text-slate-600">{ep.service.split(' ')[0]}</span>
                  <StatusBadge status={ep.risk} label={ep.changeType} dot={false} />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-600">
                  <span>Traffic: {ep.trafficPercent}%</span>
                  <span>SLA: {ep.sla}</span>
                  <span>Latency: {ep.latency}</span>
                  <span>Deps: {ep.dependsOn.length > 0 ? ep.dependsOn.join(',') : 'none'}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Monitoring & Alerting Impact</h3>
            <StatusBadge status="critical" label="2 triggered" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {monitoringAlerts.map((ma, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white">{ma.service.split(' ')[0]}</span>
                  <StatusBadge status={ma.severity === 'critical' ? 'critical' : ma.severity === 'high' ? 'warning' : ma.severity === 'medium' ? 'warning' : 'safe'} label={ma.severity} dot={false} />
                </div>
                <div className="text-[11px] text-slate-400 mb-1">{ma.alertType}</div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-600 mb-1">
                  <span>Threshold: {ma.threshold}</span>
                  <span>Current: <span className={ma.status === 'triggered' ? 'text-red-400' : ma.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>{ma.current}</span></span>
                  <span className={ma.status === 'triggered' ? 'col-span-2 text-red-400' : 'col-span-2'}>{ma.action}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-700">
                  <span>Status</span>
                  <span className={ma.status === 'triggered' ? 'text-red-400' : ma.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>{ma.status}</span>
                  <span>{ma.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Change Risk Score Breakdown</h3>
            <StatusBadge status="critical" label="Overall: 72%" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 128 128" className="w-32 h-32 -rotate-90">
                      <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <motion.circle
                        cx="64" cy="64" r="54" fill="none" stroke="url(#riskGradient)" strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: 339.292, strokeDashoffset: 339.292 }}
                        animate={{ strokeDashoffset: 339.292 * (1 - 72 / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="40%" stopColor="#eab308" />
                          <stop offset="70%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold text-white">72</span>
                        <span className="text-xs text-slate-500 block">/100</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-red-400">↑ 15% from baseline — requires Engineering Manager approval</span>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                {riskCategories.map((rc, i) => (
                  <div key={i} className={`rounded-lg border ${rc.border} ${rc.bg} p-3`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${rc.color}`}>{rc.name}</span>
                      <span className="text-lg font-bold text-white">{rc.count}</span>
                    </div>
                    <span className="text-[10px] text-slate-600">Threshold: {rc.threshold}</span>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {rc.services.map(s => (
                        <span key={s} className="text-[9px] text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded">{s.split(' ')[0]}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                  <span className="text-xs text-slate-600">Critical Services</span>
                  <span className="text-lg font-bold text-white block">2</span>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                  <span className="text-xs text-slate-600">Risk Trend</span>
                  <span className="text-lg font-bold text-red-400 block">↑ 15%</span>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
                  <span className="text-xs text-slate-600">Mitigation</span>
                  <span className="text-lg font-bold text-yellow-400 block">3 req</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Historical Impact Comparison</h3>
            <StatusBadge status="warning" label="Last 10 changes" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-2 text-slate-600 font-medium">Date</th>
                  <th className="text-left py-2 px-2 text-slate-600 font-medium">Change</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Services</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Risk</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Outcome</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Incidents</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Duration</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Rollbacks</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Author</th>
                </tr>
              </thead>
              <tbody>
                {historicalChanges.map((hc, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-2 px-2 text-slate-400">{hc.date}</td>
                    <td className="py-2 px-2 text-white max-w-[160px] truncate">{hc.change}</td>
                    <td className="py-2 px-2 text-center text-slate-400">{hc.services}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[10px] font-medium ${
                        hc.riskScore > 70 ? 'text-red-400' : hc.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'
                      }`}>{hc.riskScore}%</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        hc.outcome === 'success' ? 'bg-green-500/10 text-green-400' :
                        hc.outcome === 'partial' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                      }`}>{hc.outcome}</span>
                    </td>
                    <td className="py-2 px-2 text-center text-slate-400">{hc.incidents}</td>
                    <td className="py-2 px-2 text-center text-slate-400">{hc.duration}</td>
                    <td className="py-2 px-2 text-center text-slate-400">{hc.rollbacks}</td>
                    <td className="py-2 px-2 text-center text-slate-400">{hc.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
            <StatusBadge status="warning" label={`${aiRecommendations.length} actions`} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aiRecommendations.map((rec, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    rec.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                    rec.priority === 'P1' ? 'bg-orange-500/10 text-orange-400' :
                    rec.priority === 'P2' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>{rec.priority}</span>
                  <span className="text-[10px] text-slate-600 capitalize">{rec.category}</span>
                </div>
                <p className="text-xs text-white mb-2 leading-snug">{rec.action}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Impact</span>
                    <span className="text-slate-400 text-right max-w-[120px]">{rec.impact}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Effort</span>
                    <span>{rec.effort}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Owner</span>
                    <span className="text-slate-400">{rec.owner}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Reasoning</span>
                    <span className="text-slate-500 text-right max-w-[140px] truncate" title={rec.reasoning}>{rec.reasoning.substring(0, 30)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Rollback Strategy</h3>
            <StatusBadge status="warning" label="5 rollback plans" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {rollbackPlans.map((rp, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{rp.service}</span>
                  <StatusBadge status={rp.type === 'automated' ? 'safe' : 'warning'} label={rp.type} dot={false} />
                </div>
                <div className="space-y-1 mb-2">
                  {rp.steps.map((step, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <span className="text-[9px] text-slate-700 mt-0.5">{j + 1}.</span>
                      <span className="text-[10px] text-slate-400">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.04] pt-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Est. Time</span>
                    <span className="text-slate-400">{rp.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Verification</span>
                    <span className="text-slate-400 text-right max-w-[100px] truncate">{rp.verification}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Playbook</span>
                    <span className="text-blue-400">{rp.playbook}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Owner</span>
                    <span className="text-slate-400">{rp.owner}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Last Tested</span>
                    <span className="text-slate-400">{rp.lastTested}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Change Timeline</h3>
            <StatusBadge status="warning" label="Staging in progress" />
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-2 min-w-[800px]">
              {timelinePhases.map((phase, i) => (
                <div key={i} className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    <span className={`w-2 h-2 rounded-full ${
                      phase.status === 'completed' ? 'bg-green-500' :
                      phase.status === 'in-progress' ? 'bg-blue-500' :
                      phase.status === 'blocked' ? 'bg-red-500' : 'bg-slate-700'
                    }`} />
                    <span className="text-[11px] font-medium text-white whitespace-nowrap">{phase.name}</span>
                    <StatusBadge status={phase.status === 'completed' ? 'safe' : phase.status === 'in-progress' ? 'warning' : phase.status === 'blocked' ? 'critical' : 'default'} label={phase.status === 'completed' ? 'done' : phase.status === 'in-progress' ? 'active' : phase.status === 'blocked' ? 'blocked' : 'waiting'} />
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                    {Object.entries(phase.services).map(([svc, st]) => (
                      <div key={svc} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
                        <span className="text-[9px] text-slate-500">{svc.split(' ')[0]}</span>
                        <span className={`text-[9px] px-1 rounded ${
                          st === 'approved' || st === 'passed' || st === 'deployed' ? 'text-green-400 bg-green-500/10' :
                          st === 'changes-requested' || st === 'failed-3' || st === 'blocked' ? 'text-red-400 bg-red-500/10' :
                          st === 'deploying' || st === 'queued' ? 'text-blue-400 bg-blue-500/10' :
                          st === 'pending' ? 'text-slate-600 bg-slate-500/10' :
                          st === '-' ? 'text-slate-700' :
                          'text-yellow-400 bg-yellow-500/10'
                        }`}>{st === '-' ? '—' : st === 'failed-3' ? 'failed' : st === 'changes-requested' ? 'changes' : st.split('-')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Change Approval Matrix</h3>
            <StatusBadge status="warning" label="2 partial approvals" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-2 text-slate-600 font-medium">Service</th>
                  <th className="text-left py-2 px-2 text-slate-600 font-medium">Risk Level</th>
                  <th className="text-left py-2 px-2 text-slate-600 font-medium">Required Approvers</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Approvals</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Status</th>
                  <th className="text-center py-2 px-2 text-slate-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((a, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-2 px-2 text-white">{a.service}</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={a.riskLevel === 'critical' ? 'critical' : a.riskLevel === 'high' ? 'warning' : a.riskLevel === 'medium' ? 'warning' : 'safe'} label={a.riskLevel} dot={false} />
                    </td>
                    <td className="py-2 px-2 text-slate-400">{a.requiredApprovers.join(', ')}</td>
                    <td className="py-2 px-2 text-center text-slate-400">{a.currentApprovals}/{a.requiredApprovers.length}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        a.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        a.status === 'partial' ? 'bg-yellow-500/10 text-yellow-400' :
                        a.status === 'pending' ? 'bg-slate-500/10 text-slate-400' : 'bg-red-500/10 text-red-400'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      {a.action !== 'None' ? (
                        <button className="text-[10px] px-2 py-1 rounded bg-brand/[0.1] text-brand-light hover:bg-brand/[0.15] transition-colors">
                          {a.action}
                        </button>
                      ) : (
                        <span className="text-[10px] text-green-500">✓ Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Approver Details</h3>
            <StatusBadge status="warning" label="6 of 13 approved" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {approvals.map((a, i) => (
              <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{a.service.split(' ')[0]}</span>
                  <StatusBadge status={a.status === 'approved' ? 'safe' : a.status === 'partial' ? 'warning' : 'default'} label={a.status} dot={false} />
                </div>
                <div className="space-y-1">
                  {a.approvers.map((ap, j) => (
                    <div key={j} className="flex items-center justify-between text-[10px]">
                      <div>
                        <span className="text-slate-400">{ap.name}</span>
                        <span className="text-slate-600 ml-1">({ap.role})</span>
                      </div>
                      {ap.approved ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-slate-700">○</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Risk Mitigation Checklist</h3>
            <StatusBadge status="warning" label="4 of 8 complete" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400">✓</span>
                <span className="text-xs text-white">Code review completed</span>
              </div>
              <div className="text-[10px] text-slate-600">All 15 changes reviewed by at least 2 peers</div>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400">✓</span>
                <span className="text-xs text-white">Unit tests passing</span>
              </div>
              <div className="text-[10px] text-slate-600">1,023 tests passing across all services</div>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400">✓</span>
                <span className="text-xs text-white">Integration tests passing</span>
              </div>
              <div className="text-[10px] text-slate-600">456 integration tests, 3 known failures in gateway</div>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400">✓</span>
                <span className="text-xs text-white">Rollback plan documented</span>
              </div>
              <div className="text-[10px] text-slate-600">All 5 services have verified rollback plans</div>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400">○</span>
                <span className="text-xs text-white">Load test results reviewed</span>
              </div>
              <div className="text-[10px] text-slate-600">Pending — scheduled for pre-deploy</div>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400">○</span>
                <span className="text-xs text-white">Security scan completed</span>
              </div>
              <div className="text-[10px] text-slate-600">SAST passed, DAST pending for payment service</div>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400">○</span>
                <span className="text-xs text-white">Database migration dry run</span>
              </div>
              <div className="text-[10px] text-slate-600">payment_db migration needs staging validation</div>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400">✗</span>
                <span className="text-xs text-white">Production canary approved</span>
              </div>
              <div className="text-[10px] text-slate-600">Blocked — API Gateway test failures not resolved</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Stakeholder Notification Matrix</h3>
            <StatusBadge status="warning" label="5 notifications pending" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs font-medium text-white">Engineering</span>
              <div className="mt-2 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-600">Notified</span><span className="text-green-400">✓ 12/12</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Channel</span><span className="text-slate-400">#eng-deploys</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Time</span><span className="text-slate-400">30 min before</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs font-medium text-white">Product</span>
              <div className="mt-2 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-600">Notified</span><span className="text-yellow-400">○ 1/3</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Channel</span><span className="text-slate-400">#product-updates</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Time</span><span className="text-yellow-400">Overdue</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs font-medium text-white">Customer Support</span>
              <div className="mt-2 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-600">Notified</span><span className="text-yellow-400">○ 0/2</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Channel</span><span className="text-slate-400">#support-escalations</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Time</span><span className="text-yellow-400">Pending</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-xs font-medium text-white">Security</span>
              <div className="mt-2 space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-slate-600">Notified</span><span className="text-green-400">✓ 3/3</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Channel</span><span className="text-slate-400">#security-alerts</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Time</span><span className="text-slate-400">1 hour before</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Cross-Service Contract Violation Risk</h3>
            <StatusBadge status="critical" label="3 potential violations" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">Payment → Billing</span>
                <StatusBadge status="critical" label="87% risk" />
              </div>
              <p className="text-[10px] text-slate-400 mb-1">Invoice schema change may break payment reconciliation</p>
              <div className="text-[10px] text-slate-600">
                <span>Contract: InvoiceResponse.v2</span>
                <span className="block">Field changed: total_amount (decimal→float)</span>
              </div>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">API Gateway → Auth</span>
                <StatusBadge status="critical" label="54% risk" />
              </div>
              <p className="text-[10px] text-slate-400 mb-1">Token validation header renamed — all routes affected</p>
              <div className="text-[10px] text-slate-600">
                <span>Contract: Authorization header</span>
                <span className="block">Change: X-Auth-Token → Authorization: Bearer</span>
              </div>
            </div>
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">Billing → Notification</span>
                <StatusBadge status="warning" label="65% risk" />
              </div>
              <p className="text-[10px] text-slate-400 mb-1">Template variables removed from invoice event payload</p>
              <div className="text-[10px] text-slate-600">
                <span>Contract: InvoiceEvent.payload</span>
                <span className="block">Missing field: discount_applied</span>
              </div>
            </div>
          </div>
        </motion.div>

        <MetricCard
          title="Impacted Pipelines"
          metrics={[
            { label: 'CI/CD Payments', value: 'High Risk', badge: 'critical' },
            { label: 'CI/CD Billing', value: 'Medium Risk', badge: 'warning' },
            { label: 'CI/CD Gateway', value: 'High Risk', badge: 'critical' },
            { label: 'CI/CD Auth', value: 'Low Risk', badge: 'safe' },
            { label: 'CI/CD Notifications', value: 'Medium Risk', badge: 'warning' },
          ]}
        />
      </motion.div>
    </Layout>
  )
}
