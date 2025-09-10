import { useState } from "react";
import { useLoaderData, Form, Link } from "react-router-dom";

function EditProfile() {
  const profile = useLoaderData();
  const [role, setRole] = useState("company");

  const company = {
    id: 1,
    user_id: 2,
    company_name: "TechNova",
    website: "https://technova.dev",
    about:
      "Innovative SaaS company focused on cloud solutions.Innovative SaaS company focused on cloud solutions.Innovative SaaS company focused on cloud solutions.Innovative SaaS company focused on cloud solutions.Innovative SaaS company focused on cloud solutions.Innovative SaaS company focused on cloud solutions.",
    location: "Belgrade",
    verified: true,
    country: "Serbia",
    email: "company@company.com",
    tel: "+382 566 125 22",
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {role === "candidate" ? (
        <Form method="post" className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              defaultValue={profile.full_name}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={profile.email}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={profile.location}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Years of Experience</label>
            <input
              type="number"
              name="years_exp"
              defaultValue={profile.years_exp}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Bio</label>
            <textarea
              name="bio"
              defaultValue={profile.bio}
              rows="4"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Resume URL</label>
            <input
              type="url"
              name="resume_url"
              defaultValue={profile.resume_url}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Programming Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. JavaScript, Python, React"
              defaultValue={profile.skills ? profile.skills.join(", ") : ""}
              className="w-full border rounded-lg p-2"
            />
            <small className="text-gray-500">Separate skills with commas</small>
          </div>
          <div className="w-full flex justify-center">
            <Link to={`/profile`}>
              <button
                type="submit"
                className="bg-emerald cursor-pointer text-white px-4 py-2 rounded-lg "
              >
                Save Changes
              </button>
            </Link>
          </div>
        </Form>
      ) : (
        <Form method="post" className="space-y-4">
          <div>
            <label className="block font-medium">Company Name</label>
            <input
              type="text"
              name="company_name"
              defaultValue={company.company_name}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Website</label>
            <input
              type="url"
              name="website"
              defaultValue={company.website}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">About</label>
            <textarea
              name="about"
              defaultValue={company.about}
              rows="4"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={company.location}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Country</label>
            <input
              type="text"
              name="country"
              defaultValue={company.country}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={company.email}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Telephone</label>
            <input
              type="tel"
              name="tel"
              defaultValue={company.tel}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="w-full flex justify-center">
            <Link to={`/profile`}>
              <button
                type="submit"
                className="bg-emerald cursor-pointer text-white px-4 py-2 rounded-lg "
              >
                Save Changes
              </button>
            </Link>
          </div>
        </Form>
      )}
    </div>
  );
}

export default EditProfile;
