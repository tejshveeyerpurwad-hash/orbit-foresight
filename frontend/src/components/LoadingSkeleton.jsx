export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <SkeletonLine className="h-3 w-20 mb-5" />
      <div className="space-y-2.5">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-3/4" />
        <SkeletonLine className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonGauge() {
  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <SkeletonLine className="h-3 w-16 mb-5" />
      <div className="flex flex-col items-center py-2">
        <SkeletonLine className="h-36 w-36 rounded-full mb-3" />
        <SkeletonLine className="h-3 w-20" />
      </div>
    </div>
  )
}

export function SkeletonFailureCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <SkeletonLine className="h-3 w-28 mb-5" />
      <div className="space-y-3">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-5/6" />
        <SkeletonLine className="h-3 w-2/3" />
        <SkeletonLine className="h-3 w-3/4" />
      </div>
    </div>
  )
}

export function SkeletonMRList() {
  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <SkeletonLine className="h-3 w-24 mb-5" />
      {[1,2,3].map((i) => (
        <div key={i} className="mb-3">
          <SkeletonLine className="h-4 w-32 mb-2" />
          <SkeletonLine className="h-3 w-full mb-1" />
          <SkeletonLine className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default function LoadingSkeleton() {
  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <SkeletonLine className="h-8 w-8 rounded-lg" />
        <div className="space-y-1.5">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="h-3 w-56" />
        </div>
      </div>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonGauge />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonMRList />
        <SkeletonMRList />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonFailureCard />
        <SkeletonFailureCard />
      </div>
    </div>
  )
}
