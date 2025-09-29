import api from "../api";
import { transformAdminJobs, transformAdminUsers } from "@/transformers/adminTransformer";

const ADMIN_BASE = "/admin";
const ADMIN_SUSPEND_USER = (id) => `${ADMIN_BASE}/suspend/${id}`;
const ADMIN_ALL_USERS = `${ADMIN_BASE}/all-users`;
const ADMIN_ALL_JOBS = `${ADMIN_BASE}/all-jobs`;

const handleAxiosError = (error, fallbackMsg) => {
  if (error?.response) {
    const serverMsg = error.response.data?.detail || error.response.data?.message;
    throw new Error(serverMsg || `${fallbackMsg} (status ${error.response.status})`);
  }
  if (error?.request) {
    throw new Error(`${fallbackMsg}: no response from server`);
  }
  throw new Error(error?.message || fallbackMsg);
};

export const suspendUser = async (userId, isSuspended) => {
  const payload = { is_suspended: Boolean(isSuspended) };
  try {
    const response = await api.put(ADMIN_SUSPEND_USER(userId), payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to update suspension status");
  }
};

export const getAllUsersAdmin = async () => {
  try {
    const response = await api.get(ADMIN_ALL_USERS);
    return transformAdminUsers(response.data);
  } catch (error) {
    handleAxiosError(error, "Failed to fetch users");
  }
};

export const getAllJobsAdmin = async () => {
  try {
    const response = await api.get(ADMIN_ALL_JOBS);
    return transformAdminJobs(response.data);
  } catch (error) {
    handleAxiosError(error, "Failed to fetch jobs");
  }
};
