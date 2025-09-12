import { useSearchParams } from "react-router-dom";

export function useJobsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const location = searchParams.getAll("loc") || [];
  const seniority = searchParams.getAll("seniority") || [];
  const skills = searchParams.getAll("skills") || [];
  const sort = searchParams.get("sort") || "date-desc";

  return { q, location, seniority, skills, sort, searchParams, setSearchParams };
}

export function updateParamBatch(searchParams, setSearchParams, patch) {
  const next = new URLSearchParams(searchParams);

  Object.entries(patch).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      next.delete(key);
      value.forEach((v) => {
        if (v !== undefined && v !== null && `${v}`.length) next.append(key, v);
      });
    } else if (value === undefined || value === null || `${value}`.length === 0) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });

  setSearchParams(next);
}
