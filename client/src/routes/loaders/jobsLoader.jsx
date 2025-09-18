import axios from "axios";

export async function jobsLoader() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const res = await axios.get(`${apiUrl}jobs`);
    return res.data;
  } catch (err) {
    throw new Response(err.message, { status: err.response?.status || 500 });
  }
}
