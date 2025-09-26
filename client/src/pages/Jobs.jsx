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

      {isLoading ? (
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
