import { useSkills } from "../hooks/useSkills";
import SkillList from "./SkillList";

export default function AllSkillsList({ max = 4, value = [], onChange }) {
  const { skills, loading, getNamesForIds } = useSkills();
  if (loading) return <p>Loading...</p>;

  const skillsIds = skills.map((skill) => skill.id);
  const skillNames = getNamesForIds(skillsIds);

  return (
    <div className="flex gap-2 flex-wrap">
      <SkillList names={skillNames} max={max} value={value} onChange={onChange} clickable={true} />
    </div>
  );
}
