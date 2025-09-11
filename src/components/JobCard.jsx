import { Link } from "react-router-dom";
import SkillList from "./SkillList";
import { useSkills } from "../hooks/useSkills";
import BasicModal from "./JobModal";

export function JobCard({
  id,
  title,
  company,
  location,
  employment_type,
  description,
  skills = [],
}) {
  const { getNamesForIds } = useSkills();
  const skillNames = getNamesForIds(skills);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-federal-blue leading-snug">{title}</h2>
        <span className="shrink-0 bg-emerald text-white text-xs px-3 py-1 rounded-full">
          {employment_type}
        </span>
      </div>

      <div className="mt-2 flex items-center text-sm text-paynes-gray gap-3">
        <span>{company}</span>
        <span>•</span>
        <span>{location}</span>
      </div>

      <p className="mt-3 text-base text-gray-700 line-clamp-3">{description}</p>

      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <SkillList names={skillNames} max={3} />

        <div className="flex items-center gap-3">
          <BasicModal id={id}></BasicModal>
          <Link to={`/jobs/${id}`}>
            <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer">
              Apply
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
