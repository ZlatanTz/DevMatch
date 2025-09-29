import {
  useLoaderData,
  useSearchParams,
  useNavigation,
  Link,
  createSearchParams,
} from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { JobCard } from "../components/JobCard";
import { readParams, filterAndSort } from "../utils/JobFilters";
import { useEffect, useMemo, useState } from "react";
import { JobCardSkeletonGrid } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { getRecommendedJobsFiltered } from "../api/services/jobs";

export const Jobs = () => {
  const { items: allJobs, page, pageSize } = useLoaderData();
  const [sp] = useSearchParams();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { user } = useAuth();
  const candidateId = user?.candidate?.candidateId;
  const roleName = user?.role?.name?.toLowerCase();
  const isCandidate = Boolean(candidateId || roleName === "candidate");
  const defaultSort = isCandidate ? "recommended" : "date-desc";

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState(null);

  const params = readParams(sp, defaultSort);
  const shouldUseRecommended = isCandidate && params.sort === "recommended";

  useEffect(() => {
    if (!shouldUseRecommended || !candidateId) {
      setRecommendedJobs([]);
      setRecommendedError(null);
      setRecommendedLoading(false);
      return;
    }

    let active = true;
    setRecommendedLoading(true);
    setRecommendedError(null);

    const mapPayloadToJobs = (payload) => {
      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : [];

      return records.map((entry) => {
        const job = entry?.job ?? entry;
        const hasRecommendationDetails =
          entry?.score !== undefined || entry?.parts !== undefined || entry?.reasons !== undefined;
        const recommendation = hasRecommendationDetails
          ? {
              score: entry?.score,
              parts: entry?.parts,
              reasons: entry?.reasons,
            }
          : entry?.recommendation;

        return recommendation ? { ...job, recommendation } : job;
      });
    };

    getRecommendedJobsFiltered(candidateId, { page, pageSize })
      .then((data) => {
        if (!active) return;

        setRecommendedJobs(mapPayloadToJobs(data));
      })
      .catch((err) => {
        console.error("Failed to load recommended jobs", err);
        if (active) {
          setRecommendedError(err);
          setRecommendedJobs([]);
        }
      })
      .finally(() => {
        if (active) setRecommendedLoading(false);
      });

    return () => {
      active = false;
    };
  }, [candidateId, page, pageSize, shouldUseRecommended]);

  const useRecommendedData = shouldUseRecommended && !recommendedError;

  const filteredJobs = useMemo(() => {
    const baseJobs = useRecommendedData ? recommendedJobs : allJobs || [];
    const result = filterAndSort(baseJobs || [], params);
    return result;
  }, [useRecommendedData, recommendedJobs, allJobs, params]);

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, page, pageSize]);

  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const preserveFilters = (newPage) => {
    const params = Object.fromEntries(sp.entries());
    params.page = newPage;
    return `?${createSearchParams(params)}`;
  };

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <section className="min-h-[80vh] relative">
      <Toolbar />

      {isLoading || (useRecommendedData && recommendedLoading) ? (
        <JobCardSkeletonGrid />
      ) : (
        <>
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 m-10 mb-2">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </section>

          <div className="flex justify-center gap-2 mt-2 bottom-0 py-4">
            {getPages().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-3 py-1">
                  ...
                </span>
              ) : (
                <Link
                  key={i}
                  to={preserveFilters(p)}
                  className={`px-3 py-1 rounded ${page === p ? "bg-emerald text-white" : "bg-gray-200"}`}
                >
                  {p}
                </Link>
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
};
