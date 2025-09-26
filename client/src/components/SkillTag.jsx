export default function SkillTag({ isSelected, onClick, children, clickable = false }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs cursor-pointer text-white ${
        isSelected ? "bg-emerald" : "bg-federal-blue"
      }`}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </span>
  );
}
