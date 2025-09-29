import {
  getAllJobsDetailed,
  getHighestRatedJobs,
  getRecommendedJobsFiltered,
} from "@/api/services/jobs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServerResponseWrapper from "@/components/ServerResponseWrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

import Autoplay from "embla-carousel-autoplay";
import { useAuth } from "@/context/AuthContext";
import { useSkills } from "@/hooks/useSkills";
import SkillList from "@/components/SkillList";

const INITIAL_VISIBLE = 6;

function formatCurrency(value) {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}€`;
  }
}

function daysAgo(createdAt) {
  if (!createdAt) return "";
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.max(0, now - created);
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (days === 0) return "Added today";
  if (days === 1) return "Added 1 day ago";
  return `Added ${days} days ago`;
}

function byNewestDesc(a, b) {
  return new Date(b.created_at) - new Date(a.created_at);
}

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [highestPaidJobs, setHighestPaidJobs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadMoreClicks, setLoadMoreClicks] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNamesForIds } = useSkills();
  const candidateId = user?.candidate?.candidateId;
  const roleName = user?.role?.name?.toLowerCase();
  const isCandidate = Boolean(candidateId || roleName === "candidate");
  const employerId = user?.employer?.employerId;
  const isEmployer = Boolean(employerId || roleName === "employer");

  const autoplayRef = useRef(Autoplay({ delay: 3000 }));

  useEffect(() => {
    let active = true;
    Promise.all([getAllJobsDetailed(), getHighestRatedJobs()])
      .then(([jobsData, highestPaidData]) => {
        if (!active) return;
        setJobs(Array.isArray(jobsData?.items) ? jobsData.items : []);
        setHighestPaidJobs(Array.isArray(highestPaidData?.items) ? highestPaidData.items : []);
        setIsSuccess(true);
      })
      .catch((err) => {
        console.error("Failed to load jobs", err);
        setIsError(true);
        setErrorStatus(err?.response?.status ?? 500);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isCandidate || !candidateId) {
      setRecommendedJobs([]);
      return;
    }

    let active = true;

    getRecommendedJobsFiltered(candidateId, { minScore: 0, limit: 20 })
      .then((data) => {
        if (!active) return;
        const normalized = Array.isArray(data)
          ? data.map((item) => ({
              ...item.job,
              recommendation: {
                score: item.score,
                parts: item.parts,
                reasons: item.reasons,
              },
            }))
          : [];
        setRecommendedJobs(normalized);
      })
      .catch((err) => {
        console.error("Failed to load recommended jobs", err);
        if (active) setRecommendedJobs([]);
      });

    return () => {
      active = false;
    };
  }, [candidateId, isCandidate]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
    setLoadMoreClicks(0);
  }, [jobs.length, recommendedJobs.length, isCandidate]);

  const hasRecommendations = isCandidate && recommendedJobs.length > 0;
  const displayedJobs = useMemo(
    () => (hasRecommendations ? recommendedJobs : jobs),
    [hasRecommendations, recommendedJobs, jobs],
  );
  const listTitle = hasRecommendations ? "Recommended for you" : "All jobs";
  const showLoadMore = displayedJobs.length > visibleCount;
  const loadMoreLabel = loadMoreClicks === 0 ? "Load More" : "View All Jobs";

  const latestTen = useMemo(() => [...jobs].sort(byNewestDesc).slice(0, 10), [jobs]);

  const handleLoadMore = () => {
    if (loadMoreClicks === 0) {
      setVisibleCount((prev) => Math.min(prev + INITIAL_VISIBLE, displayedJobs.length));
      setLoadMoreClicks(1);
    } else {
      navigate("/jobs");
    }
  };

  const handleJobCardClick = (job) => {
    if (!job) return;
    if (isEmployer) {
      setSelectedJob(job);
      return;
    }
    navigate(`/jobs/${job.id}`);
  };

  const closeJobModal = () => setSelectedJob(null);

  const resolveSkillNames = (job) => {
    if (!job) return [];
    const list = Array.isArray(job.skills) ? job.skills : [];

    const allHaveIds = list.every((skill) => typeof skill === "object" && skill?.id != null);
    if (allHaveIds) {
      return getNamesForIds(list.map((skill) => skill.id));
    }

    return list.map((skill) => {
      if (typeof skill === "string") return skill;
      if (skill && typeof skill === "object") return skill.name ?? String(skill.id ?? "");
      return String(skill ?? "");
    });
  };

  const selectedJobSkillNames = resolveSkillNames(selectedJob);
  const selectedJobStatus = selectedJob?.status ? selectedJob.status.toLowerCase() : "";
  const selectedJobStatusLabel =
    selectedJobStatus === "paused"
      ? "Paused"
      : selectedJobStatus === "closed"
        ? "Closed"
        : selectedJobStatus === "open"
          ? "Open"
          : "Unknown";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald/90 border-solid" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg mt-8 rounded-xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 text-center shadow-sm">
        <p className="text-sm text-red-600">{`Error ${errorStatus ?? ""}`}</p>
      </div>
    );
  }

  return (
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
                opts={{ align: "start", loop: true, initial: 0 }}
                plugins={[autoplayRef.current]}
              >
                <CarouselContent className="flex gap-3 sm:gap-4">
                  {latestTen.map((job) => (
                    <CarouselItem key={job.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                      <button
                        type="button"
                        onClick={() => handleJobCardClick(job)}
                        className="group relative flex h-72 sm:h-80 w-full flex-col justify-between rounded-2xl border border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm transition-all motion-safe:duration-300 hover:shadow-lg hover:-translate-y-0.5 text-left"
                      >
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity motion-safe:duration-300 bg-gradient-to-br from-paynes-gray/5 to-federal-blue/5" />

                        <h3 className="relative text-base sm:text-lg font-semibold text-center leading-snug line-clamp-2">
                          {job.title}
                        </h3>

                        <p className="relative text-xs sm:text-sm text-muted-foreground text-center mb-1 truncate">
                          {job.employer?.company_name ?? job.company ?? "Unknown company"}
                        </p>

                        <p className="relative text-xs sm:text-sm text-foreground/80 text-center italic mb-2">
                          {job.employment_type}
                        </p>

                        <p className="relative text-xs sm:text-sm text-center font-bold text-emerald">
                          {formatCurrency(job.min_salary)} – {formatCurrency(job.max_salary)}
                        </p>

                        <div className="relative flex flex-wrap justify-center gap-1.5 mb-2">
                          {(job.skills ?? []).slice(0, 3).map((skill, idx) => {
                            const name = typeof skill === "string" ? skill : (skill?.name ?? "");
                            const short = name.length > 12 ? `${name.slice(0, 12)}…` : name;
                            return (
                              <span
                                key={`${name}-${idx}`}
                                className="px-2 py-1 text-[11px] sm:text-xs rounded-full bg-muted text-foreground/80 border border-border"
                              >
                                {short}
                              </span>
                            );
                          })}
                          {Array.isArray(job.skills) && job.skills.length > 3 && (
                            <span className="px-2 py-1 text-[11px] sm:text-xs rounded-full bg-muted text-foreground/80 border border-border">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>

                        <p className="relative text-[11px] sm:text-xs text-muted-foreground text-center">
                          {daysAgo(job.created_at)}
                        </p>
                      </button>
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

            {highestPaidJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {highestPaidJobs.slice(0, 3).map((job, index) => (
                  <button
                    key={job.id ?? `${job.title}-${index}`}
                    type="button"
                    onClick={() => handleJobCardClick(job)}
                    className="relative w-full rounded-2xl border border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all motion-safe:duration-300 text-left"
                  >
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center justify-center rounded-full bg-emerald text-white text-[11px] px-2 py-1 shadow-sm">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold mb-1 pr-10 line-clamp-2">
                        {job.title}
                      </p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mb-2 truncate">
                        {job.employer?.company_name ?? job.company ?? "Unknown company"}
                      </p>
                      <p className="text-sm sm:text-base font-extrabold text-emerald">
                        {formatCurrency(job.min_salary)} – {formatCurrency(job.max_salary)}
                      </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary job grid */}
        <div className="col-span-1 lg:col-span-4 order-2 lg:order-none">
          <div className="rounded-2xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl text-federal-blue sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
              {listTitle}
            </h2>

            {displayedJobs.length === 0 ? (
              <div className="text-sm text-muted-foreground">No jobs to show right now.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {displayedJobs.slice(0, visibleCount).map((job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => handleJobCardClick(job)}
                      className="text-left rounded-2xl border-2 border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm transition-all motion-safe:duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                        {job.employer?.company_name ?? job.company ?? "Unknown company"}
                      </p>
                      <p className="text-xs italic text-foreground/80 mb-3">
                        {job.employment_type}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald">
                          {formatCurrency(job.min_salary)} – {formatCurrency(job.max_salary)}
                        </span>
                        <span className="text-xs text-muted-foreground">{daysAgo(job.created_at)}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {showLoadMore && (
                  <div className="flex justify-center mt-4 sm:mt-6">
                    <Button
                      onClick={handleLoadMore}
                      className="bg-emerald text-white hover:bg-emerald/80 px-4 py-2 sm:py-4 w-28 sm:w-32 text-sm sm:text-base rounded-full shadow-md"
                    >
                      {loadMoreLabel}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {selectedJob && isEmployer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-4xl h-[90vh] p-4 md:p-6 flex flex-col overflow-hidden">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={closeJobModal}
                className="text-gray-500 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="container mx-auto space-y-6">
                {selectedJob.employer?.company_logo ? (
                  <img
                    src={selectedJob.employer.company_logo}
                    alt={selectedJob.employer.company_name || "Company logo"}
                    className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg shadow"
                  />
                ) : null}

                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg bg-federal-blue text-white">
                  <p className="mx-2 font-medium">
                    {selectedJob.employer?.company_name || selectedJob.company || "Company"}
                  </p>
                  {selectedJob.title ? <p className="mx-2 font-medium">{selectedJob.title}</p> : null}
                  {selectedJob.location ? <p className="mx-2 font-medium">{selectedJob.location}</p> : null}
                  {selectedJob.seniority ? <p className="mx-2 font-medium">{selectedJob.seniority}</p> : null}
                  {selectedJob.employment_type ? (
                    <p className="mx-2 font-medium">{selectedJob.employment_type}</p>
                  ) : null}
                  <p className="mx-2 font-medium">{selectedJob.is_remote ? "Remote" : "On-site"}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                  <div className="p-6 rounded-lg shadow border border-gray-200 bg-white space-y-4">
                    <div>
                      <p className="font-semibold text-federal-blue text-2xl">About the job</p>
                      {selectedJob.company_description ? (
                        <p className="mt-3 text-gray-700">{selectedJob.company_description}</p>
                      ) : null}
                    </div>
                    {selectedJob.description ? (
                      <div>
                        <p className="font-semibold text-paynes-gray">The role entails:</p>
                        <p className="text-gray-700">{selectedJob.description}</p>
                      </div>
                    ) : null}
                    <div>
                      <p className="font-semibold text-paynes-gray mb-2">Required skills</p>
                      <SkillList names={selectedJobSkillNames} max={selectedJobSkillNames.length || 0} />
                    </div>
                    {Array.isArray(selectedJob.benefits) && selectedJob.benefits.length > 0 ? (
                      <div>
                        <p className="font-semibold text-paynes-gray">Benefits</p>
                        <ul className="text-gray-700 list-disc list-inside space-y-1">
                          {selectedJob.benefits.map((benefit, index) => (
                            <li key={`${benefit}-${index}`}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 rounded-lg shadow border border-gray-200 bg-white space-y-3">
                      <div className="flex items-center gap-2">
                        <p className="text-paynes-gray font-medium">Status:</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald/10 text-emerald">
                          {selectedJobStatusLabel}
                        </span>
                      </div>
                      <div className="flex justify-start items-center">
                        <p className="text-paynes-gray font-medium">Date posted:</p>
                        <p className="text-gray-700 pl-1">
                          {selectedJob?.created_at
                            ? new Date(selectedJob.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      {selectedJob.location ? (
                        <div className="flex justify-start items-center">
                          <p className="text-paynes-gray font-medium">Location:</p>
                          <p className="text-gray-700 pl-1">{selectedJob.location}</p>
                        </div>
                      ) : null}
                      {selectedJob.min_salary || selectedJob.max_salary ? (
                        <div className="flex justify-start items-center">
                          <p className="text-paynes-gray font-medium">Salary:</p>
                          <p className="text-gray-700 pl-1">
                            {formatCurrency(selectedJob.min_salary)} – {formatCurrency(selectedJob.max_salary)}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {selectedJob.employer ? (
                      <div className="p-6 rounded-lg shadow border border-gray-200 bg-white space-y-3">
                        {selectedJob.employer.company_name ? (
                          <div className="flex justify-start items-center">
                            <p className="text-paynes-gray font-medium">Company:</p>
                            <p className="text-gray-700 pl-1">{selectedJob.employer.company_name}</p>
                          </div>
                        ) : null}
                        {selectedJob.employer.location ? (
                          <div className="flex justify-start items-center">
                            <p className="text-paynes-gray font-medium">Location:</p>
                            <p className="text-gray-700 pl-1">{selectedJob.employer.location}</p>
                          </div>
                        ) : null}
                        {selectedJob.employer.country ? (
                          <div className="flex justify-start items-center">
                            <p className="text-paynes-gray font-medium">Country:</p>
                            <p className="text-gray-700 pl-1">{selectedJob.employer.country}</p>
                          </div>
                        ) : null}
                        {selectedJob.employer.tel ? (
                          <div className="flex justify-start items-center">
                            <p className="text-paynes-gray font-medium">Phone:</p>
                            <p className="text-gray-700 pl-1">{selectedJob.employer.tel}</p>
                          </div>
                        ) : null}
                        {selectedJob.employer.website ? (
                          <div className="flex justify-start items-center">
                            <p className="text-paynes-gray font-medium">Website:</p>
                            <a
                              href={selectedJob.employer.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald pl-1"
                            >
                              {selectedJob.employer.website}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={closeJobModal}
                className="px-6 py-2 bg-emerald rounded-lg hover:opacity-90 transition-colors text-lg text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ServerResponseWrapper>
  );
}
