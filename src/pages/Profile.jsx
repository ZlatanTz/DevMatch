import { useLoaderData, Link } from "react-router-dom";
import profileImg from "../assets/profileImage.jpeg";
import { Phone, Mail, MapPin, MoveRight, File, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const [role, setRole] = useState("candidate");
  const [employer, setEmployer] = useState();
  const profile = useLoaderData();

  const Fetchemployer = async () => {
    const res = await fetch("../public/mock/employer_profiles.json");
    if (!res.ok) {
      throw new Response("Failed to load employer data", { status: res.status });
    }
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    const fetchEmployeer = async () => {
      const data = await Fetchemployer();
      setEmployer(data[0]);
    };

    fetchEmployeer();
  }, []);

  return (
    <div className="w-[90%] md:w-[80%] min-h-[700px] bg-white rounded-lg shadow-md hover:shadow-lg transition mx-auto my-[50px] p-5 md:p-10 md:px-[70px]">
      {role === "candidate" ? (
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
              <h1 className="text-2xl md:text-3xl font-roboto">{profile[1].full_name}</h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin />
                  <h2>
                    {profile[1].location}, {profile[1].country}
                  </h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail />
                  <h2>{profile[1].email}</h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone />
                  <h2>{profile[1].tel}</h2>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <File /> {profile[1].resume_url}
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{profile[1].bio}</p>
          </div>

          <div className="w-full px-3 md:px-5">
            <h1 className="text-2xl md:text-3xl">Skills</h1>
            <ul className="mt-3 space-y-2">
              {profile[1].skills.map((el, idx) => (
                <li key={idx}>
                  <div className="flex items-center gap-2 md:justify-start">
                    <MoveRight size={16} />
                    {el}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={`edit/${profile[1].id}`}>
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
              <h1 className="text-2xl md:text-3xl font-roboto">{employer?.company_name}</h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin />
                  <h2>
                    {employer?.location}, {employer?.country}
                  </h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail />
                  <h2>{employer?.email}</h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone />
                  <h2>{employer?.tel}</h2>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <Link2 /> {employer?.website}
              </div>
            </div>
          </div>
          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{employer?.about}</p>
          </div>
          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={`edit/${employer?.id}`}>
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
