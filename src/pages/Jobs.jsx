import { useLoaderData, useSearchParams, useNavigation } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { JobCard } from "../components/JobCard";
import { readParams, filterAndSort } from "../utils/JobFilters";
import { useMemo } from "react";
import { JobCardSkeletonGrid } from "../components/Skeleton";

export const Jobs = () => {
  const allJobs = useLoaderData(); // blocking loader data, as before
  const [sp] = useSearchParams();
  const navigation = useNavigation(); // NEW
  const isLoading = navigation.state === "loading"; // NEW

  // your original memoization
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const params = useMemo(() => readParams(sp), [sp.toString()]);
  const jobs = useMemo(() => filterAndSort(allJobs || [], params), [allJobs, params]);

  return (
    <>
      <Toolbar />

      {isLoading ? (
        <JobCardSkeletonGrid />
      ) : (
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 m-10 ">
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </section>
      )}
    </>
  );
};
