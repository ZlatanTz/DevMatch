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
import { useMemo } from "react";
import { JobCardSkeletonGrid } from "../components/Skeleton";

export const Jobs = () => {
  const { items: allJobs, page, pageSize } = useLoaderData();
  const [sp] = useSearchParams();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const params = useMemo(() => readParams(sp), [sp.toString()]);

  const filteredJobs = useMemo(() => {
    const result = filterAndSort(allJobs || [], params);
    return result;
  }, [allJobs, params]);

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

  return (
    <section className="min-h-[80vh] relative">
      <Toolbar />

      {isLoading ? (
        <JobCardSkeletonGrid />
      ) : (
        <>
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 m-10 mb-2">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </section>

          <div className="flex justify-center gap-2 my-2 sticky bottom-0 bg-white/50 py-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                to={preserveFilters(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-emerald text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
