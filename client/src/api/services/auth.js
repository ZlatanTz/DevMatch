import api from "../api";
import { transformCandidateFormToPayload } from "../../transformers/candidateTransformer";
import { transformEmployerFormToPayload } from "../../transformers/employerTransformer";

const AUTH_BASE = "/auth";

const LOGIN = `${AUTH_BASE}/login`;
const REGISTER_CANDIDATE = `${AUTH_BASE}/register-candidate`;
const REGISTER_EMPLOYER = `${AUTH_BASE}/register-employer`;

export const loginService = async ({ email, password }) => {
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const { data } = await api.post(LOGIN, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return data;
  } catch (err) {
    if (err.response?.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    throw new Error("Unexpected error, please try again later");
  }
};

export async function registerCandidate(formData) {
  const payload = transformCandidateFormToPayload(formData);

  try {
    const response = await api.post(REGISTER_CANDIDATE, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      const serverMsg = error.response.data?.detail || error.response.data?.message;
      throw new Error(serverMsg || `Registration failed with status ${error.response.status}`);
    }
    if (error.request) {
      throw new Error("Error occured");
    }
    throw new Error(error.message || "Unexpected error occurred during registration.");
  }
}

export async function registerEmployer(formData) {
  const payload = transformEmployerFormToPayload(formData);
  try {
    const response = await api.post(REGISTER_EMPLOYER, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      const backendMsg = error.response.data?.detail || error.response.data?.message;
      throw new Error(
        backendMsg || `Employer registration failed with status ${error.response.status}`,
      );
    }
    if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    }
    throw new Error(error.message || "Unexpected error occurred during employer registration.");
  }
}
