import { useSkills } from "@/hooks/useSkills";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import SkillList from "./SkillList";
import { useAuth } from "../context/AuthContext";

export default function BasicModal({ id }) {
  const [open, setOpen] = useState(false);
  const { items: jobs } = useLoaderData();
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

  const statusLabel = status === "open" ? "Open" : status === "paused" ? "Paused" : "Closed";

  const date = new Date(created_at);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const { user } = useAuth();
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
          <div className="bg-white rounded-2xl shadow-xl w-[90vw] h-[90vh] p-4 md:p-6 flex flex-col overflow-hidden">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="container mx-auto">
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
                    <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
                      <p className="font-semibold text-federal-blue text-2xl mb-2">About the job</p>
                      <p className="mb-4 text-gray-700">{company_description}</p>
                      <p className="font-semibold text-paynes-gray mb">The role entails:</p>
                      <p className="mb-4 text-gray-700">{description}</p>
                      <p className="font-semibold text-paynes-gray">
                        What we are looking for in you:
                      </p>
                      <div className="mt-auto pt-3 pb-3 flex items-center justify-between text-sm">
                        <SkillList names={skillNames} max={skillNames.length} />
                      </div>
                      {Array.isArray(benefits) && benefits.length > 0 ? (
                        <>
                          <p className="font-semibold text-paynes-gray my-2">What we offer:</p>
                          <ul className="mb-4 text-gray-700 list-disc list-inside">
                            {benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-6 order-1 md:order-2 lg:w-3/10 md:w-4/10">
                      <div className="job-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                        <div className="flex justify-start items-center mb-4">
                          <p className="text-paynes-gray font-medium">Status:</p>
                          <p className="text-gray-700 pl-1">{statusLabel}</p>
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
                      <div className="employer-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
                        <div className="flex justify-start items-center mb-4">
                          <p className="text-paynes-gray font-medium">Company:</p>
                          <p className="text-gray-700 pl-1">{employer.company_name}</p>
                        </div>

                        <div className="flex justify-start items-center mb-4">
                          <p className="text-paynes-gray font-medium">Location :</p>
                          <p className="text-gray-700 pl-1">{employer.location}</p>
                        </div>
                        <div className="flex justify-start items-center mb-4">
                          <p className="text-paynes-gray font-medium">Country:</p>
                          <p className="text-gray-700 pl-1">{employer.country}</p>
                        </div>
                        <div className="flex justify-start items-center mb-4">
                          <p className="text-paynes-gray font-medium">Phone:</p>
                          <p className="text-gray-700 pl-1">{employer.tel}</p>
                        </div>
                        <div className="flex justify-start items-center ">
                          <p className="text-paynes-gray font-medium">Website:</p>
                          <a href={employer.website} target="_blank" className="text-emerald pl-1">
                            {employer.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4 ">
              {user?.candidate && (
                <Link to={`/jobs/${id}`}>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-6 py-2 bg-emerald rounded-lg hover:opacity-90 transition-colors text-lg text-white"
                  >
                    Apply
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
