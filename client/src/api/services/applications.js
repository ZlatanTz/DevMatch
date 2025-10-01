import api from "../api";

export const getAllCandidateApplications = async (candidate_id, params = {}) => {
  try {
    const response = await api.get(`/candidates/${candidate_id}/applications`, {
      params: {
        page: 1,
        page_size: 15,
        sort_by: "created_at",
        sort_dir: "desc",
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const applyToJob = async (jobId, formData) => {
  const submitData = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    year_of_birth: formData.birthYear,
    phone: formData.phone,
    location: formData.location,
    years_experience: formData.experience,
    seniority_level: formData.seniority,
    skills: formData.skills.map((skill) => skill.name || skill),
    cover_letter: formData.coverLetter || "",
    cv_path: formData.cv_path || "",
  };

  try {
    const response = await api.post(`/jobs/${jobId}/apply/`, submitData);
    return response.data;
  } catch (error) {
    console.error("Error applying:", error.response?.data || error.message);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await api.put(`/applications/${applicationId}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};
