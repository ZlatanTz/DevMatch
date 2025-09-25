import axios from "axios";
import { useEffect, useState } from "react";
import { SkillsContext } from "../hooks/useSkills";

export function SkillsProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [byId, setById] = useState({});

  useEffect(() => {
    async function load() {
      try {
        // const url = `${import.meta.env.BASE_URL}mock/skills.json`;
        const url = `${import.meta.env.VITE_API_BASE_URL}/skills`;
        const res = await axios.get(url);
        const data = res.data;
        const safe = Array.isArray(data) ? data : [];
        setSkills(safe);

        // build { [id]: name }
        const dict = {};
        for (const s of safe) {
          dict[s.id] = s.name;
        }
        setById(dict);
      } catch (err) {
        console.warn("fetching skills failed", err.message);
        setSkills([]);
        setById({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  const getNamesForIds = (ids = []) => ids.map((id) => byId[id]).filter(Boolean);

  return (
    <SkillsContext.Provider value={{ skills, loading, getNamesForIds }}>
      {children}
    </SkillsContext.Provider>
  );
}
