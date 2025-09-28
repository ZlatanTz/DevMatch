import api from "../api";

export const getAllJobs = async (params = {}) => {
  try {
    const response = await api.get("/jobs/", {
      params: {
        page: 1,
        page_size: 18,
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

export const getAllJobsDetailed = async (params = {}) => {
  try {
    const response = await api.get("/jobs/detailed/", {
      params: {
        page: 1,
        page_size: 18,
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

export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getJobByIdDetailed = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}/detailed/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getHighestRatedJobs = async (params = {}) => {
  try {
    const response = await api.get("/jobs/", {
      params: {
        page: 1,
        page_size: 18,
        sort_by: "max_salary",
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

export async function getRecommendedJobsFiltered(candidateId, opts = {}) {
  if (candidateId == null) throw new Error("candidateId is required");

  const params = {
    min_score: opts.minScore ?? 0,
    limit: opts.limit ?? 20,

    sort_by: opts.sortBy ?? "recommended",
    sort_dir: opts.sortDir ?? "desc",
    page: opts.page ?? 1,
    page_size: opts.pageSize ?? 20,
  };

  const { data } = await api.get(
    `/candidates/${encodeURIComponent(candidateId)}/recommended-jobs`,
    {
      params,
    },
  );

  return data;
}
