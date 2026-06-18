export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="mx-auto mt-6 max-w-2xl animate-fade-in-down">
      <div className="flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/[0.04] px-5 py-4 backdrop-blur-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger/20">
          <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="flex-1 text-sm text-danger">{message}</p>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-base-300 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
