import { useState, useEffect, useMemo } from "react";
import { getAllCandidateApplications } from "@/api/services/applications";
import { getJobByIdDetailed, updateJobStatus } from "@/api/services/jobs";
import { useSkills } from "@/hooks/useSkills";
import SkillList from "../components/SkillList";
import { useAuth } from "@/context/AuthContext";

export default function MySubmits() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [jobActionError, setJobActionError] = useState(null);
  const { getNamesForIds } = useSkills();
  const { user } = useAuth();
  const employerId = user.employer.employerId;

  const normalizeStatus = (value) => (typeof value === "string" ? value.toLowerCase() : String(value || "").toLowerCase());
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
    const fetchApplicationsAndJobs = async () => {
      try {
        const apps = await getAllCandidateApplications(employerId);
        setApplications(apps);

        const jobIds = [...new Set(apps.map((app) => app.job_id))];
        const jobsData = await Promise.all(jobIds.map((id) => getJobByIdDetailed(id)));
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to fetch applications/jobs:", error);
      }
    };

    if (employerId) fetchApplicationsAndJobs();
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
        <h1 className="text-2xl text-emerald font-bold mb-4">My Jobs</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mergedApplications.map((mergedApp) => (
            <div
              key={mergedApp.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors hover:shadow-md h-full flex flex-col"
              onClick={() => handleApplicationClick(mergedApp)}
            >
              <h3 className="font-semibold text-lg text-federal-blue mb-2 line-clamp-2">
                {mergedApp.job?.title || mergedApp.job_id}
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

        {selectedApp && (
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
                  <img
                    src={selectedApp.job.company_img}
                    alt={`${selectedApp.job.employer.company_name} logo`}
                    className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg mb-6 shadow-md mx-auto"
                  />

                  <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
                    <p className="mx-2 font-medium">{selectedApp.job.employer.company_name}</p>
                    <p className="mx-2 font-medium">{selectedApp.job.title}</p>
                    <p className="mx-2 font-medium">{selectedApp.job.location}</p>
                    <p className="mx-2 font-medium">{selectedApp.job.seniority}</p>
                    <p className="mx-2 font-medium">{selectedApp.job.employment_type}</p>
                    <p className="mx-2 font-medium">
                      {selectedApp.job.is_remote ? "Remote" : "On-site"}
                    </p>
                  </div>

                  <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
                        <p className="font-semibold text-federal-blue text-2xl">About the job</p>
                        <p className="mb-4 text-gray-700">{selectedApp.job.company_description}</p>
                        <p className="font-semibold text-paynes-gray">The role entails:</p>
                        <p className="mb-4 text-gray-700">{selectedApp.job.description}</p>
                        <p className="font-semibold text-paynes-gray">
                          What we are looking for in you:
                        </p>
                        <div className="mt-auto pt-3 pb-3 flex items-center justify-between text-sm">
                          <SkillList names={skillNames} max={skillNames.length} />
                        </div>
                        <p className="font-semibold text-paynes-gray">What we offer:</p>
                        <ul className="mb-4 text-gray-700 list-disc list-inside">
                          {selectedApp.job.benefits.map((benefit, index) => (
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
                                    onClick={() => handleJobStatusChange(selectedJob.id, action.nextStatus)}
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
                              {selectedApp.job.employer.company_name}
                            </p>
                          </div>
                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Location:</p>
                            <p className="text-gray-700 pl-1">{selectedApp.job.location}</p>
                          </div>
                          <div className="flex justify-start items-center ">
                            <p className="text-paynes-gray font-medium">Salary:</p>
                            <p className="text-gray-700 pl-1">
                              {selectedApp.job.min_salary}€ - {selectedApp.job.max_salary}€
                            </p>
                          </div>
                        </div>
                        <div className="employer-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Compamy:</p>
                            <p className="text-gray-700 pl-1">
                              {selectedApp.job.employer.company_name}
                            </p>
                          </div>

                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Location :</p>
                            <p className="text-gray-700 pl-1">
                              {selectedApp.job.employer.location}
                            </p>
                          </div>
                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Country:</p>
                            <p className="text-gray-700 pl-1">{selectedApp.job.employer.country}</p>
                          </div>
                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Phone:</p>
                            <p className="text-gray-700 pl-1">{selectedApp.job.employer.tel}</p>
                          </div>
                          <div className="flex justify-start items-center ">
                            <p className="text-paynes-gray font-medium">Website:</p>
                            <a
                              href={selectedApp.job.employer.website}
                              target="_blank"
                              className="text-emerald pl-1"
                            >
                              {selectedApp.job.employer.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="job-apply-form bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold text-center mb-4 text-federal-blue">
                      Apply for a job{" "}
                    </h2>

                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-federal-blue mb-1"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            placeholder="First Name"
                            value={selectedApp.first_name}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-federal-blue mb-1"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            placeholder="Last Name"
                            value={selectedApp.last_name}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-federal-blue mb-1"
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            id="email"
                            placeholder="example@email.com"
                            value={selectedApp.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="birthYear"
                            className="block text-sm font-medium text-federal-blue mb-1"
                          >
                            Year of birth
                          </label>
                          <input
                            type="number"
                            id="birthYear"
                            min="1950"
                            max="2005"
                            placeholder="Year of birth"
                            value={selectedApp.year_of_birth}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-federal-blue mb-1"
                          >
                            Phone number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            placeholder="+381 63 123456"
                            value={selectedApp.phone}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-federal-blue mb-1"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            placeholder="Where do you live?"
                            value={selectedApp.location}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="experience"
                          className="block text-sm font-medium text-federal-blue mb-1"
                        >
                          Job experience (years)
                        </label>
                        <input
                          type="number"
                          id="experience"
                          min="0"
                          placeholder="Number of years of experience"
                          value={selectedApp.years_experience}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="education"
                          className="block text-sm font-medium text-federal-blue mb-1"
                        >
                          Level
                        </label>
                        <input
                          id="seniority"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                          value={selectedApp.seniority_level}
                          disabled
                        ></input>
                      </div>

                      <div>
                        <label
                          htmlFor="skills"
                          className="block text-sm font-medium text-federal-blue mb-1"
                        >
                          Skill
                        </label>
                        <SkillList names={candidateSkillNames} max={candidateSkillNames.length} />
                      </div>

                      <div>
                        <label
                          htmlFor="cv"
                          className="block text-sm font-medium text-federal-blue mb-1"
                        >
                          Upload CV (PDF)
                        </label>
                        <input
                          type="file"
                          id="cv"
                          accept=".pdf"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/80"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="coverLetter"
                          className="block text-sm font-medium text-federal-blue mb-1"
                        >
                          Cover letter
                        </label>
                        <textarea
                          id="coverLetter"
                          rows="4"
                          placeholder="Write your cover letter here..."
                          value={selectedApp.cover_letter}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                        ></textarea>
                      </div>
                    </form>
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
