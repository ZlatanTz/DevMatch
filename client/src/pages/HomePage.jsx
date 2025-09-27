import { getAllJobsDetailed, getHighestRatedJobs } from "@/api/services/jobs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServerResponseWrapper from "@/components/ServerResponseWrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [highestPaidJobs, setHighestPaidJobs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    Promise.all([getAllJobsDetailed(), getHighestRatedJobs()])
      .then(([jobsData, highestPaidData]) => {
        setJobs(jobsData.items || []);
        setHighestPaidJobs(highestPaidData.items || []);
        setIsSuccess(true);
      })
      .catch(() => {
        setIsError(true);
        setErrorStatus(500);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const daysAgo = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Added today";
    }
    return `Added ${days} days ago`;
  };

  const sortByNewest = (jobs) =>
    [...jobs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return isLoading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald/90 border-solid"></div>
    </div>
  ) : isError ? (
    <div className="mx-auto max-w-lg mt-8 rounded-xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 text-center shadow-sm">
      <p className="text-sm text-red-600">{String(error || "erorr")}</p>
    </div>
  ) : (
    <ServerResponseWrapper
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      errorStatus={errorStatus}
    >
      <div className="container mx-auto p-4 sm:p-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Carousel */}
        <div className="col-span-1 lg:col-span-3">
          <div className="relative h-full rounded-2xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 sm:p-6 shadow-sm">
            <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-tr from-federal-blue/5 via-paynes-gray/5 to-emerald/5" />
            <h2 className="relative text-xl text-federal-blue sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
              Latest Jobs
            </h2>

            <div className="relative px-2 sm:px-4">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: false,
                  initial: 0,
                }}
              >
                <CarouselContent className="flex gap-3 sm:gap-4">
                  {sortByNewest(jobs)
                    .slice(0, 10)
                    .reverse()
                    .map((job) => (
                      <CarouselItem key={job.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="group relative flex h-72 sm:h-80 w-full flex-col justify-between rounded-2xl border border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm transition-all motion-safe:duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity motion-safe:duration-300 bg-gradient-to-br from-paynes-gray/5 to-federal-blue/5" />

                          <h3 className="relative text-base sm:text-lg font-semibold text-center leading-snug line-clamp-2">
                            {job.title}
                          </h3>

                          <p className="relative text-xs sm:text-sm text-muted-foreground text-center mb-1 truncate">
                            {job.employer.company_name}
                          </p>

                          <p className="relative text-xs sm:text-sm text-foreground/80 text-center italic mb-2">
                            {job.employment_type}
                          </p>

                          <p className="relative text-xs sm:text-sm text-center font-bold text-emerald">
                            {job.min_salary}€ – {job.max_salary}€
                          </p>

                          <div className="relative flex flex-wrap justify-center gap-1.5 mb-2">
                            {job.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill.name}
                                className="px-2 py-1 text-[11px] sm:text-xs rounded-full bg-muted text-foreground/80 border border-border"
                              >
                                {skill.length > 8 ? skill.substring(0, 8) + "..." : `${skill.name}`}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="px-2 py-1 text-[11px] sm:text-xs rounded-full bg-muted text-foreground/80 border border-border">
                                +{job.skills.length - 3}
                              </span>
                            )}
                          </div>

                          <p className="relative text-[11px] sm:text-xs text-muted-foreground text-center">
                            {daysAgo(job.created_at)}
                          </p>
                        </Link>
                      </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-2 sm:left-4 -translate-y-1/2 rounded-full border border-border bg-paynes-gray text-white hover:text-white hover:bg-federal-blue shadow-md p-2 sm:p-3 focus-visible:ring-2 focus-visible:ring-emerald focus-visible:outline-none motion-safe:transition" />
                <CarouselNext className="right-2 sm:right-4 -translate-y-1/2 rounded-full border border-border bg-paynes-gray text-white hover:text-white hover:bg-federal-blue shadow-md p-2 sm:p-3 focus-visible:ring-2 focus-visible:ring-emerald focus-visible:outline-none motion-safe:transition" />
              </Carousel>
            </div>
          </div>
        </div>

        {/* Highest paid */}
        <div className="col-span-1 order-1 lg:order-none">
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 sm:p-6 h-full shadow-sm">
            <h2 className="text-xl text-federal-blue sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
              Top 3 highest-paid
            </h2>

            <div className="flex flex-col gap-3">
              {highestPaidJobs.slice(0, 3).map((job, index) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <div className="relative rounded-2xl border border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all motion-safe:duration-300">
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center justify-center rounded-full bg-emerald text-white text-[11px] px-2 py-1 shadow-sm">
                        #{index + 1}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold mb-1 pr-10 line-clamp-2">
                      {job.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mb-2 truncate">
                      {job.company}
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-emerald">
                      {job.min_salary}€ – {job.max_salary}€
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Top Rated */}
        <div className="col-span-1 lg:col-span-4 order-2 lg:order-none">
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl text-federal-blue sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
              Top rated
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {jobs.slice(0, visibleCount).map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block rounded-2xl border-2 border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm transition-all motion-safe:duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                    {job.employer.company_name}
                  </p>
                  <p className="text-xs italic text-foreground/80 mb-3">{job.employment_type}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-foreground/80">Rating: 4.5</p>
                    <div className="flex text-yellow-400" aria-hidden="true">
                      {"★".repeat(4)}
                      {"☆".repeat(1)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {jobs.length > 6 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <Button
                  onClick={
                    visibleCount >= jobs.length
                      ? () => setVisibleCount(6)
                      : () => setVisibleCount((prev) => prev + 6)
                  }
                  className="bg-emerald text-white hover:bg-emerald/80 px-4 py-2 sm:py-4 w-28 sm:w-32 text-sm sm:text-base rounded-full shadow-md"
                >
                  {visibleCount >= jobs.length ? "Show Less" : "Load More"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ServerResponseWrapper>
  );
};

export default HomePage;
