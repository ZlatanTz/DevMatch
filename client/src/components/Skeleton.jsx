import { useEffect } from "react";

export function SkeletonStyles() {
  useEffect(() => {
    if (document.getElementById("skeleton-shimmer-styles")) return;
    const style = document.createElement("style");
    style.id = "skeleton-shimmer-styles";
    style.textContent = `
      .skeleton { position: relative; overflow: hidden; }
      .skeleton::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
          90deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,.6) 50%,
          rgba(255,255,255,0) 100%
        );
        animation: skeleton-shimmer 1.2s infinite;
      }
      @keyframes skeleton-shimmer {
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

export function Skeleton({ className = "", rounded = "rounded-md" }) {
  return <div className={`skeleton bg-gray-200 ${rounded} ${className}`} />;
}

export function SkeletonText({ className = "", width = "w-full" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className={`skeleton bg-gray-200 h-4 ${width} rounded`} />
    </div>
  );
}

export function SkeletonCircle({ className = "", size = 48 }) {
  return (
    <div
      className={`skeleton bg-gray-200 rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white min-h-screen min-w-[320px]">
      <Skeleton className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] rounded-lg mb-6 shadow-md" />

      <div className="p-4 rounded-lg mb-8 bg-federal-blue/80">
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0">
          <Skeleton className="h-5 w-28 rounded" />
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-5 w-28 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200">
            <SkeletonText width="w-40" />
            <div className="mt-2 space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-10/12 rounded" />
            </div>
            <div className="mt-4 space-y-3">
              <SkeletonText width="w-48" />
              <Skeleton className="h-4 w-10/12 rounded" />
              <Skeleton className="h-4 w-9/12 rounded" />
            </div>
            <div className="mt-4 space-y-2">
              <SkeletonText width="w-56" />
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 rounded-lg shadow border border-gray-200 md:self-start">
            <div className="space-y-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
      <Skeleton className="h-40 w-full rounded mb-4" />
      <SkeletonText width="w-3/4" />
      <SkeletonText width="w-1/2" />
      <div className="mt-4 flex gap-2 flex-wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function JobCardSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 m-10">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
