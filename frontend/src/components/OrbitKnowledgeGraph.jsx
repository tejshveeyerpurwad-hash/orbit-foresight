import { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

const riskColors = {
  high: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#ef4444', glow: '0 0 12px rgba(239,68,68,0.3)' },
  medium: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', text: '#f59e0b', glow: '0 0 12px rgba(245,158,11,0.3)' },
  low: { bg: 'rgba(6,182,212,0.15)', border: '#06b6d4', text: '#06b6d4', glow: '0 0 12px rgba(6,182,212,0.3)' },
}

function ServiceNode({ data }) {
  const colors = riskColors[data.risk] || riskColors.low
  return (
    <div
      className="rounded-xl border-2 px-4 py-3 shadow-lg backdrop-blur-sm min-w-[140px]"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        boxShadow: data.selected ? colors.glow : 'none',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.border }} />
        <span className="text-xs font-semibold text-white">{data.label}</span>
      </div>
      <div className="text-[9px] text-base-400">
        Risk: <span style={{ color: colors.text }}>{data.risk.toUpperCase()}</span>
      </div>
      {data.propagationRisk && (
        <div className="mt-1.5 h-1 rounded-full bg-base-600/50 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${data.propagationRisk}%`, backgroundColor: colors.border, opacity: 0.5 }} />
        </div>
      )}
      {data.deps && data.deps.length > 0 && (
        <div className="mt-1.5 text-[8px] text-base-500 truncate max-w-[140px]">
          Dep: {data.deps.join(', ')}
        </div>
      )}
    </div>
  )
}

const nodeTypes = { serviceNode: ServiceNode }

export default function OrbitKnowledgeGraph({ services, riskPaths, onNodeSelect }) {
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const initialNodes = (services || []).map((s, i) => {
    const angle = (i / (services?.length || 1)) * 2 * Math.PI - Math.PI / 2
    const radius = 200
    const cx = 400, cy = 300
    return {
      id: s.name,
      type: 'serviceNode',
      position: {
        x: cx + radius * Math.cos(angle) - 70,
        y: cy + radius * Math.sin(angle) - 40,
      },
      data: {
        label: s.name,
        risk: s.risk || 'low',
        propagationRisk: s.propagation_risk,
        deps: s.dependencies,
        selected: false,
      },
    }
  })

  const initialEdges = (riskPaths || []).map((p, i) => {
    const riskColor = p.risk >= 70 ? '#ef4444' : p.risk >= 40 ? '#f59e0b' : '#06b6d4'
    return {
      id: `e-${i}`,
      source: p.from,
      target: p.to,
      animated: true,
      style: { stroke: riskColor, strokeWidth: p.risk >= 70 ? 2.5 : 1.5 },
      label: `${p.risk}%`,
      labelStyle: { fill: riskColor, fontSize: 9, fontWeight: 600 },
      labelBgStyle: { fill: '#0a0f1d', fillOpacity: 0.8 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: riskColor,
        width: 16,
        height: 12,
      },
    }
  })

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [services, riskPaths])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node.data.label)
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, selected: n.id === node.id },
      }))
    )
    onNodeSelect?.(node.data.label)
  }, [onNodeSelect])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, selected: false } })))
  }, [])

  const selectedService = services?.find((s) => s.name === selectedNode)

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
            <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v2.25m0 0V9m0-3.75h2.25M9.75 3.75h-2.25m0 0A2.25 2.25 0 005.25 6v.75m0 0A2.25 2.25 0 003 9v6.75A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V9a2.25 2.25 0 00-2.25-2.25h-.75m0 0V6a2.25 2.25 0 00-2.25-2.25h-2.25m2.25 0V3.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Orbit Knowledge Graph</h2>
            <p className="text-xs text-base-400">Interactive service topology with risk propagation paths</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          {[['high','High','#ef4444'],['medium','Med','#f59e0b'],['low','Low','#06b6d4']].map(([k,v,clr]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: clr }} />
              <span className="text-[10px] text-base-400">{v}</span>
            </div>
          ))}
          <span className="text-base-600 mx-1">|</span>
          <div className="flex items-center gap-1.5">
            <svg className="h-3 w-3 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span className="text-[10px] text-base-400">Risk propagation</span>
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-xl overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div ref={reactFlowWrapper} className="h-[420px] sm:h-[500px] lg:h-[560px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
            }}
          >
            <Background color="rgba(255,255,255,0.03)" gap={24} />
            <Controls
              className="bg-base-800 border border-white/[0.06] rounded-lg [&_button]:text-base-400 [&_button]:hover:text-base-100 [&_button]:border-white/[0.06]"
            />
            <MiniMap
              nodeColor={(node) => {
                const colors = riskColors[node.data?.risk] || riskColors.low
                return colors.border
              }}
              maskColor="rgba(10,15,29,0.8)"
              style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}
            />
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{
                backgroundColor: riskColors[selectedService?.risk || 'low']?.border || '#06b6d4',
              }} />
              <h3 className="text-sm font-semibold text-white">{selectedNode}</h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="rounded-lg p-1 text-base-400 hover:bg-white/[0.06] hover:text-base-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] text-base-500">Risk Level</div>
              <div className="text-sm font-semibold text-white capitalize mt-0.5">{selectedService?.risk || 'N/A'}</div>
            </div>
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] text-base-500">Propagation Risk</div>
              <div className="text-sm font-semibold text-white mt-0.5">{selectedService?.propagation_risk || 0}%</div>
            </div>
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] text-base-500">Dependencies</div>
              <div className="text-sm font-semibold text-white mt-0.5">{selectedService?.dependencies?.length || 0}</div>
            </div>
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] text-base-500">Impacted By</div>
              <div className="text-sm font-semibold text-white mt-0.5">{selectedService?.impacted_by?.length || 0}</div>
            </div>
          </div>
          {selectedService?.dependencies?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-base-500 mr-1">Depends on:</span>
              {selectedService.dependencies.map((d) => (
                <span key={d} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-base-300">{d}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedNode && services?.length > 0 && (
        <div className="text-center text-[10px] text-base-500 animate-fade-in">
          Click any service node to view details and risk propagation paths
        </div>
      )}
    </div>
  )
}
