import SkillTag from "./SkillTag";
export default function SkillList({ names = [], max = 4 }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;

  return (
    <div className="flex gap-2 flex-wrap">
      {shown.map((n) => (
        <SkillTag key={n}>{n}</SkillTag>
      ))}
      {extra > 0 && (
        <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs">+{extra} more</span>
      )}
    </div>
  );
}
