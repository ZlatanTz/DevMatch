import { updateParamBatch, useJobsFilter } from "../hooks/useJobsFilter";
import { useSkills } from "../hooks/useSkills";
import { useState, useEffect, useMemo } from "react";

export default function Toolbar() {
  const { loading, skills: allSkills = [] } = useSkills();
  const { q, seniority, location, skills, sort, setSearchParams, searchParams } = useJobsFilter();

  const urlKey = useMemo(() => {
    return [q, location, seniority, sort, (skills || []).join(",")].join("|");
  }, [q, location, seniority, sort, skills]);
  useEffect(() => {
    setDraftQ(q || "");
    setDraftLocation(location || "");
    setDraftSeniority(seniority || "");
    setDraftSkill((Array.isArray(skills) && skills[0]) || "");
    setDraftSort(sort || "date-desc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  const [draftQ, setDraftQ] = useState(q || "");
  const [draftLocation, setDraftLocation] = useState(location || "");
  const [draftSeniority, setDraftSeniority] = useState(seniority || "");
  const [draftSkill, setDraftSkill] = useState((Array.isArray(skills) && skills[0]) || "");
  const [draftSort, setDraftSort] = useState(sort || "date-desc");

  const applyFilters = () => {
    updateParamBatch(searchParams, setSearchParams, {
      q: draftQ,
      loc: draftLocation,
      seniority: draftSeniority,
      skills: draftSkill,
      sort: draftSort,
    });
  };

  const clearFilters = () => {
    setDraftQ("");
    setDraftLocation("");
    setDraftSeniority("");
    setDraftSkill("");
    setDraftSort("date-desc");

    updateParamBatch(searchParams, setSearchParams, {
      q: "",
      loc: "",
      seniority: "",
      skills: "",
      sort: "date-desc",
    });
  };

  return (
    <div className="w-full bg-white shadow rounded-lg p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <input
          value={draftQ ?? ""}
          onChange={(e) => setDraftQ(e.target.value)}
          type="text"
          placeholder="Search jobs..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={draftLocation}
          onChange={(e) => setDraftLocation(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="">All Locations</option>
          <option value="loc-remote">Remote</option>
          <option value="loc-onsite">On-site</option>
        </select>

        <select
          value={draftSeniority}
          onChange={(e) => setDraftSeniority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="">All Levels</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={draftSkill}
          onChange={(e) => setDraftSkill(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="">All Skills</option>
          {!loading &&
            allSkills.map((s) => (
              <option key={s.id ?? s.name} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <select
          value={draftSort}
          onChange={(e) => setDraftSort(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald"
        >
          <option value="date-desc">Newest</option>
          <option value="date-asc">Oldest</option>
          <option value="salary-desc">Salary High → Low</option>
          <option value="salary-asc">Salary Low → High</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={applyFilters} className="px-4 py-2 bg-emerald-600 text-white rounded-md">
          Apply
        </button>
        <button onClick={clearFilters} className="px-4 py-2 border rounded-md">
          Clear
        </button>
      </div>
    </div>
  );
}
