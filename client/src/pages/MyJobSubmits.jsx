import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllEmployerJobs, getJobByIdDetailed, updateJobStatus } from "@/api/services/jobs";
import { useAuth } from "@/context/AuthContext";
import { useSkills } from "@/hooks/useSkills";
import SkillList from "../components/SkillList";

export default function MyJobSubmits() {
  const [jobs, setJobs] = useState([]);
  const [jobDetailsCache, setJobDetailsCache] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [jobActionError, setJobActionError] = useState(null);
  const [updatingJobId, setUpdatingJobId] = useState(null);

  const { user } = useAuth();
  const { getNamesForIds } = useSkills();
  const employerId = user?.employer?.employerId;

  const normalizeStatus = (value) =>
    typeof value === "string" ? value.toLowerCase() : String(value || "").toLowerCase();
  const formatJobStatus = (value) => {
    switch (normalizeStatus(value)) {
      case "open":
        return "Open";
      case "paused":
        return "Paused";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };
  const jobStatusBadgeClass = (value) => {
    switch (normalizeStatus(value)) {
      case "open":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getJobStatusActions = (value) => {
    switch (normalizeStatus(value)) {
      case "open":
        return [
          { label: "Pause job", nextStatus: "paused" },
          { label: "Close job", nextStatus: "closed" },
        ];
      case "paused":
        return [
          { label: "Reopen job", nextStatus: "open" },
          { label: "Close job", nextStatus: "closed" },
        ];
      case "closed":
        return [{ label: "Reopen job", nextStatus: "open" }];
      default:
        return [];
    }
  };

  const fetchJobs = useCallback(async () => {
    if (!employerId) return;

    try {
      const jobsData = await getAllEmployerJobs(employerId);
      const items = Array.isArray(jobsData?.items) ? jobsData.items : [];
      setJobs(items);
    } catch (error) {
      console.error("Failed to fetch employer jobs:", error);
    }
  }, [employerId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (!employerId) return undefined;

    const handleJobAdded = (event) => {
      const newJob = event?.detail;
      if (!newJob || newJob.employer_id !== employerId) return;

      setJobs((prev) => {
        if (!Array.isArray(prev)) return [newJob];
        const exists = prev.some((job) => job.id === newJob.id);
        if (exists) {
          return prev.map((job) => (job.id === newJob.id ? newJob : job));
        }
        return [newJob, ...prev];
      });
      setJobDetailsCache((prev) => ({ ...prev, [newJob.id]: newJob }));
      fetchJobs();
    };

    window.addEventListener("job:add", handleJobAdded);
    return () => {
      window.removeEventListener("job:add", handleJobAdded);
    };
  }, [employerId, fetchJobs]);

  const handleJobClick = async (job) => {
    setJobActionError(null);
    setSelectedJobId(job.id);

    if (jobDetailsCache[job.id]) return;

    setLoadingJobDetails(true);
    try {
      const detailedJob = await getJobByIdDetailed(job.id);
      setJobDetailsCache((prev) => ({ ...prev, [job.id]: detailedJob }));
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    } finally {
      setLoadingJobDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedJobId(null);
    setJobActionError(null);
  };

  const handleJobStatusChange = async (jobId, nextStatus) => {
    try {
      setUpdatingJobId(jobId);
      setJobActionError(null);
      const updatedJob = await updateJobStatus(jobId, nextStatus);

      setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, ...updatedJob } : job)));
      setJobDetailsCache((prev) => {
        if (!prev[jobId]) return prev;
        return { ...prev, [jobId]: { ...prev[jobId], ...updatedJob } };
      });
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to update job status.";
      setJobActionError({ jobId, message });
    } finally {
      setUpdatingJobId(null);
    }
  };

  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobDetailsCache[selectedJobId] ?? jobs.find((job) => job.id === selectedJobId) ?? null;
  }, [selectedJobId, jobDetailsCache, jobs]);

  const skillIds = selectedJob?.skills?.map((skill) => skill.id) ?? [];
  const skillNames = getNamesForIds(skillIds);

  const selectedJobStatusLabel = formatJobStatus(selectedJob?.status);
  const selectedJobStatusActions = selectedJob ? getJobStatusActions(selectedJob.status) : [];
  const isUpdatingSelectedJob = selectedJob ? updatingJobId === selectedJob.id : false;
  const selectedJobActionError =
    selectedJob && jobActionError?.jobId === selectedJob.id ? jobActionError.message : null;

  if (!user) {
    return (
      <div className="p-6">
        <div className="container mx-auto">
          <p className="text-gray-600">Please sign in to view your jobs.</p>
        </div>
      </div>
    );
  }

  if (!employerId) {
    return (
      <div className="p-6">
        <div className="container mx-auto">
          <p className="text-gray-600">You need an employer profile to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl text-emerald font-bold mb-4">My Posted Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-600">You have not posted any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors hover:shadow-md h-full flex flex-col"
                onClick={() => handleJobClick(job)}
              >
                <h3 className="font-semibold text-lg text-federal-blue mb-2 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-gray-600 mb-2">{job.location || "Location not specified"}</p>

                <div className="mb-2 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${jobStatusBadgeClass(job.status)}`}
                  >
                    {formatJobStatus(job.status)}
                  </span>

                  {job.is_remote ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Remote
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium">Posted:</span>{" "}
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                  {job.employment_type ? (
                    <p>
                      <span className="font-medium">Type:</span> {job.employment_type}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedJob ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[90vw] h-[90vh] p-4 md:p-6 flex flex-col overflow-hidden">
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto flex-grow">
                <div className="container mx-auto">
                  {selectedJob.employer?.company_logo ? (
                    <img
                      src={selectedJob.employer.company_logo}
                      alt={selectedJob.employer.company_name || "Company Logo"}
                      className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg mb-6 shadow-md mx-auto"
                    />
                  ) : null}

                  <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
                    <p className="mx-2 font-medium">
                      {selectedJob.employer?.company_name ||
                        user.employer?.companyName ||
                        "Company"}
                    </p>
                    {selectedJob.title ? (
                      <p className="mx-2 font-medium">{selectedJob.title}</p>
                    ) : null}
                    {selectedJob.location ? (
                      <p className="mx-2 font-medium">{selectedJob.location}</p>
                    ) : null}
                    {selectedJob.seniority ? (
                      <p className="mx-2 font-medium">{selectedJob.seniority}</p>
                    ) : null}
                    {selectedJob.employment_type ? (
                      <p className="mx-2 font-medium">{selectedJob.employment_type}</p>
                    ) : null}
                    <p className="mx-2 font-medium">
                      {selectedJob.is_remote ? "Remote" : "On-site"}
                    </p>
                  </div>

                  <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
                        <p className="font-semibold text-federal-blue text-2xl">About the job</p>

                        {selectedJob.company_description ? (
                          <p className="mb-4 text-gray-700">{selectedJob.company_description}</p>
                        ) : null}

                        <p className="font-semibold text-paynes-gray">The role entails:</p>
                        <p className="mb-4 text-gray-700">
                          {selectedJob.description || "No description provided."}
                        </p>

                        <p className="font-semibold text-paynes-gray mb-2">
                          What we are looking for in you:
                        </p>
                        <SkillList names={skillNames} max={skillNames.length} />

                        {Array.isArray(selectedJob.benefits) && selectedJob.benefits.length > 0 ? (
                          <>
                            <p className="font-semibold text-paynes-gray">What we offer:</p>
                            <ul className="mb-4 text-gray-700 list-disc list-inside">
                              {selectedJob.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-6 order-1 md:order-2 lg:w-3/10 md:w-4/10">
                        <div className="job-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2">
                              <p className="text-paynes-gray font-medium">Status:</p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${jobStatusBadgeClass(selectedJob?.status)}`}
                              >
                                {selectedJobStatusLabel}
                              </span>
                            </div>

                            {selectedJobStatusActions.length > 0 ? (
                              <div className="self-start flex flex-wrap gap-2">
                                {selectedJobStatusActions.map((action) => (
                                  <button
                                    key={action.nextStatus}
                                    type="button"
                                    onClick={() =>
                                      handleJobStatusChange(selectedJob.id, action.nextStatus)
                                    }
                                    disabled={isUpdatingSelectedJob}
                                    className="px-3 py-1.5 text-sm font-medium rounded-md border border-emerald text-emerald hover:bg-emerald/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    {isUpdatingSelectedJob ? "Saving..." : action.label}
                                  </button>
                                ))}
                              </div>
                            ) : null}

                            {selectedJobActionError ? (
                              <p className="text-sm text-red-600">{selectedJobActionError}</p>
                            ) : null}
                          </div>

                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Date posted:</p>
                            <p className="text-gray-700 pl-1">
                              {new Date(selectedJob.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedJob.location ? (
                            <div className="flex justify-start items-center mb-4">
                              <p className="text-paynes-gray font-medium">Location:</p>
                              <p className="text-gray-700 pl-1">{selectedJob.location}</p>
                            </div>
                          ) : null}
                          {selectedJob.min_salary || selectedJob.max_salary ? (
                            <div className="flex justify-start items-center">
                              <p className="text-paynes-gray font-medium">Salary:</p>
                              <p className="text-gray-700 pl-1">
                                {selectedJob.min_salary ? `${selectedJob.min_salary}€` : "N/A"} -{" "}
                                {selectedJob.max_salary ? `${selectedJob.max_salary}€` : "N/A"}
                              </p>
                            </div>
                          ) : null}
                        </div>
                        {selectedJob.employer?.company_name ||
                        selectedJob.employer?.location ||
                        selectedJob.employer?.country ||
                        selectedJob.employer?.tel ||
                        selectedJob.employer?.website ? (
                          <div className="employer-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                            {selectedJob.employer?.company_name ? (
                              <div className="flex justify-start items-center mb-4">
                                <p className="text-paynes-gray font-medium">Company:</p>
                                <p className="text-gray-700 pl-1">
                                  {selectedJob.employer.company_name}
                                </p>
                              </div>
                            ) : null}

                            {selectedJob.employer?.location ? (
                              <div className="flex justify-start items-center mb-4">
                                <p className="text-paynes-gray font-medium">Location:</p>
                                <p className="text-gray-700 pl-1">
                                  {selectedJob.employer.location}
                                </p>
                              </div>
                            ) : null}
                            {selectedJob.employer?.country ? (
                              <div className="flex justify-start items-center mb-4">
                                <p className="text-paynes-gray font-medium">Country:</p>
                                <p className="text-gray-700 pl-1">{selectedJob.employer.country}</p>
                              </div>
                            ) : null}
                            {selectedJob.employer?.tel ? (
                              <div className="flex justify-start items-center mb-4">
                                <p className="text-paynes-gray font-medium">Phone:</p>
                                <p className="text-gray-700 pl-1">{selectedJob.employer.tel}</p>
                              </div>
                            ) : null}
                            {selectedJob.employer?.website ? (
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
                  {loadingJobDetails && !jobDetailsCache[selectedJob.id] ? (
                    <p className="text-center text-sm text-gray-500">Loading job details...</p>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-emerald rounded-lg hover:opacity-90 transition-colors text-lg text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
