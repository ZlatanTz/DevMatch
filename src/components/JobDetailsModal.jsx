import AllSkillsList from "../components/AllSkillsList";
import { useLoaderData, useParams } from "react-router-dom";
import SkillList from "../components/SkillList";
import { useSkills } from "../hooks/useSkills";

const JobDetailsModal = ({ passedId }) => {
  const jobs = useLoaderData();
  const { id } = passedId; // ID iz URL-a
  const job = jobs.find((job) => job.id === parseInt(id));
  const {
    title,
    company,
    company_img,
    location,
    employment_type,
    seniority,
    min_salary,
    max_salary,
    is_remote,
    status,
    skills,
    created_at,
    description,
    company_description,
    benefits,
  } = job;

  const date = new Date(created_at);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const { getNamesForIds } = useSkills();
  const skillNames = getNamesForIds(skills);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white min-h-screen min-w-[320px]">
      <img
        src={company_img}
        alt={`${company} logo`}
        className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain object-center rounded-lg mb-6 shadow-md"
      />

      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
        <p className="mx-2 font-medium">{company}</p>
        <p className="mx-2 font-medium">{title}</p>
        <p className="mx-2 font-medium">{location}</p>
        <p className="mx-2 font-medium">{seniority}</p>
        <p className="mx-2 font-medium">{employment_type}</p>
        <p className="mx-2 font-medium">{is_remote ? "Remote" : "On-site"}</p>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200">
            <p className="font-semibold text-federal-blue text-2xl">About the job</p>
            <p className="mb-4 text-gray-700">{company_description}</p>
            <p className="font-semibold text-paynes-gray">The role entails:</p>
            <p className="mb-4 text-gray-700">{description}</p>
            <p className="font-semibold text-paynes-gray">What we are looking for in you:</p>
            <div className="mt-auto pt-3 pb-3 flex items-center justify-between text-sm">
              <SkillList names={skillNames} max={skillNames.length} />
            </div>
            <p className="font-semibold text-paynes-gray">What we offer:</p>
            <p className="mb-4 text-gray-700">
              <ul className="mb-4 text-gray-700 list-disc list-inside">
                {benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </p>
          </div>
          <div className="job-side-details flex-1 p-6 rounded-lg shadow border border-gray-200 md:self-start">
            <div className="flex justify-start items-center mb-4">
              <p className="text-paynes-gray font-medium">Status:</p>
              <p className="text-gray-700 pl-1">{status === "open" ? "Open" : "Closed"}</p>
            </div>

            <div className="flex justify-start items-center mb-4">
              <p className="text-paynes-gray font-medium">Date posted:</p>
              <p className="text-gray-700 pl-1">{formattedDate}</p>
            </div>
            <div className="flex justify-start items-center mb-4">
              <p className="text-paynes-gray font-medium">Location:</p>
              <p className="text-gray-700 pl-1">{location}</p>
            </div>
            <div className="flex justify-start items-center ">
              <p className="text-paynes-gray font-medium">Salary:</p>
              <p className="text-gray-700 pl-1">
                {min_salary}€ - {max_salary}€
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
