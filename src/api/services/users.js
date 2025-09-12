import api from "../api";

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users.json");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
