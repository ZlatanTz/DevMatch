import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateMe } from "@/api/services/me";
import { transformUserMe } from "@/transformers/currentUserTransformer";
import AllSkillsList from "@/components/AllSkillsList";
import { useSkills } from "@/hooks/useSkills";
import { uploadFileService } from "@/api/services/uploadFiles";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { skills, getNamesForIds, getIdsForNames } = useSkills();
  const navigate = useNavigate();

  if (!user) return <div>Loading ... </div>;

  const initialSelected = user?.candidate?.skills.map((skill) => skill.id) || []; //ids
  const [selectedSkills, setSelectedSkills] = useState(initialSelected); // ids
  const [selectedSkillsNames, setSelectedSkillsNames] = useState(getNamesForIds(selectedSkills)); //names
  const [imgUploaded, setImgUploaded] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [candidateData, setCandidateData] = useState({
    firstName: user?.candidate?.firstName || "",
    lastName: user?.candidate?.lastName || "",
    location: user?.candidate?.location || "",
    country: user?.candidate?.country || "",
    tel: user?.candidate?.tel || "",
    bio: user?.candidate?.bio || "",
    resumeUrl: user?.candidate?.resumeUrl || "",
    imgPath: user?.candidate?.imgPath || "",
    yearsExp: user?.candidate?.yearsExp || 0,
    desiredSalary: user?.candidate?.desiredSalary || 0,
    prefersRemote: user?.candidate?.prefersRemote || null,
    seniority: user?.candidate?.seniority || null,
    skills: initialSelected || [],
  });

  const [employerData, setEmployerData] = useState({
    companyName: user?.employer?.companyName || "",
    website: user?.employer?.website || "",
    location: user?.employer?.location || "",
    country: user?.employer?.country || "",
    tel: user?.employer?.tel || "",
    about: user?.employer?.about || "",
    companyLogo: user?.employer?.companyLogo || "",
  });

  const cvInputRef = useRef(null);
  const candidateImgInputRef = useRef(null);
  const companyLogoInputRef = useRef(null);

  const handleCandidateChange = (e) => {
    setCandidateData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmployerChange = (e) => {
    setEmployerData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCandidateFileChange = async (e) => {
    const file = e.target.files[0];

    setFileUploaded(false);
    setUploadingFile(true);

    try {
      const fileUrl = await uploadFileService(file);
      setCandidateData((prev) => ({ ...prev, resumeUrl: fileUrl }));
      setFileUploaded(true);
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCandidateImgChange = async (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large. Maximum allowed size is 10 MB.");
      return;
    }

    setImgUploaded(false);
    setUploadingImg(true);

    try {
      const fileUrl = await uploadFileService(file);
      setCandidateData((prev) => ({ ...prev, imgPath: fileUrl }));
      setImgUploaded(true);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleEmployerImgChange = async (e) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File is too large. Maximum allowed size is 10 MB.");
      return;
    }

    setImgUploaded(false);
    setUploadingImg(true);

    try {
      const fileUrl = await uploadFileService(file);
      setEmployerData((prev) => ({ ...prev, companyLogo: fileUrl }));
      setImgUploaded(true);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizeSkills = (allSelected, allSkills) => {
      const ids = allSelected
        .map((item) => {
          if (typeof item === "number") return item;
          const skill = allSkills.find((s) => s.name === item);
          return skill ? skill.id : null;
        })
        .filter(Boolean);

      return [...new Set(ids)];
    };

    try {
      let updatedUserSnake;
      if (user?.candidate) {
        const normalizedSkills = normalizeSkills(selectedSkills, skills);
        const finalCandidateData = {
          ...candidateData,
          skills: normalizedSkills,
        };

        updatedUserSnake = await updateMe({ candidateData: finalCandidateData });
      } else {
        updatedUserSnake = await updateMe({ employerData });
      }
      const updatedUserCamel = transformUserMe(updatedUserSnake);
      updateUser(updatedUserCamel);

      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="w-[90%] md:w-[70%] mx-auto my-[50px] p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl md:text-3xl mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {user?.candidate ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={candidateData.firstName}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={candidateData.lastName}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="tel" className="block text-sm font-medium text-federal-blue mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="tel"
                  name="tel"
                  placeholder="+381 63 123456"
                  value={candidateData.tel}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Location"
                  value={candidateData.location}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={candidateData.country}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="yearsExp"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Job experience (years) <span className="text-emerald">*</span>
                </label>
                <input
                  type="number"
                  id="yearsExp"
                  name="yearsExp"
                  min="0"
                  placeholder="Job experience (years)"
                  value={candidateData.yearsExp}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="desiredSalary"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Desired Salary
                </label>
                <input
                  type="number"
                  id="desiredSalary"
                  name="desiredSalary"
                  placeholder="Desired Salary"
                  value={candidateData.desiredSalary}
                  onChange={handleCandidateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Level
                </label>
                <select
                  name="seniority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                  value={candidateData.seniority}
                  onChange={handleCandidateChange}
                >
                  <option value={null}>Seniority</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Medior">Medior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-federal-blue mb-1">
                Skill
              </label>
              <AllSkillsList
                max={5}
                value={selectedSkillsNames}
                onChange={(newSelected) => {
                  setSelectedSkillsNames(newSelected);
                  const ids = getIdsForNames(newSelected);
                  setSelectedSkills(ids);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="cv" className="block text-sm font-medium text-federal-blue mb-1">
                  Upload CV (PDF) <span className="text-emerald">*</span>
                </label>
                <input
                  ref={cvInputRef}
                  type="file"
                  id="cv"
                  name="cv"
                  accept=".pdf"
                  onChange={handleCandidateFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/80"
                />
                {fileUploaded && <p className="mt-2 text-sm text-green-600">Uploaded CV</p>}
                <button
                  type="button"
                  onClick={() => {
                    setCandidateData((prev) => ({ ...prev, resumeUrl: "" }));
                    if (cvInputRef.current) cvInputRef.current.value = "";
                    setFileUploaded(false);
                  }}
                  className="absolute mt-1 top-7 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              {/* Profile Picture Input */}
              <div className="relative">
                <label
                  htmlFor="imgPath"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Upload Profile Picture
                </label>
                <input
                  ref={candidateImgInputRef}
                  type="file"
                  id="imgPath"
                  name="imgPath"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleCandidateImgChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/80"
                />
                {imgUploaded && (
                  <p className="mt-2 text-sm text-green-600">Uploaded Profile Picture</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCandidateData((prev) => ({ ...prev, imgPath: "" }));
                    if (candidateImgInputRef.current) candidateImgInputRef.current.value = "";
                    setImgUploaded(false);
                  }}
                  className="absolute mt-1 top-7 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-federal-blue mb-1">
                About you
              </label>
              <textarea
                id="bio"
                name="bio"
                placeholder="About you"
                value={candidateData.bio}
                onChange={handleCandidateChange}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="companyName" className=" text-sm font-medium text-federal-blue mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={employerData.companyName}
                onChange={handleEmployerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label htmlFor="website" className=" text-sm font-medium text-federal-blue mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                placeholder="Website"
                value={employerData.website}
                onChange={handleEmployerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label htmlFor="location" className=" text-sm font-medium text-federal-blue mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={employerData.location}
                onChange={handleEmployerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>
            <div>
              <label htmlFor="country" className=" text-sm font-medium text-federal-blue mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={employerData.country}
                onChange={handleEmployerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>
            <div>
              <label htmlFor="tel" className=" text-sm font-medium text-federal-blue mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="tel"
                placeholder="Phone"
                value={employerData.tel}
                onChange={handleEmployerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>

            <div className="relative mt-4">
              <label htmlFor="companyLogo" className="text-sm font-medium text-federal-blue mb-1">
                Upload Company Logo
              </label>
              <input
                ref={companyLogoInputRef}
                type="file"
                name="companyLogo"
                onChange={handleEmployerImgChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/80"
              />
              {employerData.companyLogo && (
                <p className="mt-2 text-sm text-green-600">Uploaded Company Logo</p>
              )}
              <button
                type="button"
                onClick={() => {
                  setEmployerData((prev) => ({ ...prev, companyLogo: "" }));
                  if (employerImgInputRef.current) employerImgInputRef.current.value = "";
                  setImgUploaded(false);
                }}
                className="absolute top-7 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
              >
                Delete
              </button>
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-federal-blue mb-1">
                About
              </label>
              <textarea
                name="about"
                placeholder="About"
                value={employerData.about}
                onChange={handleEmployerChange}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={uploadingFile || uploadingImg}
          className="bg-emerald text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
