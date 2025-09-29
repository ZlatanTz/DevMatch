import api from "../api";
import { transformUserMe } from "../../transformers/currentUserTransformer";
import { camelToSnake } from "@/utils/caseConverter";

const ME_BASE = "/me";

const RESET_PASSWORD = `${ME_BASE}/reset_password`;
const CHANGE_ACTIVE = `${ME_BASE}/active`;
const EMPLOYER_LOGO = `${ME_BASE}/employer/logo`;
const CANDIDATE_FILES = `${ME_BASE}/candidate/files`;

export const fetchCurrentUser = async () => {
  try {
    const { data } = await api.get(ME_BASE);
    return transformUserMe(data);
  } catch (error) {
    if (error.response) {
      const serverMsg = error.response.data?.detail || error.response.data?.message;
      throw new Error(
        serverMsg || `Fetching current user failed with status ${error.response.status}`,
      );
    }
    if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    }
    throw new Error(error.message || "Unexpected error occurred while fetching current user.");
  }
};

export const updateEmployerLogo = async (data) => {
  try {
    const res = await api.put(EMPLOYER_LOGO, data);
    return res.data;
  } catch (error) {
    console.error("Error updating employer logo:", error);
    throw error.response?.data || error;
  }
};

export const updateCandidateFiles = async (data) => {
  try {
    const res = await api.put(CANDIDATE_FILES, data);
    return res.data;
  } catch (error) {
    console.error("Error updating candidate files:", error);
    throw error.response?.data || error;
  }
};

export const updateMe = async ({ candidateData, employerData }) => {
  const payload = {};

  if (candidateData) payload.candidate_data = camelToSnake(candidateData);
  if (employerData) payload.employer_data = camelToSnake(employerData);

  try {
    const { data } = await api.put(ME_BASE, payload); // JSON payload
    return data;
  } catch (error) {
    if (error.response) {
      const serverMsg = error.response.data?.detail || error.response.data?.message;
      throw new Error(
        serverMsg || `Updating current user failed with status ${error.response.status}`,
      );
    }
    if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    }
    throw new Error(error.message || "Unexpected error occurred while updating current user.");
  }
};
