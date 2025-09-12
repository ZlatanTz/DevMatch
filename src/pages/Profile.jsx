import { Link } from "react-router-dom";
import profileImg from "../assets/profileImage.jpeg";
import { Phone, Mail, MapPin, MoveRight, File, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSkills } from "../hooks/useSkills";
import SkillList from "@/components/SkillList";

const Profile = () => {
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

        if (user.role === "candidate") {
          setFinalUser({
            ...user,
            resume_url: user.resume.name,
            full_name: user.firstName + " " + user.lastName,
            tel: user.phone,
            id: 123,
          });
        } else {
          setFinalUser({ ...user, company_name: user.companyName, tel: user.phone, id: 123 });
        }
        console.log(user);

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
    <div className="w-[90%] md:w-[80%] min-h-[700px] bg-white rounded-lg shadow-md hover:shadow-lg transition mx-auto my-[80px] p-5 md:p-10 md:px-[70px]">
      {finalUser.role === "candidate" ? (
        <>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start w-full gap-6">
            <div className="flex justify-center md:justify-start md:flex-[30%]">
              <img
                src={profileImg}
                alt="Profile"
                className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
              />
            </div>

            <div className="md:flex-[70%] text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-roboto">{finalUser.full_name}</h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <MapPin />
                  <h2>
                    {finalUser.location}, {finalUser.country}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Mail />
                  <h2>{finalUser.email}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <h2>{finalUser.tel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <File /> {finalUser.resume_url}
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{finalUser.bio}</p>
          </div>

          <div className="w-full px-3 md:px-5">
            <h1 className="text-2xl md:text-3xl mb-1">Skills</h1>
            <SkillList names={getNamesForIds(finalUser.skills)} />
          </div>

          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={`edit/${finalUser.id}`}>
              <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer">
                Edit Profile
              </button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start w-full gap-6">
            <div className="flex justify-center md:justify-start md:flex-[30%]">
              <img
                src={profileImg}
                alt="Profile"
                className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
              />
            </div>

            <div className="md:flex-[70%] text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-roboto">{finalUser.company_name}</h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <MapPin />
                  <h2>
                    {finalUser.location}, {finalUser.country}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Mail />
                  <h2>{finalUser.email}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <h2>{finalUser.tel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Link2 /> {finalUser.website}
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{finalUser.about}</p>
          </div>

          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={`edit/${finalUser.id}`}>
              <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer">
                Edit Profile
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
