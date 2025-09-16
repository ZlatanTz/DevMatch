export const formatDate = (dt) => {
  if (!dt) return "—";
  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dt));
  } catch {
    return String(dt);
  }
};
