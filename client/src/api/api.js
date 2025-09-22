import axios from "axios";

const api = axios.create({
  baseURL: "/mock/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
