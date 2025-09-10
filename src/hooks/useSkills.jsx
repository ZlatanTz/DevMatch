import { createContext, useContext } from "react";
export const SkillsContext = createContext({
  skills: [],
  loading: true,
  getNamesForIds: () => [],
});

export function useSkills() {
  return useContext(SkillsContext);
}
