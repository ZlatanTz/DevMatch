import { useState, useEffect, useMemo } from "react";
import { getAllCandidateApplications } from "@/api/services/applications";
import { getJobByIdDetailed, updateJobStatus } from "@/api/services/jobs";
import { useSkills } from "@/hooks/useSkills";
import SkillList from "../components/SkillList";

export default function MyJobSubmits() {
  const [jobs, setJobs] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [jobActionError, setJobActionError] = useState(null);
  const { getNamesForIds } = useSkills();
  const { user } = useAuth();
  const employerId = user.employer.employerId;

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

  useEffect(() => {
    const fetchJobs = async () => {
      if (!employerId) {
        console.warn("No employer ID found for current user");
        return;
      }

      try {
        const jobsData = await getAllEmployerJobs(employerId);
        console.log("Fetched jobs:", jobsData);
        setJobs(jobsData.items || []);
      } catch (error) {
        console.error("Failed to fetch employer jobs:", error);
      }
    };

    fetchJobs();
  }, [employerId]);

  const mergedApplications = useMemo(() => {
    return applications.map((app) => {
      const job = jobs.find((j) => j.id === app.job_id);
      return {
        ...app,
        job: job
          ? {
              ...job,
              formattedDate: new Date(job.created_at).toLocaleDateString("en-GB"),
            }
          : null,
      };
    });
  }, [applications, jobs]);

  const handleApplicationClick = (mergedApp) => {
    setJobActionError(null);
    setSelectedApp(mergedApp);
  };

  const closeModal = () => {
    setJobActionError(null);
    setSelectedApp(null);
  };

  const handleJobStatusChange = async (jobId, nextStatus) => {
    try {
      setUpdatingJobId(jobId);
      setJobActionError(null);
      const updatedJob = await updateJobStatus(jobId, nextStatus);

      setJobs((prev) => {
        const exists = prev.some((job) => job.id === jobId);
        if (!exists) {
          return [...prev, updatedJob];
        }
        return prev.map((job) => (job.id === jobId ? { ...job, ...updatedJob } : job));
      });

      setSelectedApp((prev) => {
        if (!prev?.job || prev.job.id !== jobId) return prev;
        return {
          ...prev,
          job: { ...prev.job, ...updatedJob },
        };
      });
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to update job status.";
      setJobActionError({ jobId, message });
    } finally {
      setUpdatingJobId(null);
    }
  };

  const skillIds = selectedApp?.job?.skills?.map((skill) => skill.id) || [];
  const skillNames = getNamesForIds(skillIds);

  const candidateSkillNames = selectedApp?.skills;

  const selectedJob = selectedApp?.job;
  const selectedJobStatusLabel = formatJobStatus(selectedJob?.status);
  const selectedJobStatusActions = selectedJob ? getJobStatusActions(selectedJob.status) : [];
  const isUpdatingSelectedJob = selectedJob ? updatingJobId === selectedJob.id : false;
  const selectedJobActionError =
    selectedJob && jobActionError?.jobId === selectedJob.id ? jobActionError.message : null;

  return (
    <div className="p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl text-emerald font-bold mb-4">My Posted Jobs</h1>

        {/* Grid of jobs */}
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
              <p className="text-gray-600 mb-2">{mergedApp.job?.employer.company_name}</p>

              <div className="mb-2 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    mergedApp.status === "in_review"
                      ? "bg-blue-100 text-blue-800"
                      : mergedApp.status === "applied"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {mergedApp.status === "in_review"
                    ? "In Review"
                    : mergedApp.status === "applied"
                      ? "Applied"
                      : mergedApp.status}
                </span>

                {mergedApp.job && (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${jobStatusBadgeClass(mergedApp.job.status)}`}
                  >
                    {formatJobStatus(mergedApp.job.status)}
                  </span>
                )}
              </div>

              <div className="mt-auto space-y-1">
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Applied:</span>{" "}
                  {new Date(mergedApp.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal with detailed job info */}
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
                  {/* Company Logo */}
                  <img
                    src={selectedJob.employer.company_logo || ""}
                    alt={selectedJob.employer?.company_logo || "Company Logo"}
                    className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg mb-6 shadow-md mx-auto"
                  />

                  {/* Job Summary */}
                  <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
                    <p className="mx-2 font-medium">
                      {selectedJob.employer?.company_name || "Company"}
                    </p>
                    <p className="mx-2 font-medium">{selectedJob.title}</p>
                    <p className="mx-2 font-medium">{selectedJob.location}</p>
                    <p className="mx-2 font-medium">{selectedJob.seniority}</p>
                    <p className="mx-2 font-medium">{selectedJob.employment_type}</p>
                    <p className="mx-2 font-medium">
                      {selectedJob.is_remote ? "Remote" : "On-site"}
                    </p>
                  </div>

                  <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      {/* Job Description */}
                      <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
                        <p className="font-semibold text-federal-blue text-2xl">About the job</p>

                        <p className="mb-4 text-gray-700">{selectedJob.company_description}</p>

                        <p className="font-semibold text-paynes-gray">The role entails:</p>
                        <p className="mb-4 text-gray-700">{selectedJob.description}</p>

                        <p className="font-semibold text-paynes-gray mb-2">
                          What we are looking for in you:
                        </p>
                        <SkillList names={skillNames} max={skillNames.length} />

                        <p className="font-semibold text-paynes-gray">What we offer:</p>
                        <ul className="mb-4 text-gray-700 list-disc list-inside">
                          {selectedJob.benefits?.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
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

                            {selectedJob && selectedJobStatusActions.length > 0 && (
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
                              {selectedJob.employer.company_name}
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
                        <div className="employer-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Compamy:</p>
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
                      </div>
                    </div>
                  </div>
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
