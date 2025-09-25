import { useLoaderData } from "react-router-dom";
import { useSkills } from "../hooks/useSkills";
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
  const { getNamesForIds } = useSkills();
  const [skills, setSkills] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useLoaderData();

  const schema =
    user.role === "Candidate" ? candidateRegistrationSchema : employerRegistrationSchema;

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/skills/");
        setSkills(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  useEffect(() => {
    setSkillOptions(
      skills.map((skill) => ({
        value: skill.id,
        label: skill.name,
      })),
    );
  }, [skills]);

  const defaultSkillIds = (user.skills || []).map((s) => s.id);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      location: user.location || "",
      country: user.country || "",
      years_exp: user.years_exp || 0,
      bio: user.bio || "",
      resume_url: user.resume_url || "",
      desired_salary: user.desired_salary || "",
      skills: defaultSkillIds,
      img: user.img || "",
      company_name: user.company_name || "",
      website: user.website || "",
      about: user.about || "",
      tel: user.tel || "",
      email: user.email,
    },
  });

  const [imgPreview, setImgPreview] = useState(user.img || "");

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) setImgPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const role = user.role.toLowerCase(); // "candidate" or "employer"
    const id = user.user_id;
    console.log("Form data:", data);

    const url =
      role === "candidate"
        ? `http://127.0.0.1:8000/candidates/${id}`
        : `http://127.0.0.1:8000/employers/${id}`;

    const payload =
      role === "employer"
        ? {
            company_name: data.company_name,
            website: data.website,
            about: data.about,
            location: data.location,
            country: data.country,
            tel: data.tel,
            email: data.email,
          }
        : data;

    try {
      const res = await axios.put(url, payload);
      console.log("Updated profile:", res.data);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  const debugSubmit = (data) => {
    console.log("handleSubmit called!", data);
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <div>
        <label className="block font-medium">Profile Image</label>
        <input
          type="file"
          {...register("img")}
          onChange={handleImgChange}
          className="w-full border rounded-lg p-2"
        />
        {imgPreview && (
          <img
            src={imgPreview}
            alt="Profile Preview"
            className="w-32 h-32 object-cover rounded-lg mt-2"
          />
        )}
      </div>

      <form onSubmit={handleSubmit(debugSubmit)} className="space-y-4 mt-4">
        {user.role === "Candidate" ? (
          <>
            <div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                {...register("first_name")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                {...register("last_name")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input type="email" {...register("email")} className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block font-medium">Location</label>
              <input
                type="text"
                {...register("location")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Years of Experience</label>
              <input
                type="number"
                {...register("years_exp")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Bio</label>
              <textarea {...register("bio")} rows="4" className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block font-medium">Resume URL</label>
              <input
                type="url"
                {...register("resume_url")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  isMulti
                  options={skillOptions}
                  classNamePrefix="react-select"
                  value={skillOptions.filter((opt) => field.value.includes(opt.value))}
                  onChange={(selected) => {
                    const ids = selected.map((opt) =>
                      typeof opt.value === "number" ? opt.value : opt.tempId,
                    );
                    field.onChange(ids);
                  }}
                  onCreateOption={(inputValue) => {
                    const newOption = {
                      value: inputValue,
                      label: inputValue,
                      tempId: Date.now() * -1,
                    };
                    setSkillOptions([...skillOptions, newOption]);
                    field.onChange([...field.value, newOption.tempId]);
                  }}
                />
              )}
            />
          </>
        ) : (
          <>
            <div>
              <label className="block font-medium">Company Name</label>
              <input
                type="text"
                {...register("company_name")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Website</label>
              <input type="url" {...register("website")} className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block font-medium">About</label>
              <textarea {...register("about")} rows="4" className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block font-medium">Location</label>
              <input
                type="text"
                {...register("location")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Country</label>
              <input
                type="text"
                {...register("country")}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input type="email" {...register("email")} className="w-full border rounded-lg p-2" />
            </div>

            <div>
              <label className="block font-medium">Telephone</label>
              <input type="tel" {...register("tel")} className="w-full border rounded-lg p-2" />
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
