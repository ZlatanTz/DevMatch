import api from "../api";

export const getAllJobs = async () => {
  try {
    const response = await api.get("/jobs.json");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getHighestRatedJobs = async () => {
  try {
    const response = await api.get("/top_paid_jobs.json");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
