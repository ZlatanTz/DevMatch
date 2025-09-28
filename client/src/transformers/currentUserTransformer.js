const transformRole = (role) =>
  role
    ? {
        id: role.id,
        name: role.name,
      }
    : null;

const transformCandidate = (c) =>
  c
    ? {
        id: c.id,
        userId: c.user_id,
        firstName: c.first_name,
        lastName: c.last_name,
        location: c.location,
        yearsExp: c.years_exp,
        bio: c.bio,
        resumeUrl: c.resume_url,
        desiredSalary: c.desired_salary,
        country: c.country,
        tel: c.tel,
        imgPath: c.img_path,
        prefersRemote: c.prefers_remote,
        seniority: c.seniority,
        skills: c.skills?.map((s) => ({ id: s.id, name: s.name })) || [],
      }
    : null;

const transformEmployer = (e) =>
  e
    ? {
        id: e.id,
        userId: e.user_id,
        companyName: e.company_name,
        website: e.website,
        about: e.about,
        location: e.location,
        country: e.country,
        tel: e.tel,
        companyLogo: e.company_logo,
      }
    : null;

export const transformUserMe = (data) => {
  if (!data) return null;

  const basicUserInfo = {
    id: data.id,
    email: data.email,
    isActive: data.is_active,
    isSuspended: data.is_suspended,
    isVerified: data.is_verified,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    role: transformRole(data.role),
  };

  let candidate = null;
  let employer = null;

  if (data.role?.name === "candidate") {
    candidate = transformCandidate(data.candidate);
  } else if (data.role?.name === "employer") {
    employer = transformEmployer(data.employer);
  }

  return {
    basicUserInfo,
    candidate,
    employer,
  };
};
