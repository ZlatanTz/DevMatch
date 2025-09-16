export default function SkillTag({ children, onClick, isSelected }) {
  const baseClasses = "px-2 py-1 rounded text-xs cursor-pointer";
  const selectedClass = isSelected ? "bg-paynes-gray text-white" : "bg-dark-purple text-white";

  return (
    <span className={`${baseClasses} ${selectedClass}`} onClick={onClick}>
      {children}
    </span>
  );
}
