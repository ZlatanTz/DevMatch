import { useState, useEffect } from "react";
import { getAllCandidateApplications } from "@/api/services/applications";
import { getJobById, getJobByIdDetailed } from "@/api/services/jobs";
import { useSkills } from "@/hooks/useSkills";
import SkillList from "../components/SkillList";

export default function MySubmits() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const { getNamesForIds } = useSkills();
  const userId = 1;

  useEffect(() => {
    const fetchApplicationsAndJobs = async () => {
      try {
        const apps = await getAllCandidateApplications(userId);
        setApplications(apps);

        const jobIds = [...new Set(apps.map((app) => app.job_id))];

        const jobsData = await Promise.all(jobIds.map((id) => getJobById(id)));
        setJobs(jobsData);
      } catch (error) {
        console.error("Failed to fetch applications/jobs:", error);
      }
    };

    if (userId) fetchApplicationsAndJobs();
  }, [userId]);

  const findJobById = (jobId) => {
    return jobs.find((job) => job.id === jobId);
  };

  const handleApplicationClick = (application) => {
    const job = findJobById(application.job_id);
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const skillIds = selectedJob?.skills?.map((skill) => skill.id) || [];
  const skillNames = getNamesForIds(skillIds);
  return (
    <div className="p-6">
      <h1 className="text-2xl text-emerald font-bold mb-4">My Job Applications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors hover:shadow-md h-full flex flex-col"
            onClick={() => handleApplicationClick(application)}
          >
            <h3 className="font-semibold text-lg text-federal-blue mb-2 line-clamp-2">
              {application.job_id}
            </h3>
            <p className="text-gray-600 mb-2">{application.company}</p>

            <div className="mb-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  application.status === "in_review"
                    ? "bg-blue-100 text-blue-800"
                    : application.status === "applied"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {application.status === "in_review"
                  ? "In Review"
                  : application.status === "applied"
                    ? "Applied"
                    : application.status}
              </span>
            </div>

            <div className="mt-auto space-y-1">
              <p className="text-gray-500 text-sm">
                <span className="font-medium">Score:</span> {application.score}/100
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-medium">Applied:</span>{" "}
                {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
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
              <div className="min-w-0">
                <img
                  src={selectedJob.company_img}
                  alt={`${selectedJob.company} logo`}
                  className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg mb-6 shadow-md mx-auto"
                />

                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
                  <p className="mx-2 font-medium">{selectedJob.company}</p>
                  <p className="mx-2 font-medium">{selectedJob.title}</p>
                  <p className="mx-2 font-medium">{selectedJob.location}</p>
                  <p className="mx-2 font-medium">{selectedJob.seniority}</p>
                  <p className="mx-2 font-medium">{selectedJob.employment_type}</p>
                  <p className="mx-2 font-medium">{selectedJob.is_remote ? "Remote" : "On-site"}</p>
                </div>

                <div className="container mx-auto">
                  <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
                      <p className="font-semibold text-federal-blue text-2xl">About the job</p>
                      <p className="mb-4 text-gray-700">{selectedJob.company_description}</p>
                      <p className="font-semibold text-paynes-gray">The role entails:</p>
                      <p className="mb-4 text-gray-700">{selectedJob.description}</p>
                      <p className="font-semibold text-paynes-gray">
                        What we are looking for in you:
                      </p>
                      <div className="mt-auto pt-3 pb-3 flex items-center justify-between text-sm">
                        <SkillList names={skillNames} max={skillNames.length} />
                      </div>
                      <p className="font-semibold text-paynes-gray">What we offer:</p>
                      <ul className="mb-4 text-gray-700 list-disc list-inside">
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="job-side-details flex-1 p-6 rounded-lg shadow border border-gray-200 md:self-start order-1 md:order-2">
                      <div className="flex justify-start items-center mb-4">
                        <p className="text-paynes-gray font-medium">Status:</p>
                        <p className="text-gray-700 pl-1">
                          {selectedJob.status === "open" ? "Open" : "Closed"}
                        </p>
                      </div>

                      <div className="flex justify-start items-center mb-4">
                        <p className="text-paynes-gray font-medium">Date posted:</p>
                        <p className="text-gray-700 pl-1">{selectedJob.formattedDate}</p>
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
  );
}
