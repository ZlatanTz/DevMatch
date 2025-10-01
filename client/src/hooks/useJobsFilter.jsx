import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useJobsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const roleName = user?.role?.name?.toLowerCase();
  const isCandidate = Boolean(user?.candidate?.candidateId || roleName === "candidate");
  const defaultSort = isCandidate ? "recommended" : "date-desc";

  const q = searchParams.get("q") || "";
  const location = searchParams.getAll("loc") || [];
  const seniority = searchParams.getAll("seniority") || [];
  const skills = searchParams.getAll("skills") || [];
  const sort = searchParams.get("sort") || defaultSort;

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
