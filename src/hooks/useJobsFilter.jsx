import { useSearchParams } from "react-router-dom";

export function useJobsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const location = searchParams.get("loc") || "";
  const seniority = searchParams.get("seniority") || "";
  const skills = searchParams.getAll("skills") || [];
  const sort = searchParams.get("sort") || "date-desc";

  return { q, location, seniority, skills, sort, searchParams, setSearchParams };
}

export function updateParamBatch(searchParams, setSearchParams, patch) {
  const next = new URLSearchParams(searchParams);

  Object.entries(patch).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      next.delete(key);
      value.forEach((v) => next.append(key, v));
    } else if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });

  setSearchParams(next);
}
