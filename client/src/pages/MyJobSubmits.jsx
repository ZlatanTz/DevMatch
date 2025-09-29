import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllEmployerJobs,
  getJobByIdDetailed,
  getRankedApplications,
  updateJobStatus,
} from "@/api/services/jobs";
import { useAuth } from "@/context/AuthContext";
import SkillList from "../components/SkillList";
import { updateApplicationStatus } from "@/api/services/applications";

export default function MyJobSubmits() {
  const [jobs, setJobs] = useState([]);
  const [jobDetailsCache, setJobDetailsCache] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [jobActionError, setJobActionError] = useState(null);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const { user } = useAuth();
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
        if (exists) return prev.map((job) => (job.id === newJob.id ? newJob : job));
        return [newJob, ...prev];
      });
      setJobDetailsCache((prev) => ({ ...prev, [newJob.id]: newJob }));
      fetchJobs();
    };

    window.addEventListener("job:add", handleJobAdded);
    return () => window.removeEventListener("job:add", handleJobAdded);
  }, [employerId, fetchJobs]);

  const handleJobClick = async (job) => {
    setJobActionError(null);
    setSelectedJobId(job.id);
    setSelectedCandidate(null); // reset selected candidate

    if (jobDetailsCache[job.id]) {
      await fetchCandidates(job.id);
      return;
    }

    setLoadingJobDetails(true);
    try {
      const detailedJob = await getJobByIdDetailed(job.id);
      setJobDetailsCache((prev) => ({ ...prev, [job.id]: detailedJob }));
      await fetchCandidates(job.id);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    } finally {
      setLoadingJobDetails(false);
    }
  };

  const fetchCandidates = async (jobId) => {
    try {
      const data = await getRankedApplications(jobId);
      setCandidates(data || []);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setCandidates([]);
    }
  };

  const closeModal = () => {
    setSelectedJobId(null);
    setSelectedCandidate(null);
    setJobActionError(null);
  };

  const handleJobStatusChange = async (jobId, nextStatus) => {
    try {
      setUpdatingJobId(jobId);
      setJobActionError(null);
      const updatedJob = await updateJobStatus(jobId, nextStatus);
      setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, ...updatedJob } : job)));
      setJobDetailsCache((prev) =>
        prev[jobId] ? { ...prev, [jobId]: { ...prev[jobId], ...updatedJob } } : prev,
      );
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

  const skillNames = selectedJob?.skills?.map((skill) => skill.name) || [];
  const selectedJobStatusLabel = formatJobStatus(selectedJob?.status);
  const selectedJobStatusActions = selectedJob ? getJobStatusActions(selectedJob.status) : [];
  const isUpdatingSelectedJob = selectedJob ? updatingJobId === selectedJob.id : false;
  const selectedJobActionError =
    selectedJob && jobActionError?.jobId === selectedJob.id ? jobActionError.message : null;

  const handleAccept = (applicationId) => {
    console.log("Accepted:", applicationId);
    updateApplicationStatus(applicationId, "accepted");
  };

  const handleDecline = (applicationId) => {
    console.log("Declined:", applicationId);
    updateApplicationStatus(applicationId, "rejected");
  };

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

        {selectedJob && (
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
                  {selectedJob.employer?.company_logo && (
                    <img
                      src={selectedJob.employer.company_logo}
                      alt={selectedJob.employer.company_name || "Company Logo"}
                      className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg mb-6 shadow-md mx-auto"
                    />
                  )}

                  {/* Job summary */}
                  <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
                    <p className="mx-2 font-medium">
                      {selectedJob.employer?.company_name ||
                        user.employer?.companyName ||
                        "Company"}
                    </p>
                    {selectedJob.title && <p className="mx-2 font-medium">{selectedJob.title}</p>}
                    {selectedJob.location && (
                      <p className="mx-2 font-medium">{selectedJob.location}</p>
                    )}
                    {selectedJob.seniority && (
                      <p className="mx-2 font-medium">{selectedJob.seniority}</p>
                    )}
                    {selectedJob.employment_type && (
                      <p className="mx-2 font-medium">{selectedJob.employment_type}</p>
                    )}
                    <p className="mx-2 font-medium">
                      {selectedJob.is_remote ? "Remote" : "On-site"}
                    </p>
                  </div>

                  {/* Job details and side panel */}
                  <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
                        <p className="font-semibold text-federal-blue text-2xl mb-2">
                          About the job
                        </p>
                        {selectedJob.company_description && (
                          <p className="mb-4 text-gray-700">{selectedJob.company_description}</p>
                        )}
                        <p className="font-semibold text-paynes-gray">The role entails:</p>
                        <p className="mb-4 text-gray-700">
                          {selectedJob.description || "No description provided."}
                        </p>
                        <p className="font-semibold text-paynes-gray mb-2">
                          What we are looking for in you:
                        </p>
                        <SkillList names={skillNames} max={skillNames.length} />

                        {Array.isArray(selectedJob.benefits) && selectedJob.benefits.length > 0 && (
                          <>
                            <p className="font-semibold text-paynes-gray mt-2">What we offer:</p>
                            <ul className="mb-4 text-gray-700 list-disc list-inside">
                              {selectedJob.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </>
                        )}
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

                            {selectedJobStatusActions.length > 0 && (
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
                            )}

                            {selectedJobActionError && (
                              <p className="text-sm text-red-600">{selectedJobActionError}</p>
                            )}
                          </div>

                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Date posted:</p>
                            <p className="text-gray-700 pl-1">
                              {new Date(selectedJob.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Location:</p>
                            <p className="text-gray-700 pl-1">{selectedJob.location}</p>
                          </div>
                          <div className="flex justify-start items-center ">
                            <p className="text-paynes-gray font-medium">Salary:</p>
                            <p className="text-gray-700 pl-1">
                              {selectedJob.min_salary}€ - {selectedJob.max_salary}€
                            </p>
                          </div>
                        </div>

                        {selectedJob.employer?.company_name && (
                          <div className="employer-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                            <div className="flex justify-start items-center mb-4">
                              <p className="text-paynes-gray font-medium">Company:</p>
                              <p className="text-gray-700 pl-1">
                                {selectedJob.employer.company_name}
                              </p>
                            </div>
                            <div className="flex justify-start items-center mb-4">
                              <p className="text-paynes-gray font-medium">Location :</p>
                              <p className="text-gray-700 pl-1">{selectedJob.employer.location}</p>
                            </div>
                            <div className="flex justify-start items-center mb-4">
                              <p className="text-paynes-gray font-medium">Country:</p>
                              <p className="text-gray-700 pl-1">{selectedJob.employer.country}</p>
                            </div>
                            <div className="flex justify-start items-center mb-4">
                              <p className="text-paynes-gray font-medium">Phone:</p>
                              <p className="text-gray-700 pl-1">{selectedJob.employer.tel}</p>
                            </div>
                            <div className="flex justify-start items-center ">
                              <p className="text-paynes-gray font-medium">Website:</p>
                              <a
                                href={selectedJob.employer.website}
                                target="_blank"
                                className="text-emerald pl-1"
                              >
                                {selectedJob.employer.website}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {candidates.length > 0 && (
                    <div
                      className={`mt-6 p-4 rounded-lg mb-8 bg-gray-50 shadow border border-gray-200 ${
                        selectedCandidate ? "" : "overflow-y-auto max-h-80"
                      }`}
                    >
                      {selectedCandidate ? (
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
                          <div className="flex-none order-1 md:order-2 flex flex-col justify-between items-center md:items-end h-full gap-4">
                            <img
                              src={selectedCandidate.candidate.img_path}
                              alt={selectedCandidate.candidate.img_path}
                              className="h-[200px] w-[200px] rounded-full object-cover"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(selectedCandidate.application_id)}
                                className="px-3 py-1.5 bg-emerald text-white rounded-md hover:bg-emerald/80 transition-colors text-sm"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDecline(selectedCandidate.application_id)}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-500/80 transition-colors text-sm"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                          {/* Lijevi sadržaj */}
                          <div className="flex-1 flex flex-col gap-2 order-2 md:order-1">
                            <p className="font-semibold text-federal-blue text-xl mb-2">
                              Application Details
                            </p>
                            <p>
                              <span className="font-medium">Name:</span>{" "}
                              {selectedCandidate.candidate.first_name}{" "}
                              {selectedCandidate.candidate.last_name}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {selectedCandidate.candidate.tel}
                            </p>
                            <p>
                              <span className="font-medium">Location:</span>{" "}
                              {selectedCandidate.candidate.location},{" "}
                              {selectedCandidate.candidate.country}
                            </p>
                            <p>
                              <span className="font-medium">Seniority:</span>{" "}
                              {selectedCandidate.candidate.seniority.charAt(0).toUpperCase() +
                                selectedCandidate.candidate.seniority.slice(1)}
                            </p>
                            <p>
                              <span className="font-medium">Years of Experience:</span>{" "}
                              {selectedCandidate.candidate.years_exp}
                            </p>
                            <p>
                              <span className="font-medium">Desired Salary:</span>{" "}
                              {selectedCandidate.candidate.desired_salary}€
                            </p>
                            <p>
                              <span className="font-medium">Score:</span>{" "}
                              {selectedCandidate.score.toFixed(2)}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <p className="font-medium">Skills:</p>
                              {selectedCandidate.candidate.skills?.map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-emerald text-white text-xs px-2 py-1 rounded-full"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                            <div>
                              <p className="font-medium">Resume:</p>
                              <a
                                href={selectedCandidate.candidate.resume_url}
                                target="_blank"
                                className="text-paynes-gray hover:underline"
                              >
                                {selectedCandidate.candidate.resume_url}
                              </a>
                            </div>
                            <div>
                              <p className="font-medium">About me:</p>
                              {selectedCandidate.candidate.bio}
                            </div>
                            <button
                              onClick={() => setSelectedCandidate(null)}
                              className="mt-4 px-4 py-2 bg-emerald text-white rounded-lg hover:opacity-90"
                            >
                              Back to Applicants
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-around gap-4">
                          {candidates.map((c) => (
                            <div
                              key={c.application_id}
                              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-between items-center gap-4 w-full cursor-pointer"
                              onClick={() => setSelectedCandidate(c)}
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {c.candidate.first_name && c.candidate.last_name
                                    ? `${c.candidate.first_name} ${c.candidate.last_name}`
                                    : c.candidate.email}
                                </p>
                              </div>

                              <div className="flex-1 text-center">
                                <p className="text-gray-600 text-sm">Score: {c.score.toFixed(2)}</p>
                              </div>

                              <div className="flex-1 flex flex-wrap gap-2 justify-end">
                                {c.candidate.skills?.slice(0, 4).map((s) => (
                                  <span
                                    key={s.id}
                                    className="bg-emerald text-white text-xs px-2 py-1 rounded-full"
                                  >
                                    {s.name}
                                  </span>
                                ))}

                                {c.candidate.skills && c.candidate.skills.length > 4 && (
                                  <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                                    +{c.candidate.skills.length - 4} more
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleAccept(c.application_id)}
                                  className="px-3 py-1.5 bg-emerald text-white rounded-md hover:bg-emerald/80 transition-colors text-sm"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDecline(c.application_id)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-500/80 transition-colors text-sm"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

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
        )}
      </div>
    </div>
  );
}
