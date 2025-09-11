export function readParams(sp) {
  return {
    q: (sp.get("q") || "").trim().toLowerCase(),
    loc: sp.get("loc") || "",
    sen: sp.get("seniority") || "",
    ski: sp.getAll("skills").map((s) => s.toLowerCase()),
    sort: sp.get("sort") || "date-desc",
  };
}

export function filterAndSort(jobs, p) {
  const filtered = jobs.filter((j) => {
    const text = `${j.title} ${j.company}  || ""}`.toLowerCase();
    if (p.q && !text.includes(p.q)) return false;

    const locStr = String(j.location || "");
    if (p.loc === "loc-remote" && !/remote/i.test(locStr)) return false;
    if (p.loc === "loc-onsite" && /remote/i.test(locStr)) return false;

    const s = String(j.seniority || j.level || "").toLowerCase();
    if (p.sen && s !== p.sen) return false;

    const jobSkillIds = (j.skills || []).map((x) => String(x));
    if (p.ski.length && !p.ski.every((sk) => jobSkillIds.includes(String(sk)))) return false;

    return true;
  });

  const byDate = (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0);
  const bySalary = (a, b) => {
    const sa = a.max_salary ?? a.min_salary ?? 0;
    const sb = b.max_salary ?? b.min_salary ?? 0;
    return sa - sb;
  };

  switch (p.sort) {
    case "date-asc":
      return filtered.sort((a, b) => byDate(a, b));
    case "date-desc":
      return filtered.sort((a, b) => -byDate(a, b));
    case "salary-asc":
      return filtered.sort((a, b) => bySalary(a, b));
    case "salary-desc":
      return filtered.sort((a, b) => -bySalary(a, b));
    default:
      return filtered;
  }
}
