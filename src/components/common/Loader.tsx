import Skeleton from "./Skeleton";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a] overflow-hidden select-none">
      {/* Top Bar Skeleton */}
      <div className="h-15 w-full flex items-center justify-between px-6 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-7 rounded-lg" />
          <Skeleton variant="text" className="h-5 w-24 rounded" />
        </div>
        <div className="flex gap-4">
          <Skeleton variant="text" className="h-4 w-16 hidden md:block" />
          <Skeleton variant="text" className="h-4 w-16 hidden md:block" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Main Skeleton Content */}
      <div className="flex-1 px-4 md:px-10 pt-6 space-y-6 overflow-hidden">
        {/* Banner / Header shimmer */}
        <div className="w-full h-44 sm:h-64 rounded-2xl overflow-hidden relative">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton variant="text" className="w-3/4 h-3.5" />
                <Skeleton variant="text" className="w-1/2 h-2.5" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
