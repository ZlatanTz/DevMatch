import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadFileService = async (file) => {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const isPdf = file?.type === "application/pdf";
  const endpoint = isPdf
    ? `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`
    : `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  const { data } = await axios.post(endpoint, form);
  return data.secure_url;
};
