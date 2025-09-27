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
