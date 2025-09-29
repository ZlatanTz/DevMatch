const getFileName = (input) => {
  if (!input) return "";
  if (typeof input === "string") return input;
  if (Array.isArray(input) && input[0]?.name) return input[0].name;
  if (input?.length && input[0]?.name) return input[0].name;
  if (input?.name) return input.name;
  return "";
};

const pickOptionValue = (val) => {
  if (!val) return undefined;
  if (typeof val === "string") return val;
  if (typeof val === "object" && "value" in val) return val.value;
  return val;
};

const normalizePrefersRemote = (val) => {
  const v = typeof val === "object" && val !== null && "value" in val ? val.value : val;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.toLowerCase();
    if (["true", "yes", "1"].includes(s)) return true;
    if (["false", "no", "0"].includes(s)) return false;
  }
  return undefined;
};

const normalizeSkills = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => (typeof x === "object" && x !== null && "value" in x ? x.value : x));
};

const stripUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export const transformCandidateFormToPayload = (form) => {
  const prefersRemote = normalizePrefersRemote(
    form?.prefers_remote ?? form?.preferRemote ?? form?.prefersRemote,
  );

  const candidate = stripUndefined({
    first_name: form.firstName,
    last_name: form.lastName,
    location: form.location,
    years_exp: Number(form.years_experiance ?? form.years_experience ?? 0),
    bio: form.bio ?? "",
    resume_url: getFileName(form.resume), // wull be changed with url from bucket server
    desired_salary:
      typeof form.desired_salary === "number"
        ? form.desired_salary
        : Number(form.desired_salary ?? 0),
    country: form.country,
    tel: form.phone,
    prefers_remote: prefersRemote,
    seniority: pickOptionValue(form.seniority),
    skills: normalizeSkills(form.skills),
  });

  return {
    email: form.email,
    password: form.password,
    candidate,
  };
};
