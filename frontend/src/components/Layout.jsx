import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import QuickActionBar from './QuickActionBar'
import Footer from './Footer'
import CommandPalette from './CommandPalette'
import NotificationCenter from './NotificationCenter'
import CommandCenterDrawer from './CommandCenterDrawer'
import ExecutiveCommandHeader from './ExecutiveCommandHeader'
import CinematicMissionBriefing from './CinematicMissionBriefing'
import AICopilot from './AICopilot'
import OrbitLogo from './OrbitLogo'
import { initLayoutGuard } from '../utils/layoutGuard'

/* ─────────────────────────────────────────────────────────────
   Navigation definition
───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: '/dashboard',          label: 'Dashboard',      icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { to: '/intelligence',       label: 'Intelligence',   icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z' },
  { to: '/time-machine',       label: 'Time Machine',   icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/knowledge-graph',    label: 'Dependency Map', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  { to: '/cto-report',         label: 'Impact',         icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { to: '/ai-planner',         label: 'AI Strategy',    icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
  { to: '/decision-simulator', label: 'Simulator',      icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z' },
  { to: '/execution-planner',  label: 'Execute',        icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  { to: '/analytics',          label: 'Analytics',      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
]

const WORKFLOW = [
  { to: '/dashboard',         label: 'Dashboard',      stage: 1, desc: 'What is happening right now?' },
  { to: '/intelligence',      label: 'Intelligence',   stage: 2, desc: 'Find the root cause' },
  { to: '/time-machine',      label: 'Time Machine',   stage: 3, desc: 'Replay incident history' },
  { to: '/knowledge-graph',   label: 'Dependency Map', stage: 4, desc: 'Map the blast radius' },
  { to: '/cto-report',        label: 'Impact',         stage: 5, desc: 'Quantify business cost' },
  { to: '/ai-planner',         label: 'AI Strategy',    stage: 6, desc: 'Plan the response' },
  { to: '/decision-simulator', label: 'Simulator',     stage: 7, desc: 'Simulate failure scenarios' },
  { to: '/execution-planner',  label: 'Execute',       stage: 8, desc: 'Deploy the fix' },
  { to: '/analytics',          label: 'Analytics',     stage: 9, desc: 'Measure outcomes' },
]

const SIDEBAR_NAV = [
  ...NAV_ITEMS,
  { to: '/help',     label: 'Documentation', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { to: '/settings', label: 'Settings',      icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z' },
]

/* ─────────────────────────────────────────────────────────────
   Theme helpers
───────────────────────────────────────────────────────────── */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('of-theme')
    if (saved) return saved
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  } catch {}
  return 'dark'
}

/* ─────────────────────────────────────────────────────────────
   Global CSS
───────────────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * { font-family: 'Inter', system-ui, -apple-system, sans-serif; box-sizing: border-box; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.15); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(6,182,212,0.3); }

  /* ── Font size baseline - Minimum readable text ── */
  html { font-size: 15px; }
  @media (max-width: 640px) { html { font-size: 14px; } }

  /* ── Selection ── */
  ::selection { background: rgba(6,182,212,0.2); color: #fff; }

  /* ── Theme variables ── */
  :root {
    --bg-base: #0a0f1d;
    --bg-card: rgba(15,23,42,0.6);
    --border: rgba(255,255,255,0.07);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-muted: #475569;
    --navbar-bg: rgba(10,15,29,0.82);
    --particle-opacity: 0.45;
  }
  .of-light {
    --bg-base: #f8fafc;
    --bg-card: rgba(255,255,255,0.85);
    --border: rgba(0,0,0,0.09);
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    --navbar-bg: rgba(248,250,252,0.88);
    --particle-opacity: 0.15;
  }

  /* ── Theme transition ── */
  .of-theme-transition * { transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important; }

  /* ── Background canvas ── */
  body { background: var(--bg-base); color: var(--text-primary); margin: 0; overflow-x: clip; }
  html { overflow-x: clip; }

  /* ── Animated grid ── */
  @keyframes grid-drift {
    0%   { transform: translate(0,0); }
    100% { transform: translate(40px,40px); }
  }
  .of-bg-grid {
    position: absolute; inset: -80px; pointer-events: none; z-index: 0;
    width: calc(100% + 160px); max-width: none; overflow: hidden;
    background-image:
      linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: grid-drift 20s linear infinite;
    will-change: transform;
  }
  .of-light .of-bg-grid {
    background-image:
      linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px);
  }

  /* ── Particles ── */
  @keyframes float-up {
    0%   { transform: translateY(0) scale(0); opacity: 0; }
    10%  { opacity: var(--particle-opacity); transform: translateY(-10px) scale(1); }
    90%  { opacity: var(--particle-opacity); }
    100% { transform: translateY(-120px) scale(0.4); opacity: 0; }
  }
  @keyframes float-drift {
    0%,100% { transform: translateX(0) translateY(0); }
    33%  { transform: translateX(18px) translateY(-12px); }
    66%  { transform: translateX(-12px) translateY(-8px); }
  }
  .of-particle { position: absolute; border-radius: 50%; will-change: transform, opacity; }
  .of-p1 { width:3px; height:3px; background:#06b6d4; animation: float-up 7s ease-in-out infinite; }
  .of-p2 { width:2px; height:2px; background:#8b5cf6; animation: float-up 9s ease-in-out infinite 2s; }
  .of-p3 { width:2px; height:2px; background:#22d3ee; animation: float-up 11s ease-in-out infinite 4s; }
  .of-p4 { width:4px; height:4px; background:#06b6d4; animation: float-drift 14s ease-in-out infinite; opacity:0.2; }
  .of-p5 { width:3px; height:3px; background:#a78bfa; animation: float-drift 18s ease-in-out infinite 3s; opacity:0.15; }

  /* ── Aurora ── */
  @keyframes aurora-a { 0%{transform:translate(-30%,-30%) rotate(0deg);} 50%{transform:translate(10%,-10%) rotate(180deg);} 100%{transform:translate(-30%,-30%) rotate(360deg);} }
  @keyframes aurora-b { 0%{transform:translate(30%,20%) rotate(0deg);} 50%{transform:translate(-10%,10%) rotate(-180deg);} 100%{transform:translate(30%,20%) rotate(-360deg);} }
  .of-aurora-a { animation: aurora-a 22s ease-in-out infinite; }
  .of-aurora-b { animation: aurora-b 28s ease-in-out infinite; }

  /* ── Network lines (SVG layer) ── */
  @keyframes dash-flow { to { stroke-dashoffset: -200; } }
  .of-net-line { stroke-dasharray: 8 12; animation: dash-flow 4s linear infinite; opacity:0.12; }
  .of-light .of-net-line { opacity: 0.07; }

  /* ── Navbar ── */
  @keyframes live-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.4);} 50%{box-shadow:0 0 0 5px rgba(52,211,153,0);} }
  @keyframes active-glow { 0%,100%{box-shadow:0 0 16px -4px rgba(6,182,212,0.18), inset 0 0 20px -12px rgba(6,182,212,0.06);} 50%{box-shadow:0 0 32px -4px rgba(6,182,212,0.35), inset 0 0 28px -14px rgba(6,182,212,0.1);} }
  @keyframes orbit-spin { to { transform: rotate(360deg); } }
  @keyframes ping-slow { 0%{transform:scale(1);opacity:.8;} 75%,100%{transform:scale(2.1);opacity:0;} }
  @keyframes glitch-pulse { 0%,100%{opacity:.6;} 50%{opacity:1;} }
  @keyframes grad-border { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
  @keyframes slide-down { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
  @keyframes breath-glow { 0%,100%{opacity:.4;} 50%{opacity:.8;} }
  @keyframes scanline { 0%{transform:translateY(-100%);} 100%{transform:translateY(100vh);} }
  @keyframes data-flow { 0%{stroke-dashoffset:100;} 100%{stroke-dashoffset:0;} }
  @keyframes pulse-ring { 0%{transform:scale(.8);opacity:1;} 100%{transform:scale(2);opacity:0;} }
  @keyframes grad-shift { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }

  .of-glow-card {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, rgba(15,23,42,0.6), rgba(15,23,42,0.3));
    border: 1px solid rgba(6,182,212,0.08);
    backdrop-filter: blur(16px);
    transition: border-color .3s, box-shadow .3s, transform .2s;
  }
  .of-glow-card:hover {
    border-color: rgba(6,182,212,0.2);
    box-shadow: 0 0 30px -8px rgba(6,182,212,0.12), inset 0 0 30px -20px rgba(6,182,212,0.05);
    transform: translateY(-1px);
  }
  .of-glow-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(6,182,212,0.15), transparent);
    opacity: 0; transition: opacity .3s;
  }
  .of-glow-card:hover::before { opacity: 1; }

  .of-scanline {
    position: fixed; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(6,182,212,0.06), transparent);
    animation: scanline 8s linear infinite; pointer-events: none; z-index: 9999;
  }
  .of-light .of-scanline { display: none; }

  .of-edge-glow {
    box-shadow: 0 0 0 1px rgba(6,182,212,0.06), 0 0 20px -4px rgba(6,182,212,0.04);
  }

  .of-kpi-glow { animation: breath-glow 3s ease-in-out infinite; }
  .of-data-line { stroke-dasharray: 100; animation: data-flow 2s linear infinite; }

  .nb-orbit { animation: orbit-spin 8s linear infinite; }
  .nb-ping  { animation: ping-slow 1.8s cubic-bezier(0,0,0.2,1) infinite; }
  .nb-live-pulse { animation: live-pulse 2.2s ease-in-out infinite; }
  .nb-active-glow { animation: active-glow 3s ease-in-out infinite; }
  .nb-glitch { animation: glitch-pulse 2s ease-in-out infinite; }
  .nb-aurora-a { animation: aurora-a 22s ease-in-out infinite; }
  .nb-aurora-b { animation: aurora-b 28s ease-in-out infinite; }

  .nb-glass {
    background: var(--navbar-bg);
    backdrop-filter: blur(28px) saturate(200%);
    -webkit-backdrop-filter: blur(28px) saturate(200%);
    border-bottom: 1px solid var(--border);
    box-shadow: 0 4px 32px -8px rgba(6,182,212,0.08);
  }
  .of-light .nb-glass { box-shadow: 0 4px 32px -8px rgba(6,182,212,0.06); }

  .nb-nav-link {
    position: relative; display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap; text-decoration: none;
    letter-spacing: -0.01em; border: 1px solid transparent;
    transition: color .2s, background .2s, transform .2s, border-color .2s, box-shadow .2s;
  }
  .nb-nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); transform: translateY(-1px); }
  .of-light .nb-nav-link:hover { background: rgba(6,182,212,0.06); }
  .nb-nav-link:active { transform: scale(0.96); }
  .nb-nav-link.nb-active {
    color: var(--text-primary); font-weight: 600;
    background: rgba(6,182,212,0.08); border-color: rgba(6,182,212,0.2);
    box-shadow: 0 0 20px -6px rgba(6,182,212,0.12), inset 0 0 20px -12px rgba(6,182,212,0.08);
  }

  .of-light .nb-nav-link.nb-active { background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.25); }

  .nb-sep { width:1px; height:20px; background: var(--border); flex-shrink:0; }
  #main-nav { scrollbar-width: none; -ms-overflow-style: none; overflow-x: auto; }
  #main-nav::-webkit-scrollbar { display: none; }
  .nb-icon-btn {
    position:relative; display:flex; align-items:center; justify-content:center;
    width:32px; height:32px; border-radius:9px;
    color: var(--text-muted); transition: color .2s, background .2s;
    cursor:pointer; background:none; border:none; padding:0;
  }
  .nb-icon-btn:hover { color: var(--text-secondary); background: rgba(255,255,255,0.05); }
  .of-light .nb-icon-btn:hover { background: rgba(6,182,212,0.08); }

  .nb-search-btn {
    display:flex; align-items:center; gap:6px;
    padding:5px 11px; border-radius:9px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.025);
    color: var(--text-muted); font-size:12px; font-weight:500;
    cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .nb-search-btn:hover { border-color:rgba(6,182,212,.25); color:var(--text-secondary); box-shadow:0 0 14px -4px rgba(6,182,212,.12); }

  .nb-avatar {
    width:30px; height:30px; border-radius:50%;
    background: linear-gradient(135deg,#06b6d4,#7c3aed);
    display:flex; align-items:center; justify-content:center;
    font-size:10px; font-weight:800; color:#fff;
    box-shadow:0 0 14px -3px rgba(6,182,212,.35), 0 0 0 1px rgba(255,255,255,.08);
    cursor:pointer; transition:box-shadow .2s;
  }
  .nb-avatar:hover { box-shadow:0 0 22px -3px rgba(6,182,212,.5), 0 0 0 2px rgba(6,182,212,.2); }

  .nb-conf-badge {
    display:flex; align-items:center; gap:4px;
    padding:3px 9px; border-radius:20px;
    border:1px solid rgba(6,182,212,.2); background:rgba(6,182,212,.06);
    font-size:11px; font-weight:700; color:#22d3ee;
    letter-spacing:.02em; cursor:default;
    transition:border-color .2s, box-shadow .2s;
  }
  .nb-conf-badge:hover { border-color:rgba(6,182,212,.4); box-shadow:0 0 16px -4px rgba(6,182,212,.2); }

  .nb-notif-badge {
    position:absolute; top:-3px; right:-3px;
    width:8px; height:8px; border-radius:50%;
    background:#ef4444; border:1.5px solid var(--bg-base);
    box-shadow:0 0 6px rgba(239,68,68,.6);
  }

  .nb-grid {
    background-image:
      linear-gradient(rgba(255,255,255,.003) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.003) 1px,transparent 1px);
    background-size: 56px 56px;
  }

  /* ── Back button ── */
  .nb-back-btn {
    display:flex; align-items:center; gap:5px;
    padding:5px 10px; border-radius:8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted); font-size:12px; font-weight:500;
    cursor:pointer; transition:all .2s;
    white-space:nowrap;
  }
  .nb-back-btn:hover {
    color: var(--text-secondary);
    border-color: rgba(6,182,212,.25);
    background: rgba(6,182,212,.04);
    transform: translateX(-2px);
  }

  /* ── Theme toggle ── */
  .nb-theme-btn {
    display:flex; align-items:center; gap:6px;
    padding:5px 10px; border-radius:8px;
    border:1px solid var(--border);
    background:transparent; color:var(--text-muted);
    font-size:11px; font-weight:600; cursor:pointer;
    transition:all .2s; white-space:nowrap;
  }
  .nb-theme-btn:hover { border-color:rgba(6,182,212,.25); color:var(--text-secondary); background:rgba(6,182,212,.04); }

  /* ── Mobile back float ── */
  .of-mobile-back {
    position:fixed; bottom:80px; left:16px; z-index:40;
    display:none;
  }
  @media (max-width: 1024px) { .of-mobile-back { display:flex; } }

  /* ── Glass card global ── */
  .of-glass-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    border-radius: 14px;
    transition: border-color .2s, box-shadow .2s;
  }
  .of-glass-card:hover { border-color: rgba(6,182,212,.15); box-shadow: 0 8px 32px -12px rgba(6,182,212,.12); }

  /* ── Present mode ── */
  body.of-present-mode { font-size: 18px; }
  .of-present-mode .of-present-kpi { font-size: 3.5rem !important; line-height: 1; font-weight: 800; }
  .of-present-mode .of-present-label { font-size: 0.9rem !important; opacity: 0.7; letter-spacing: 0.05em; }
  .of-present-mode .of-present-card { border-width: 2px; padding: 2rem; border-radius: 1rem; }
  .of-present-mode .text-xs { font-size: 0.8rem !important; }
  .of-present-mode .text-sm { font-size: 1rem !important; }
  .of-present-mode .text-base { font-size: 1.1rem !important; }
  .of-present-mode .text-lg { font-size: 1.5rem !important; }
  .of-present-mode .text-xl { font-size: 2rem !important; }
  .of-present-mode .text-2xl { font-size: 2.5rem !important; }
  .of-present-mode .text-3xl { font-size: 3rem !important; }
`

/* ─────────────────────────────────────────────────────────────
   Background canvas — particles + network SVG
───────────────────────────────────────────────────────────── */
const PARTICLES = [
  { style: { left:'8%',  top:'20%' }, cls: 'of-p1' },
  { style: { left:'25%', top:'65%' }, cls: 'of-p2' },
  { style: { left:'55%', top:'15%' }, cls: 'of-p3' },
  { style: { left:'72%', top:'78%' }, cls: 'of-p1' },
  { style: { left:'88%', top:'40%' }, cls: 'of-p2' },
  { style: { left:'15%', top:'85%' }, cls: 'of-p3' },
  { style: { left:'42%', top:'45%' }, cls: 'of-p4' },
  { style: { left:'65%', top:'30%' }, cls: 'of-p5' },
  { style: { left:'90%', top:'15%' }, cls: 'of-p1' },
  { style: { left:'35%', top:'90%' }, cls: 'of-p2' },
  { style: { left:'78%', top:'60%' }, cls: 'of-p4' },
  { style: { left:'5%',  top:'50%' }, cls: 'of-p5' },
]

function PremiumBackground({ isDark }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, maxWidth:'100vw' }} aria-hidden>
      {/* Animated grid */}
      <div className="of-bg-grid" />

      {/* Aurora blobs */}
      <div className="absolute w-1/2 h-1/2 rounded-full blur-[140px] of-aurora-a"
        style={{ top:'-15%', left:'-15%', background: isDark ? 'rgba(6,182,212,0.028)' : 'rgba(6,182,212,0.06)' }} />
      <div className="absolute w-1/2 h-1/2 rounded-full blur-[140px] of-aurora-b"
        style={{ bottom:'-15%', right:'-15%', background: isDark ? 'rgba(139,92,246,0.022)' : 'rgba(139,92,246,0.05)' }} />
      <div className="absolute w-1/3 h-1/3 rounded-full blur-[100px] of-aurora-a"
        style={{ top:'40%', left:'40%', background: isDark ? 'rgba(59,130,246,0.018)' : 'rgba(59,130,246,0.04)', animationDelay:'-6s' }} />

      {/* Network SVG lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <line x1="120" y1="200" x2="360" y2="150" className="of-net-line" stroke="#06b6d4" strokeWidth="1" />
        <line x1="360" y1="150" x2="720" y2="300" className="of-net-line" stroke="#06b6d4" strokeWidth="1" style={{ animationDelay:'-1s' }} />
        <line x1="720" y1="300" x2="1080" y2="180" className="of-net-line" stroke="#8b5cf6" strokeWidth="1" style={{ animationDelay:'-2s' }} />
        <line x1="1080" y1="180" x2="1320" y2="400" className="of-net-line" stroke="#06b6d4" strokeWidth="1" style={{ animationDelay:'-3s' }} />
        <line x1="200" y1="600" x2="560" y2="500" className="of-net-line" stroke="#8b5cf6" strokeWidth="1" style={{ animationDelay:'-0.5s' }} />
        <line x1="560" y1="500" x2="900" y2="650" className="of-net-line" stroke="#06b6d4" strokeWidth="1" style={{ animationDelay:'-1.5s' }} />
        <line x1="900" y1="650" x2="1200" y2="580" className="of-net-line" stroke="#8b5cf6" strokeWidth="1" style={{ animationDelay:'-2.5s' }} />
        {/* Node dots */}
        {[[120,200],[360,150],[720,300],[1080,180],[1320,400],[200,600],[560,500],[900,650],[1200,580]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="#06b6d4" opacity={isDark ? 0.2 : 0.1} />
        ))}
      </svg>

      {/* Scanline overlay */}
      <div className="of-scanline" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} className={`of-particle ${p.cls}`} style={{ ...p.style, animationDelay: `${i * 0.7}s` }} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Theme toggle button
───────────────────────────────────────────────────────────── */
function ThemeToggle({ theme, onChange }) {
  const options = [
    { key: 'dark',   icon: '🌙', label: 'Dark'   },
    { key: 'light',  icon: '☀️', label: 'Light'  },
    { key: 'system', icon: '💻', label: 'System' },
  ]
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const current = options.find(o => o.key === theme) || options[0]
  return (
    <div ref={ref} className="relative hidden md:block">
      <button className="nb-theme-btn" onClick={() => setOpen(o => !o)} id="nav-theme-toggle" aria-label="Toggle theme">
        <span>{current.icon}</span>
        <span className="hidden xl:inline">{current.label}</span>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-6, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-4, scale:0.97 }}
            transition={{ duration:.15 }}
            className="absolute right-0 top-full mt-2 w-36 rounded-xl border overflow-hidden shadow-2xl"
            style={{ background:'var(--bg-base)', borderColor:'var(--border)', zIndex:100 }}
          >
            {options.map(o => (
              <button key={o.key}
                onClick={() => { onChange(o.key); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all text-left"
                style={{
                  color: theme === o.key ? '#22d3ee' : 'var(--text-secondary)',
                  background: theme === o.key ? 'rgba(6,182,212,0.08)' : 'transparent',
                  fontWeight: theme === o.key ? 600 : 400,
                }}
              >
                <span>{o.icon}</span>
                <span>{o.label}</span>
                {theme === o.key && <span className="ml-auto text-cyan-400">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main Layout
───────────────────────────────────────────────────────────── */
export default function Layout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [commandCenterOpen, setCommandCenterOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [showMissionBriefing, setShowMissionBriefing] = useState(() => {
    const seen = localStorage.getItem('orbit-mission-briefing-seen')
    if (seen) return false
    localStorage.setItem('orbit-mission-briefing-seen', 'true')
    return true
  })
  const profileRef = useRef(null)
  const navRef = useRef(null)

  /* Resolve effective theme */
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  /* Apply theme class to document */
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('of-theme-transition')
    if (isDark) html.classList.remove('of-light')
    else        html.classList.add('of-light')
    const timer = setTimeout(() => html.classList.remove('of-theme-transition'), 400)
    return () => clearTimeout(timer)
  }, [isDark])

  /* Persist theme */
  useEffect(() => {
    try { localStorage.setItem('of-theme', theme) } catch {}
  }, [theme])

  const isActive = (to) => pathname === to || (to !== '/dashboard' && pathname.startsWith(to))

  const currentSlideIdx = WORKFLOW.findIndex(n => pathname.startsWith(n.to) || pathname === n.to)

  const goToSlide = useCallback((dir) => {
    const next = currentSlideIdx + dir
    if (next >= 0 && next < WORKFLOW.length) { sessionStorage.setItem('of-present', '1'); navigate(WORKFLOW[next].to) }
  }, [currentSlideIdx, navigate])

  /* Present mode */
  useEffect(() => {
    if (sessionStorage.getItem('of-present') === '1') {
      setPresentMode(true); document.body.classList.add('of-present-mode')
    }
  }, [])

  useEffect(() => {
    return () => { document.body.classList.remove('of-present-mode') }
  }, [])

  useEffect(() => {
    if (!presentMode) return
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goToSlide(1) }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goToSlide(-1) }
      else if (e.key === 'Escape') {
        setPresentMode(false)
        sessionStorage.removeItem('of-present')
        document.body.classList.remove('of-present-mode')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [presentMode, goToSlide])

  const togglePresentMode = useCallback(() => {
    setPresentMode(prev => {
      const next = !prev
      if (next) {
        sessionStorage.setItem('of-present', '1')
        document.body.classList.add('of-present-mode')
      } else {
        sessionStorage.removeItem('of-present')
        document.body.classList.remove('of-present-mode')
      }
      return next
    })
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true) }
    else { document.exitFullscreen(); setIsFullscreen(false) }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => { setMobileMenuOpen(false); setCommandCenterOpen(false) }, [pathname])

  /* Close profile menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Layout overflow guard */
  useEffect(() => initLayoutGuard(), [])

  /* ⌘K */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(s => !s) }
      if (e.key === 'Escape') { setSearchOpen(false); setNotificationOpen(false); setCommandCenterOpen(false); setMobileMenuOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* Header debug logging */
  useEffect(() => {
    const actionIds = ['nav-search','nav-notifications','nav-fullscreen','nav-ai-pulse','nav-avatar','nav-theme-toggle','nav-present']
    const log = () => {
      const w = window.innerWidth
      const statuses = actionIds.map(id => {
        const el = document.getElementById(id)
        if (!el) return { id, rendered: false, display: 'N/A', visible: false }
        const style = window.getComputedStyle(el)
        const display = style.display
        const visible = display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
        return { id, rendered: true, display, visible }
      })
      const visible = statuses.filter(s => s.visible).length
      const total = statuses.filter(s => s.rendered).length
      console.log(`[Header Debug] width=${w}px | presentMode=${presentMode} | actions: ${visible}/${total} visible`, statuses)
    }
    log()
    window.addEventListener('resize', log)
    return () => window.removeEventListener('resize', log)
  }, [presentMode])

  /* Track previous path for smart back label */
  const prevPathRef = useRef(null)
  useEffect(() => {
    prevPathRef.current = pathname
  }, [pathname])

  /* Build a map of path -> label */
  const routeLabels = {}
  NAV_ITEMS.forEach(n => { routeLabels[n.to] = n.label })
  SIDEBAR_NAV.forEach(n => { routeLabels[n.to] = n.label })
  routeLabels['/'] = 'Home'
  routeLabels['/impact-analysis'] = 'Impact Analysis'
  routeLabels['/deployment-simulator'] = 'Deployment Simulator'

  const getPrevLabel = () => {
    const prev = prevPathRef.current
    if (!prev || prev === pathname) return ''
    const label = routeLabels[prev]
    if (label) return label
    const seg = prev.split('/').filter(Boolean).pop()
    return seg ? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''
  }

  /* Back navigation */
  const handleBack = useCallback(() => {
    const prev = prevPathRef.current
    if (prev && prev !== pathname) navigate(prev)
    else if (window.history.length > 1) window.history.back()
    else navigate('/dashboard')
  }, [navigate, pathname])

  /* Show back button only when not on dashboard or landing */
  const showBack = pathname !== '/dashboard' && pathname !== '/'

  return (
    <div className={`flex min-h-screen relative ${isDark ? '' : 'of-light'}`}
      style={{ fontFamily:"'Inter',system-ui,-apple-system,sans-serif", background:'var(--bg-base)', color:'var(--text-primary)' }}
      data-layout-root>
      <style>{GLOBAL_STYLES}</style>

      {showMissionBriefing && <CinematicMissionBriefing onComplete={() => setShowMissionBriefing(false)} />}

      <AICopilot />

      {/* ── Premium animated background ── */}
      <PremiumBackground isDark={isDark} />

      {/* ════════════════════════════════════════════════════
          PRESENT MODE CHROME
      ════════════════════════════════════════════════════ */}
      {presentMode && (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-2.5 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <div className="absolute h-5 w-5 rounded-full bg-cyan-500/20" />
                <div className="relative h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </div>
              <span className="text-[10px] font-bold text-white/80">Orbit<span className="text-cyan-400">Foresight</span></span>
              <span className="text-[8px] text-slate-600 font-mono uppercase tracking-widest">Presentation</span>
            </div>
            <div className="flex items-center gap-3 pointer-events-auto">
              <span className="text-[9px] font-mono text-slate-500 tabular-nums">
                {currentSlideIdx >= 0 ? currentSlideIdx + 1 : '–'} / {WORKFLOW.length}
              </span>
              <button onClick={() => { navigate('/dashboard'); togglePresentMode() }}
                className="rounded-lg px-2.5 py-1 text-[9px] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all">
                Exit Present
              </button>
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50 h-1 bg-slate-900">
            <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-violet-600"
              initial={false} animate={{ width:`${((currentSlideIdx+1)/WORKFLOW.length)*100}%` }} transition={{ duration:.3 }} />
          </div>
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-950/90 backdrop-blur-xl border border-white/[0.08] rounded-full px-4 py-2 shadow-2xl">
            <button onClick={() => goToSlide(-1)} disabled={currentSlideIdx <= 0}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] text-slate-500 hover:text-cyan-400 hover:bg-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              Prev
            </button>
            <div className="flex items-center gap-1">
              {WORKFLOW.map((n,i) => (
                <div key={n.to} onClick={() => { sessionStorage.setItem('of-present', '1'); navigate(n.to) }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i===currentSlideIdx?'w-5 bg-cyan-400':i<currentSlideIdx?'w-1.5 bg-emerald-500/60':'w-1.5 bg-slate-700 hover:bg-slate-600'}`} />
              ))}
            </div>
            <button onClick={() => goToSlide(1)} disabled={currentSlideIdx >= WORKFLOW.length-1}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] text-slate-500 hover:text-cyan-400 hover:bg-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              Next
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════
          MOBILE SIDEBAR DRAWER
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && !presentMode && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)} />
            <motion.aside initial={{ x:'-100%' }} animate={{ x:0 }} exit={{ x:'-100%' }}
              transition={{ type:'spring', stiffness:400, damping:40 }}
              className="fixed top-0 left-0 z-50 flex h-full w-[85vw] max-w-[320px] min-w-[280px] flex-col backdrop-blur-2xl border-r lg:hidden"
              style={{ background:'var(--bg-base)', borderColor:'var(--border)' }}>
              <div className="flex h-16 items-center justify-between border-b px-5" style={{ borderColor:'var(--border)' }}>
                <Link to="/" className="flex items-center gap-2.5">
                  <OrbitLogo size="md" />
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold tracking-tight" style={{ color:'var(--text-primary)' }}>Orbit<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Foresight</span></span>
                    <span className="text-[9px] font-mono tracking-wider uppercase" style={{ color:'var(--text-muted)' }}>Predict Before Production</span>
                  </div>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="nb-icon-btn" aria-label="Close menu">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* OVERVIEW */}
                <div>
                  <p className="px-3 pb-1 text-[8px] font-mono font-bold tracking-widest uppercase" style={{ color:'var(--text-muted)' }}>Overview</p>
                  {NAV_ITEMS.slice(0, 3).map(item => {
                    const active = isActive(item.to)
                    return (
                      <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                        style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', background: active ? 'rgba(6,182,212,0.1)' : 'transparent', border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent' }}>
                        <svg className="h-4 w-4 shrink-0" style={{ color: active ? '#22d3ee' : 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />}
                      </Link>
                    )
                  })}
                </div>
                {/* ANALYSIS */}
                <div>
                  <p className="px-3 pb-1 text-[8px] font-mono font-bold tracking-widest uppercase" style={{ color:'var(--text-muted)' }}>Analysis</p>
                  {NAV_ITEMS.slice(3, 6).map(item => {
                    const active = isActive(item.to)
                    return (
                      <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                        style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', background: active ? 'rgba(6,182,212,0.1)' : 'transparent', border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent' }}>
                        <svg className="h-4 w-4 shrink-0" style={{ color: active ? '#22d3ee' : 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />}
                      </Link>
                    )
                  })}
                </div>
                {/* OPERATIONS */}
                <div>
                  <p className="px-3 pb-1 text-[8px] font-mono font-bold tracking-widest uppercase" style={{ color:'var(--text-muted)' }}>Operations</p>
                  {NAV_ITEMS.slice(6).map(item => {
                    const active = isActive(item.to)
                    return (
                      <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                        style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', background: active ? 'rgba(6,182,212,0.1)' : 'transparent', border: active ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent' }}>
                        <svg className="h-4 w-4 shrink-0" style={{ color: active ? '#22d3ee' : 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />}
                      </Link>
                    )
                  })}
                </div>
                {/* Separator */}
                <div className="border-t" style={{ borderColor:'var(--border)' }} />
                {/* Notifications */}
                <button onClick={() => { setMobileMenuOpen(false); setNotificationOpen(true) }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  style={{ color:'var(--text-secondary)' }}>
                  <svg className="h-4 w-4 shrink-0" style={{ color:'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  <span>Notifications</span>
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-[8px] font-bold text-red-400">4</span>
                </button>
                {/* Profile */}
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  style={{ color:'var(--text-secondary)' }}>
                  <svg className="h-4 w-4 shrink-0" style={{ color:'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Profile</span>
                </Link>
                {/* Theme toggle */}
                <div className="flex items-center gap-3 rounded-xl px-3 py-2">
                  <svg className="h-4 w-4 shrink-0" style={{ color:'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color:'var(--text-secondary)' }}>Theme</span>
                  <div className="ml-auto flex gap-1">
                    {[['dark','🌙'],['light','☀️'],['system','💻']].map(([k,icon]) => (
                      <button key={k} onClick={() => setTheme(k)}
                        className="rounded-lg py-1 px-1.5 text-xs transition-all"
                        style={{ background: theme===k ? 'rgba(6,182,212,0.12)' : 'transparent', color: theme===k ? '#22d3ee' : 'var(--text-muted)', border: theme===k ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent' }}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Documentation */}
                <Link to="/help" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  style={{ color:'var(--text-secondary)' }}>
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>Documentation</span>
                </Link>
              </nav>
              <div className="border-t p-4" style={{ borderColor:'var(--border)' }}>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border)' }}>
                  <div className="nb-avatar shrink-0">OF</div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold truncate" style={{ color:'var(--text-primary)' }}>OrbitForesight</span>
                    <span className="text-[9px] truncate font-mono" style={{ color:'var(--text-muted)' }}>Enterprise · AI Platform</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1 rounded-md px-1.5 py-0.5 shrink-0" style={{ background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.15)' }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[8px] font-mono font-bold text-emerald-300 tracking-wider">LIVE</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          DESKTOP COMMAND CENTER DRAWER
      ════════════════════════════════════════════════════ */}
      <CommandCenterDrawer open={commandCenterOpen} onClose={() => setCommandCenterOpen(false)} />

      {/* ════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col min-w-0 relative" style={{ zIndex:1 }}>

        {/* ════════════════════════════════════════════════
            PREMIUM ENTERPRISE NAVBAR
        ════════════════════════════════════════════════ */}
        {!presentMode && (
          <header className="sticky top-0 z-30 nb-glass" style={{ height:'56px' }}>
            {/* Blueprint grid */}
            <div className="absolute inset-0 nb-grid opacity-20 pointer-events-none" aria-hidden />
            {/* Spotlight glow */}
            <div className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out" aria-hidden
              style={{ background:`radial-gradient(ellipse 380px 56px at ${(() => { const idx=NAV_ITEMS.findIndex(n=>isActive(n.to)); return idx>=0?`${((idx+0.5)/NAV_ITEMS.length)*100}%`:'50%' })()} 50%, rgba(6,182,212,0.055) 0%, transparent 70%)` }} />
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" aria-hidden />

            <div className="relative flex items-center h-full px-3 lg:px-5 gap-2 lg:gap-3 flex-nowrap min-w-0">

              {/* ── LEFT GROUP ── */}
              <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
                {/* Desktop hamburger */}
                <button id="desktop-command-center-trigger" onClick={() => setCommandCenterOpen(true)}
                  className="nb-icon-btn hidden lg:flex shrink-0" aria-label="Command Center">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0" id="nav-logo">
                  <OrbitLogo size="sm" />
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[14px] font-extrabold tracking-tight leading-none" style={{ color:'var(--text-primary)' }}>
                      Orbit<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Foresight</span>
                    </span>
                    <span className="text-[7px] font-mono tracking-[0.14em] uppercase leading-none mt-0.5" style={{ color:'var(--text-muted)' }}>
                      Predict Before Production
                    </span>
                  </div>
                </Link>

                {/* Desktop: Separator + Back + LIVE */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="nb-sep" />
                  <AnimatePresence mode="wait">
                    {showBack && (
                      <motion.button key={pathname} id="nav-back-btn"
                        initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                        transition={{ duration:.18, ease:'easeOut' }}
                        onClick={handleBack} className="nb-back-btn"
                        title={`Back to ${getPrevLabel() || 'previous page'}`} aria-label="Go back">
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        <span className="hidden lg:inline ml-0.5">{getPrevLabel() || 'Back'}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <div id="nav-live-badge"
                    className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1 nb-live-pulse">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-300 tracking-widest">LIVE</span>
                  </div>
                </div>
              </div>

              {/* ── CENTER: Desktop nav items ── */}
              <nav ref={navRef} id="main-nav"
                className="hidden lg:flex items-center gap-0.5 mx-auto overflow-x-auto min-w-0" aria-label="Main navigation">
                {NAV_ITEMS.map(item => {
                  const active = isActive(item.to)
                  return (
                    <div key={item.to} className="relative">
                      <Link to={item.to}
                        id={`nav-${item.label.toLowerCase().replace(/\s+/g,'-')}`}
                        className={`nb-nav-link ${active ? 'nb-active' : ''}`}>
                        <svg className="h-3.5 w-3.5 shrink-0 transition-colors duration-200"
                          style={{ color: active ? '#22d3ee' : 'var(--text-muted)' }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        {item.label}
                        {active && (
                          <>
                            <motion.div layoutId="navbar-active-bg"
                              className="absolute inset-0 rounded-[9px]"
                              style={{ background:'rgba(6,182,212,0.06)' }}
                              transition={{ type:'spring', stiffness:380, damping:30 }} />
                          </>
                        )}
                      </Link>
                    </div>
                  )
                })}
              </nav>

              {/* ── RIGHT GROUP ── */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
                {/* Desktop badges */}
                <div className="max-lg:hidden lg:flex items-center gap-2 shrink-0">
                  <div id="nav-ai-pulse" className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.05] px-3 py-1.5 shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    </span>
                    <span className="text-xs font-bold text-cyan-300">AI Active</span>
                    <span className="h-3 w-px bg-cyan-500/20" />
                    <span className="text-xs font-mono font-bold text-cyan-400">94%</span>
                    <span className="text-[9px] text-cyan-500/60">confidence</span>
                  </div>
                  <div className="nb-sep" />
                </div>

                {/* Search - visible on mobile too */}
                <button id="nav-search" className="nb-icon-btn shrink-0"
                  onClick={() => setSearchOpen(!searchOpen)} aria-label="Open search">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-mono shrink-0"
                  style={{ borderColor:'var(--border)', background:'rgba(255,255,255,0.03)', color:'var(--text-muted)' }}>⌘K</span>

                {/* Notifications */}
                <button id="nav-notifications" className="nb-icon-btn relative shrink-0" aria-label="Notifications"
                  onClick={() => setNotificationOpen(true)}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  <span className="nb-notif-badge" />
                </button>

                {/* Desktop-only: Theme + Fullscreen + Present */}
                <div className="max-md:hidden md:flex items-center gap-1 shrink-0">
                  <ThemeToggle theme={theme} onChange={setTheme} />
                  <button id="nav-fullscreen" className="nb-icon-btn shrink-0"
                    onClick={toggleFullscreen} aria-label={isFullscreen?'Exit fullscreen':'Enter fullscreen'}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {isFullscreen
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />}
                    </svg>
                  </button>
                  <button id="nav-present" onClick={togglePresentMode}
                    className={`shrink-0 flex items-center gap-1.5 rounded-[9px] border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${presentMode ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200' : 'text-slate-500 hover:text-cyan-300 hover:border-cyan-400/25 hover:bg-cyan-500/[0.04]'}`}
                    style={{ borderColor: presentMode ? undefined : 'var(--border)' }}
                    aria-label="Toggle presentation mode">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                    </svg>
                    <span className="hidden xl:inline">Present</span>
                  </button>
                  <div className="nb-sep" />
                </div>

                {/* Mobile hamburger */}
                <button id="mobile-menu-trigger" onClick={() => setMobileMenuOpen(true)}
                  className="nb-icon-btn lg:hidden shrink-0" aria-label="Open menu">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                {/* Avatar / Profile */}
                <div ref={profileRef} className="relative hidden sm:block shrink-0">
                  <button onClick={() => setProfileOpen(o => !o)} id="nav-avatar" className="nb-avatar shrink-0" aria-label="Profile">
                    <span className="text-[9px]">OF</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-2xl overflow-hidden"
                        style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', zIndex: 100 }}
                      >
                        <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-2.5">
                            <div className="nb-avatar w-9 h-9 text-[11px]">OF</div>
                            <div>
                              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>OrbitForesight</p>
                              <p className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>Enterprise · Admin</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1.5">
                          {[
                            { label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z', to: '/settings' },
                            { label: 'Help & Docs', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', to: '/help' },
                            { label: 'Keyboard Shortcuts', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', to: '/help?tab=shortcuts' },
                          ].map(item => (
                            <Link key={item.label} to={item.to} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-xs transition-all"
                              style={{ color: 'var(--text-secondary)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.05)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                              </svg>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t p-1.5" style={{ borderColor: 'var(--border)' }}>
                          <button
                            className="flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-xs transition-all"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" aria-hidden />
          </header>
        )}

        {/* ════════════════════════════════════════════════
            COMMAND CENTER / MISSION BRIEFING
        ════════════════════════════════════════════════ */}
        <div className="px-2 sm:px-3 lg:px-4 pt-2 sm:pt-3 lg:pt-4">
          <ExecutiveCommandHeader />
        </div>

        {/* ════════════════════════════════════════════════
            PAGE CONTENT
        ════════════════════════════════════════════════ */}
        <main className="flex-1">
          <div className={`${presentMode ? 'p-0' : 'p-2 sm:p-3 lg:p-4 pb-16 lg:pb-4'}`}>
            <div className={`mx-auto w-full ${presentMode ? 'max-w-full' : 'max-w-full'}`}>
              {children}
            </div>
          </div>
        </main>

        {!presentMode && <QuickActionBar currentPage={pathname} />}
        {!presentMode && <Footer />}
      </div>

      {/* Mobile floating back button with smart label */}
      {showBack && !presentMode && (
        <motion.button
          id="mobile-back-btn"
          key={pathname}
          initial={{ opacity:0, scale:.85, x: -8 }}
          animate={{ opacity:1, scale:1, x: 0 }}
          exit={{ opacity:0, scale:.85, x: -4 }}
          transition={{ duration:.15, ease:'easeOut' }}
          onClick={handleBack}
          className="of-mobile-back items-center justify-center gap-1 px-3 py-2 rounded-full shadow-xl border"
          style={{ background:'var(--bg-base)', borderColor:'var(--border)', color:'var(--text-secondary)' }}
          aria-label="Go back"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="text-[9px] font-mono font-medium max-w-[80px] truncate">{getPrevLabel() || 'Back'}</span>
        </motion.button>
      )}

      {/* ════════════════════════════════════════════════
          COMMAND PALETTE (⌘K)
      ════════════════════════════════════════════════ */}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} currentPath={pathname} />

      {/* ════════════════════════════════════════════════
          NOTIFICATION CENTER
      ════════════════════════════════════════════════ */}
      <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* ════════════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION
      ════════════════════════════════════════════════ */}
      {!presentMode && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t backdrop-blur-2xl"
          style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-around px-2 py-1.5">
            {NAV_ITEMS.slice(0, 5).map(item => {
              const active = isActive(item.to)
              return (
                <Link key={item.to} to={item.to}
                  className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all min-w-0"
                  style={{
                    color: active ? '#22d3ee' : 'var(--text-muted)',
                    background: active ? 'rgba(6,182,212,0.08)' : 'transparent'
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-[8px] font-medium leading-none truncate max-w-full" style={{ fontWeight: active ? 600 : 500 }}>{item.label}</span>
                </Link>
              )
            })}
            {/* More button — uses 9-dot grid icon, NOT hamburger (avoids duplicate ☰) */}
            <button onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all min-w-0"
              style={{ color: mobileMenuOpen ? '#22d3ee' : 'var(--text-muted)' }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span className="text-[8px] font-medium leading-none">More</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}
