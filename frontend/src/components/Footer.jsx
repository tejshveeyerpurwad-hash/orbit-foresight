export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-base-400">
            <div className="h-2 w-2 rounded-full bg-brand" />
            Orbit Foresight
          </div>
          <p className="text-xs text-base-500">
            &copy; {new Date().getFullYear()} Orbit Foresight. Predict before production.
          </p>
        </div>
      </div>
    </footer>
  )
}
