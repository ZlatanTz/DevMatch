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
  if (role === "employer") {
    const logoFile = getFirstFile(formData.companyLogoPicture);
    if (logoFile) {
      const logoUrl = stripTrailingSlash(await uploadFileService(logoFile));
      await updateEmployerLogo({ company_logo: logoUrl });
    }
  }

  if (role === "candidate") {
    const imgFile = getFirstFile(formData.profilePhotoPicture);
    const resumeFile = getFirstFile(formData.resumeFile);

    let imgUrl = null;
    let resumeUrl = null;

    if (imgFile) {
      imgUrl = stripTrailingSlash(await uploadFileService(imgFile));
    }
    if (resumeFile) {
      resumeUrl = stripTrailingSlash(await uploadFileService(resumeFile));
    }

    if (imgUrl || resumeUrl) {
      await updateCandidateFiles({
        ...(imgUrl && { img_path: imgUrl }),
        ...(resumeUrl && { resume_url: resumeUrl }),
      });
    }
  }
};
