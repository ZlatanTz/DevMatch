// src/components/JobCard.jsx
export function JobCard({ id = 1, title, company, location, employment_type, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-federal-blue leading-snug">{title}</h2>
        <span className="shrink-0 bg-emerald text-white text-xs px-3 py-1 rounded-full">
          {employment_type}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-center text-sm text-paynes-gray gap-3">
        <span>{company}</span>
        <span>•</span>
        <span>{location}</span>
      </div>

      {/* Description (clamped to keep cards even) */}
      <p className="mt-3 text-base text-gray-700 line-clamp-3">{description}</p>

      {/* Push footer to bottom */}
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 rounded bg-dark-purple text-white text-xs">React</span>
          <span className="px-2 py-1 rounded bg-paynes-gray text-white text-xs">Tailwind</span>
          <span className="px-2 py-1 rounded bg-federal-blue text-white text-xs">JavaScript</span>
        </div>

        <div className="flex items-center gap-3">
          <a href={`/jobs/${id}`} className="text-emerald hover:underline font-medium">
            View details
          </a>
          <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
