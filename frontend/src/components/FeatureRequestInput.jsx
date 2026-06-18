import { useState, useRef, useEffect } from 'react'

export default function FeatureRequestInput({ onAnalyze, loading, presets = [] }) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setSelected(-1) }, [value])

  const filtered = value.trim()
    ? presets.filter((p) => p.toLowerCase().includes(value.toLowerCase()))
    : presets

  const submit = (text) => {
    if (text.trim()) {
      onAnalyze(text.trim())
      setShow(false)
    }
  }

  const handleKey = (e) => {
    if (!show || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((p) => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((p) => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selected >= 0) { e.preventDefault(); setValue(filtered[selected]); submit(filtered[selected]) }
    if (e.key === 'Escape') setShow(false)
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(value) }}
      className="w-full"
      id="demo-input"
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <svg className="h-5 w-5 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setShow(true) }}
          onFocus={() => setShow(true)}
          onKeyDown={handleKey}
          placeholder='Describe a software change, e.g. "Add payment retry support"'
          className="w-full rounded-xl border border-white/[0.08] bg-base-700/80 py-4 pl-12 pr-36 text-sm text-white placeholder-base-400/50 outline-none ring-1 ring-transparent transition-all duration-200 focus:border-brand/40 focus:ring-brand/20"
          disabled={loading}
          autoComplete="off"
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="hidden sm:inline">Analyzing</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="hidden sm:inline">Analyze</span>
              </>
            )}
          </button>
        </div>

        {show && filtered.length > 0 && !loading && (
          <div
            ref={listRef}
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-base-700 shadow-2xl shadow-black/50 animate-fade-in"
          >
            {filtered.map((s, i) => (
              <button
                key={s}
                type="button"
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  i === selected
                    ? 'bg-brand/10 text-brand-light'
                    : 'text-base-300 hover:bg-white/[0.04] hover:text-white'
                }`}
                onClick={() => { setValue(s); submit(s) }}
                onMouseEnter={() => setSelected(i)}
              >
                <svg className="h-4 w-4 shrink-0 text-base-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  )
}
