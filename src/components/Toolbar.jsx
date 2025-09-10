import { updateParam, useJobsFilter } from "../hooks/useJobsFilter";

export default function Toolbar() {
  const { q, seniority, location, skills, sort, setSearchParams, searchParams } = useJobsFilter();

  return (
    <div className="w-full bg-white shadow rounded-lg p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <input
          onChange={(e) => {
            updateParam(searchParams, setSearchParams, "q", e.target.value);
          }}
          value={q}
          type="text"
          placeholder="Search jobs..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald">
          <option value={"loc-all"}>All Locations</option>
          <option value={"loc-remote"}>Remote</option>
          <option value={"loc-onsite"}>On-site</option>
        </select>

        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald">
          <option value="">All Levels</option>
          <option>Junior</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>

        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald">
          <option>All Skills</option>
          <option>React</option>
          <option>Node.js</option>
          <option>Python</option>
        </select>
      </div>

      <div>
        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald">
          <option>Sort by: Newest</option>
          <option>Oldest</option>
          <option>Salary (High → Low)</option>
          <option>Salary (Low → High)</option>
        </select>
      </div>
    </div>
  );
}
