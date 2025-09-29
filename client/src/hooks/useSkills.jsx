import { createContext, useContext } from "react";

export const SkillsContext = createContext({
  skills: [],
  loading: true,
  getNamesForIds: () => [],
  getIdsForNames: () => [], // dodaj ovdje
});

export function useSkills() {
  return useContext(SkillsContext);
}

// Helper hook da iskoristi context
export function useAllSkillsList() {
  const { skills, loading } = useSkills();
  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {skills.map((s) => (
        <li key={s.id}>{s.name}</li>
      ))}
    </ul>
  );
}
