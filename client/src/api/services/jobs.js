import api from "../api";

export const getAllJobs = async () => {
  try {
    const res = await api.get("/jobs");
    return { data: res.data, isSuccess: true, errorStatus: null };
  } catch (err) {
    return {
      data: [],
      isSuccess: false,
      errorStatus: err.response?.status || 500,
    };
  }
};

export const getHighestRatedJobs = async () => {
  try {
    const res = await api.get("/jobs/highest-rated");
    return { data: res.data, isSuccess: true, errorStatus: null };
  } catch (err) {
    return {
      data: [],
      isSuccess: false,
      errorStatus: err.response?.status || 500,
    };
  }
};
