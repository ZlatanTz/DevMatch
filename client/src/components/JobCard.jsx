import { useMemo } from "react";
import { Link } from "react-router-dom";
import SkillList from "./SkillList";
import { useSkills } from "../hooks/useSkills";
import BasicModal from "./JobModal";
import { useAuth } from "../context/AuthContext";

export function JobCard({
  id,
  title,
  location,
  employment_type,
  description,
  skills = [],
  employer,
  recommendation,
}) {
  // console.log(skills);
  const skill_ids = skills.map((skill) => skill.id);
  const { getNamesForIds } = useSkills();
  const skillNames = getNamesForIds(skill_ids);
  const { user } = useAuth();
  const hasScore = typeof recommendation?.score === "number";
  const formattedRecommendationScore = useMemo(() => {
    if (!hasScore) return null;

    const score = recommendation?.score ?? 0;
    if (Number.isNaN(score)) return null;

    if (score <= 1) {
      return `${Math.round(score * 100)}%`;
    }

    return `${Math.round(score)}`;
  }, [hasScore, recommendation?.score]);

  const recommendationReasons = useMemo(() => {
    if (!Array.isArray(recommendation?.reasons)) return [];

    return recommendation.reasons
      .map((entry) => {
        if (typeof entry === "string") return entry.trim();
        if (entry == null) return null;
        if (typeof entry === "object") {
          return (entry.description || entry.reason || entry.message || "").trim();
        }
        return String(entry).trim();
      })
      .filter(Boolean)
      .map((text) => {
        if (text.length <= 90) return text;
        const trimmed = text.slice(0, 87).trim();
        return `${trimmed}…`;
      });
  }, [recommendation?.reasons]);

  const wrapperClasses = recommendation
    ? "bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col h-full min-h-[360px]"
    : "bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col h-full";

  return (
    <div className={wrapperClasses}>
      {recommendation && (
        <div className="mb-4 rounded-md border border-emerald/20 bg-emerald/5 p-3">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-emerald/80">
            <span className="inline-flex items-center gap-1 text-emerald/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6l1.76 3.57 3.94.57-2.85 2.78.67 3.93L12 14.77l-3.52 1.86.67-3.93-2.85-2.78 3.94-.57L12 6z"
                />
              </svg>
              Recommended for you
            </span>
            {formattedRecommendationScore && (
              <span className="inline-flex items-center rounded-full bg-white text-emerald px-2 py-0.5 text-[11px] font-semibold border border-emerald/40">
                Score: {formattedRecommendationScore}
              </span>
            )}
          </div>
          {recommendationReasons.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-emerald/80">
              {recommendationReasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 rounded-full bg-emerald/50" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
              {recommendationReasons.length > 3 && (
                <li className="text-[11px] text-emerald/60">and {recommendationReasons.length - 3} more insights…</li>
              )}
            </ul>
          )}
          {recommendationReasons.length === 0 && (
            <p className="mt-2 text-xs text-emerald/70">
              We found a strong match between this role and your experience.
            </p>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-federal-blue leading-snug">{title}</h2>
        <span className="shrink-0 bg-emerald text-white text-xs px-3 py-1 rounded-full">
          {employment_type}
        </span>
      </div>

      <div className="mt-2 flex items-center text-sm text-paynes-gray gap-3">
        <span>{employer.company_name}</span>
        <span>•</span>
        <span>{location}</span>
      </div>

      <p className="mt-3 text-base text-gray-700 line-clamp-3">{description}</p>

      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <SkillList names={skillNames} max={3} />

        <div className="flex items-center gap-3">
          <BasicModal id={id}></BasicModal>
          {user?.candidate && (
            <Link to={`/jobs/${id}`}>
              <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer">
                Apply
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
