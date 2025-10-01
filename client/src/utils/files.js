import { uploadFileService } from "@/api/services/uploadFiles";
import { updateEmployerLogo, updateCandidateFiles } from "@/api/services/me";

export const getFirstFile = (val) => {
  if (!val) return null;
  if (val instanceof File) return val;
  if (Array.isArray(val)) return val[0] || null;
  return val?.[0] || null;
};

export const stripTrailingSlash = (url) =>
  typeof url === "string" && url.endsWith("/") ? url.slice(0, -1) : url;

export const handleFileUploads = async (role, formData) => {
  const uploadedFiles = {};

  if (role === "employer") {
    const logoFile = getFirstFile(formData.companyLogo);
    if (logoFile) {
      const logoUrl = await uploadFileService(logoFile);
      uploadedFiles.companyLogo = logoUrl;
      await updateEmployerLogo({ company_logo: logoUrl });
    }
  }

  if (role === "candidate") {
    const imgFile = getFirstFile(formData.imgPath);
    const resumeFile = getFirstFile(formData.resumeUrl);

    if (imgFile) {
      const imgUrl = await uploadFileService(imgFile);
      uploadedFiles.imgPath = imgUrl;
    }
    if (resumeFile) {
      const resumeUrl = await uploadFileService(resumeFile);
      uploadedFiles.resumeUrl = resumeUrl;
    }

    if (uploadedFiles.imgPath || uploadedFiles.resumeUrl) {
      await updateCandidateFiles({
        ...(uploadedFiles.imgPath && { img_path: uploadedFiles.imgPath }),
        ...(uploadedFiles.resumeUrl && { resume_url: uploadedFiles.resumeUrl }),
      });
    }
  }

  return uploadedFiles;
};
