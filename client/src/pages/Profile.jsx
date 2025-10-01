import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MoveRight, File, Link2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSkills } from "../hooks/useSkills";
import SkillList from "@/components/SkillList";

const Profile = () => {
  const { user } = useAuth();
  const { getNamesForIds } = useSkills();

  const skillIds = user?.candidate?.skills.map((skill) => skill.id);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="w-[90%] md:w-[80%] min-h-[700px] bg-white rounded-lg shadow-md hover:shadow-lg transition mx-auto my-[80px] p-5 md:p-10 md:px-[70px]">
      {user.role.name === "candidate" ? (
        <>
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start w-full gap-6">
            <div className="flex justify-center md:justify-start md:flex-[30%]">
              <img
                src={user.candidate.imgPath}
                alt={user.candidate.imgPath}
                className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
              />
            </div>

            <div className="md:flex-[70%] text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-roboto">
                {user.candidate.firstName + " " + user.candidate.lastName}
              </h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <MapPin />
                  <h2>
                    {user.candidate.location}, {user.candidate.country}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Mail />
                  <a href={`mailto:${user.email}`} className="text-paynes-gray hover:underline">
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <h2>{user.candidate.tel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <File />{" "}
                <a
                  href={user.candidate.resumeUrl}
                  target="_blank"
                  className="text-paynes-gray hover:underline"
                >
                  {decodeURIComponent(user.candidate.resumeUrl.split("/").pop()) || "No Resume"}
                </a>
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-5 md:py-10">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{user.candidate.bio}</p>
          </div>

          <div className="w-full px-3 md:px-5 py-5 md:py-10">
            <h1 className="text-2xl md:text-3xl">Seniority: {user.candidate.seniority} </h1>
          </div>

          <div className="w-full px-3 md:px-5">
            <h1 className="text-2xl md:text-3xl mb-1">Skills</h1>
            <SkillList names={getNamesForIds(skillIds)} max={skillIds.length} />
          </div>

          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={"edit"}>
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
                src={user.employer.companyLogo}
                alt={user.employer.companyLogo}
                className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
              />
            </div>

            <div className="md:flex-[70%] text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-roboto">{user.employer.companyName}</h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <MapPin />
                  <h2>
                    {user.employer.location}, {user.employer.country}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Mail />
                  <a href={`mailto:${user.email}`} className="text-paynes-gray hover:underline">
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <h2>{user.employer.tel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Link2 />
                <a
                  href={user.employer.website}
                  target="_blank"
                  className="text-paynes-gray hover:underline"
                >
                  {user.employer.website}
                </a>
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{user.employer.about}</p>
          </div>

          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={"edit"}>
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
