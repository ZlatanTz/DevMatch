import { useState, useEffect } from "react";
import { Form, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSkills } from "../hooks/useSkills";

function EditProfile() {
  const { user, login, logout } = useAuth();
  const { getNamesForIds } = useSkills();
  const [finalUser, setFinalUser] = useState(null);

  const fetchEmployer = async () => {
    const res = await fetch("/mock/employer_profiles.json");
    if (!res.ok) throw new Error("Failed to load employer data");
    return res.json();
  };

  const fetchCandidate = async () => {
    const res = await fetch("/mock/candidate_profiles.json");
    if (!res.ok) throw new Error("Failed to load candidate data");
    return res.json();
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const [employers, candidates] = await Promise.all([fetchEmployer(), fetchCandidate()]);

        const foundEmployer = employers.find((el) => el.email === user?.email);
        if (foundEmployer) {
          setFinalUser({ ...foundEmployer, role: "employer" });
          return;
        }

        const foundCandidate = candidates.find((el) => el.email === user?.email);
        if (foundCandidate) {
          setFinalUser({ ...foundCandidate, role: "candidate" });
          return;
        }
        console.log(user);
        if (user.role === "candidate") {
          setFinalUser({
            ...user,
            resume_url: user.resume.name,
            full_name: user.firstName + user.lastName,
            tel: user.phone,
            years_exp: user.years_experiance,
            id: 1255,
          });
        } else {
          setFinalUser({ ...user, company_name: user.companyName, tel: user.phone, id: 1255 });
        }

        return;
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    if (user?.email) {
      getUser();
    }
  }, [user]);

  if (!finalUser) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {finalUser.role === "candidate" ? (
        <Form method="post" className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              defaultValue={finalUser.full_name}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={finalUser.email}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={finalUser.location}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Years of Experience</label>
            <input
              type="number"
              name="years_exp"
              defaultValue={finalUser.years_exp}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Bio</label>
            <textarea
              name="bio"
              defaultValue={finalUser.bio}
              rows="4"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Resume URL</label>
            <input
              type="url"
              name="resume_url"
              defaultValue={finalUser.resume_url}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Programming Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. JavaScript, Python, React"
              defaultValue={
                getNamesForIds(finalUser.skills) ? getNamesForIds(finalUser.skills).join(", ") : ""
              }
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
              defaultValue={finalUser.company_name}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Website</label>
            <input
              type="url"
              name="website"
              defaultValue={finalUser.website}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">About</label>
            <textarea
              name="about"
              defaultValue={finalUser.about}
              rows="4"
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              defaultValue={finalUser.location}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Country</label>
            <input
              type="text"
              name="country"
              defaultValue={finalUser.country}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={finalUser.email}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium">Telephone</label>
            <input
              type="tel"
              name="tel"
              defaultValue={finalUser.tel}
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
