export const transformAdminUsers = (apiUsers = []) => {
  return apiUsers.map(transformAdminUser);
};

export const transformAdminUser = (u) => {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email,
    isActive: u.is_active,
    isSuspended: u.is_suspended,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    isVerified: u.is_verified,
    roleName: u.role?.name ?? null,
  };
};

export const transformAdminJobs = (apiJobs = []) => {
  return apiJobs.map(transformAdminJob);
};

export const transformAdminJob = (j) => {
  if (!j) return null;
  return {
    id: j.id,
    title: j.title,
    location: j.location,
    employmentType: j.employment_type,
    seniority: j.seniority,
    minSalary: j.min_salary,
    maxSalary: j.max_salary,
    isRemote: j.is_remote,
    status: j.status,
    description: j.description,
    companyDescription: j.company_description,
    employerId: j.employer_id,
    createdAt: j.created_at,
  };
};
