import { createContext, useContext } from "react";
export const SkillsContext = createContext({
  skills: [],
  loading: true,
  getNamesForIds: () => [],
});

export function useSkills() {
  return useContext(SkillsContext);
}

export function useAllSkillsList() {
  const { skills, loading } = useSkills();
  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {skills.map((s) => (
        <li key={s.id}>{s.value}</li>
      ))}
    </ul>
  );
}
