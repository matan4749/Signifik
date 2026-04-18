export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-32 rounded-xl bg-white/5 shimmer mb-2" />
        <div className="h-4 w-56 rounded-lg bg-white/3 shimmer" />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-20 rounded-lg bg-white/3 shimmer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-white/3 border border-white/8 shimmer" />
        ))}
      </div>
    </div>
  );
}
