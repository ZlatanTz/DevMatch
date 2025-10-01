import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadFileService = async (file) => {
  if (!file) throw new Error("No file provided");

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const isPdf = file.type === "application/pdf";
  const endpoint = isPdf
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
    : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    const { data } = await axios.post(endpoint, form);
    console.log("Upload data:", data);

    const secureUrl = data.secure_url.startsWith("http://")
      ? data.secure_url.replace(/^http:/, "https:")
      : data.secure_url;

    return secureUrl;
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    throw err;
  }
};
