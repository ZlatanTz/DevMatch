import api from "../api";
import { transformUserMe } from "../../transformers/currentUserTransformer";

const ME_BASE = "/me";

const RESET_PASSWORD = `${ME_BASE}/reset_password`;
const CHANGE_ACTIVE = `${ME_BASE}/active`;

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
