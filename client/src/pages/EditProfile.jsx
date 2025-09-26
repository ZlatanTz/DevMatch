import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreatableSelect from "react-select/creatable";
import {
  candidateRegistrationSchema,
  employerRegistrationSchema,
} from "@/schemas/registrationSchemas";

function EditProfile() {
  const user = useLoaderData();

  const [allSkills, setAllSkills] = useState([]); // full list from API
  const [skillOptions, setSkillOptions] = useState([]); // formatted for react-select
  const [selectedSkills, setSelectedSkills] = useState([]); // user’s chosen skill IDs

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/skills/");
        setAllSkills(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    const defaultSkillIds = (user.skills || []).map((s) => s.id);
    setSelectedSkills(defaultSkillIds);

    const mergedSkills = [...allSkills, ...(user.skills || [])];
    const uniqueSkills = Array.from(new Map(mergedSkills.map((s) => [s.id, s])).values());

    setSkillOptions(
      uniqueSkills.map((skill) => ({
        value: skill.id,
        label: skill.name,
      })),
    );
  }, [allSkills, user.skills]);

  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [location, setLocation] = useState(user.location || "");
  const [country, setCountry] = useState(user.country || "");
  const [yearsExp, setYearsExp] = useState(user.years_exp || 0);
  const [bio, setBio] = useState(user.bio || "");
  const [resumeUrl, setResumeUrl] = useState(user.resume_url || "");
  const [desiredSalary, setDesiredSalary] = useState(user.desired_salary || 0);
  const [img, setImg] = useState(user.img || "");
  const [companyName, setCompanyName] = useState(user.company_name || "");
  const [website, setWebsite] = useState(user.website || "");
  const [about, setAbout] = useState(user.about || "");
  const [tel, setTel] = useState(user.tel || "");
  const [email, setEmail] = useState(user.email || "");

  const navigate = useNavigate();

  const [imgPreview, setImgPreview] = useState(user.img || "");

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) setImgPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const role = user.role.toLowerCase();
    const id = user.user_id;

    const url =
      role === "candidate"
        ? `http://127.0.0.1:8000/candidates/${id}`
        : `http://127.0.0.1:8000/employers/${id}`;

    let payload;

    if (role === "employer") {
      payload = {
        company_name: companyName,
        website,
        about,
        location,
        country,
        tel,
        email,
      };
    } else {
      payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        location,
        years_exp: yearsExp,
        bio,
        resume_url: resumeUrl,
        desired_salary: desiredSalary,
        skills: selectedSkills,
      };
    }

    console.log("Submitting payload:", payload);

    try {
      const res = await axios.put(url, payload);
      console.log("Updated profile:", res.data);
      navigate(`/profile/${id}`);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <div>
        <label className="block font-medium">Profile Image</label>
        <input type="file" onChange={handleImgChange} className="w-full border rounded-lg p-2" />
        {imgPreview && (
          <img
            src={imgPreview}
            alt="Profile Preview"
            className="w-32 h-32 object-cover rounded-lg mt-2"
          />
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        {user.role === "Candidate" ? (
          <>
            <div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Years of Experience</label>
              <input
                type="number"
                value={yearsExp}
                onChange={(e) => setYearsExp(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Desired Salary</label>
              <input
                type="number"
                value={desiredSalary}
                onChange={(e) => setDesiredSalary(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Resume URL</label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Skills</label>
              <CreatableSelect
                isMulti
                options={skillOptions}
                classNamePrefix="react-select"
                value={skillOptions.filter((opt) => selectedSkills.includes(opt.value))}
                onChange={(selected) => {
                  const ids = selected.map((opt) =>
                    typeof opt.value === "number" ? opt.value : opt.tempId,
                  );
                  setSelectedSkills(ids);
                }}
                onCreateOption={(inputValue) => {
                  const newOption = {
                    value: Date.now() * -1,
                    label: inputValue,
                    tempId: Date.now() * -1,
                  };
                  setSkillOptions([...skillOptions, newOption]);
                  setSelectedSkills([...selectedSkills, newOption.value]);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block font-medium">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Telephone</label>
              <input
                type="tel"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </>
        )}

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="bg-emerald cursor-pointer text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
