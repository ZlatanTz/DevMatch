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

export const applyToJob = async (jobId, user, formData) => {
  const submitData = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    year_of_birth: formData.birthYear,
    phone: formData.phone,
    location: formData.location,
    years_experience: formData.experience,
    seniority_level: formData.seniority,
    skills: formData.skills,
    cover_letter: formData.coverLetter || "",
    candidate_id: user.id,
  };

  try {
    const response = await api.post(
      `/jobs/${jobId}/apply/`,
      submitData,
      { headers: { Authorization: `Bearer ${user.token}` } }, // OAuth2 token
    );
    return response.data;
  } catch (error) {
    console.error("Error applying:", error.response?.data || error.message);
    throw error;
  }
};
