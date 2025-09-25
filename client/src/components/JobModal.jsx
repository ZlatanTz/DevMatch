import { useSkills } from "@/hooks/useSkills";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import SkillList from "./SkillList";

export default function BasicModal({ id }) {
  const [open, setOpen] = useState(false);

  const jobs = useLoaderData();
  const job = jobs.find((job) => job.id === parseInt(id));
  const {
    title,
    employer_id,
    company_img,
    location,
    employment_type,
    seniority,
    min_salary,
    max_salary,
    is_remote,
    status,
    created_at,
    description,
    company_description,
    benefits,
    employer,
  } = job;

  const date = new Date(created_at);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const skill_ids = job.skills.map((skill) => skill.id);
  const { getNamesForIds } = useSkills();
  const skillNames = getNamesForIds(skill_ids);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="text-emerald hover:underline font-medium cursor-pointer"
      >
        View details
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90vw] h-[90vh] relative flex flex-col">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="max-w-6xl mx-auto px-4 py-4 bg-white min-w-[320px]">
                <img
                  src={company_img}
                  alt={`${employer_id} logo`}
                  className="w-full h-48 sm:h-56 md:h-64 object-contain object-center rounded-lg mb-6 shadow-md mx-auto"
                />

                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
                  <p className="mx-2 font-medium">{employer.company_name}</p>
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
                      <p className="font-semibold text-paynes-gray">
                        What we are looking for in you:
                      </p>
                      <div className="mt-auto pt-3 pb-3 flex items-center justify-between text-sm">
                        <SkillList names={skillNames} max={skillNames.length} />
                      </div>
                      <p className="font-semibold text-paynes-gray">What we offer:</p>
                      <ul className="mb-4 text-gray-700 list-disc list-inside">
                        {benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="job-side-details flex-1 p-6 rounded-lg shadow border border-gray-200 md:self-start">
                      <div className="flex justify-start items-center mb-4">
                        <p className="text-paynes-gray font-medium">Status:</p>
                        <p className="text-gray-700 pl-1">
                          {status === "open" ? "Open" : "Closed"}
                        </p>
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
            </div>

            <div className="flex justify-center pt-4 ">
              <Link to={`/jobs/${id}`}>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 bg-emerald rounded-lg hover:opacity-90 transition-colors text-lg text-white"
                >
                  Apply
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
