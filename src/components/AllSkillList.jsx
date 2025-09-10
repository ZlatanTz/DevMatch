import { useSkills } from "../hooks/useSkills";
import SkillTag from "./SkillTag";

export function AllSkillsList() {
  const { skills, loading } = useSkills();
  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex gap-2 flex-wrap">
      {skills.map((s) => (
        <SkillTag key={s.id}>{s.name}</SkillTag>
      ))}
    </div>
  );
}
