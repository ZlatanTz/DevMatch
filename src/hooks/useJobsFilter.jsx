import { useSearchParams } from "react-router-dom";

export function useJobsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const location = searchParams.get("loc") || "";
  const seniority = searchParams.get("senio") || "";
  const skills = searchParams.getAll("skills") || "";
  const sort = searchParams.get("sort") || "date-desc";

  return { query, location, seniority, skills, sort, searchParams, setSearchParams };
}

export function updateParam(searchParams, setSearchParams, key, value) {
  const next = new URLSearchParams(searchParams);

  if (Array.isArray(value)) {
    next.delete(key);
    value.forEach((v) => next.append(key, v));
  } else if (!value) {
    next.delete(key);
  } else {
    next.set(key, value);
  }

  setSearchParams(next);
}
