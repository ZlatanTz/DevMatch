import { useState, useEffect } from "react";
import { getAllEmployerJobs, getJobByIdDetailed, getRankedApplications } from "@/api/services/jobs";
import { useAuth } from "@/context/AuthContext";
import SkillList from "../components/SkillList";

export default function MyJobSubmits() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useAuth();
  console.log(user);
  const employerId = user.employer?.employerId;
  console.log("Employer ID:", employerId);

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

  // const handleJobClick = async (job) => {
  //   try {
  //     const detailedJob = await getJobByIdDetailed(job.id);
  //     setSelectedJob(detailedJob);
  //   } catch (error) {
  //     console.error("Failed to fetch job details:", error);
  //   }
  // };

  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async (jobId) => {
    try {
      const data = await getRankedApplications(jobId);
      setCandidates(data || []);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setCandidates([]);
    }
  };

  const handleJobClick = async (job) => {
    try {
      const detailedJob = await getJobByIdDetailed(job.id);
      setSelectedJob(detailedJob);

      await fetchCandidates(job.id); // fetch candidates
    } catch (error) {
      console.error("Failed to fetch job details:", error);
    }
  };

  const closeModal = () => setSelectedJob(null);

  const skillNames = selectedJob?.skills?.map((skill) => skill.name) || [];

  return (
    <div className="p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl text-emerald font-bold mb-4">My Posted Jobs</h1>

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
              <p className="text-gray-600 mb-2">{job.company_description || "Company"}</p>
              <p className="text-gray-500 text-sm">
                <span className="font-medium">Posted:</span>{" "}
                {new Date(job.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-medium">Status:</span>{" "}
                {job.status === "open" ? "Open" : "Closed"}
              </p>
            </div>
          ))}
        </div>

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
                          <div className="flex justify-start items-center mb-4">
                            <p className="text-paynes-gray font-medium">Status:</p>
                            <p className="text-gray-700 pl-1">
                              {selectedJob.status === "open" ? "Open" : "Closed"}
                            </p>
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

                  {/* Applicants list */}
                  {candidates.length > 0 && (
                    <div className="mt-6 p-4 rounded-lg mb-8 bg-gray-50 shadow border border-gray-200 overflow-y-auto max-h-80">
                      <p className="font-semibold text-federal-blue text-xl mb-4">Applicants</p>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-around gap-4">
                        {candidates.map((c) => (
                          <div
                            key={c.application_id}
                            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-between items-center gap-4 w-full"
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
                              {c.candidate.skills?.map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-emerald text-white text-xs px-2 py-1 rounded-full"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
