// import {
//   useLoaderData,
//   useSearchParams,
//   useNavigation,
//   Link,
//   createSearchParams,
// } from "react-router-dom";
// import Toolbar from "../components/Toolbar";
// import { JobCard } from "../components/JobCard";
// import { readParams, filterAndSort } from "../utils/JobFilters";
// import { useMemo } from "react";
// import { JobCardSkeletonGrid } from "../components/Skeleton";

// export const Jobs = () => {
//   const { items: allJobs, total, page, pageSize } = useLoaderData();
//   const [sp] = useSearchParams();
//   const navigation = useNavigation();
//   const isLoading = navigation.state === "loading";

//   const params = useMemo(() => readParams(sp), [sp.toString()]);
//   const jobs = useMemo(() => filterAndSort(allJobs || [], params), [allJobs, params]);

//   const totalPages = Math.ceil(total / pageSize);

//   const preserveFilters = (newPage) => {
//     const params = Object.fromEntries(sp.entries());
//     params.page = newPage;
//     return `?${createSearchParams(params)}`;
//   };

//   return (
//     <section>
//       <Toolbar />

//       {isLoading ? (
//         <JobCardSkeletonGrid />
//       ) : (
//         <>
//           <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 m-10">
//             {jobs.map((job) => (
//               <JobCard key={job.id} {...job} />
//             ))}
//           </section>

//           <div className="flex justify-center gap-2 mt-3 mb-6">
//             {Array.from({ length: totalPages }).map((_, i) => (
//               <Link
//                 key={i}
//                 to={preserveFilters(i + 1)}
//                 className={`px-3 py-1 rounded ${page === i + 1 ? "bg-emerald text-white" : "bg-gray-200"}`}
//               >
//                 {i + 1}
//               </Link>
//             ))}
//           </div>
//         </>
//       )}
//     </section>
//   );
// };

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

  // Čitamo filter parametre iz URL-a
  const params = useMemo(() => readParams(sp), [sp.toString()]);

  // Primjena filtera i sortiranja na cijelu listu
  const filteredJobs = useMemo(() => filterAndSort(allJobs || [], params), [allJobs, params]);

  // Pagination: slice filtrirane liste
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
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 m-10">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </section>

          {/* Pagination - fiksirano iznad footera */}
          <div className="flex justify-center gap-2 mt-6 mb-10 sticky bottom-0 bg-white/50 py-4">
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
