import SkillTag from "./SkillTag";
export default function SkillList({ names = [], max = 4, loadSkills = false }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;

  const loadMoreSkills = () => {};

  return (
    <div className="flex gap-2 flex-wrap">
      {shown.map((n) => (
        <SkillTag key={n}>{n}</SkillTag>
      ))}
      {loadSkills === true && extra > 0 && (
        <button
          onClick={loadMoreSkills}
          className="px-2 py-1 rounded bg-emerald text-white text-xs"
        >
          Load More
        </button>
      )}
      {!loadSkills && extra > 0 && (
        <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">+{extra} more</span>
      )}
    </div>
  );
}
