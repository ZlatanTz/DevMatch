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

  const skillIds = user?.candidate.skills.map((skill) => skill.id);
  console.log(user);

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
                  <h2>{user.email}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <h2>{user.candidate.tel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <File /> {user.candidate.resumeUrl}
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{user.candidate.bio}</p>
          </div>

          <div className="w-full px-3 md:px-5">
            <h1 className="text-2xl md:text-3xl mb-1">Skills</h1>
            <SkillList names={getNamesForIds(skillIds)} />
          </div>

          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={`edit/${user.id}`}>
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
                src={user.employer.imgPath}
                alt={user.employer.imgPath}
                className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
              />
            </div>

            <div className="md:flex-[70%] text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-roboto">{user.employer.company_name}</h1>

              <div className="flex flex-col md:flex-row gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <MapPin />
                  <h2>
                    {user.employer.location}, {user.employer.country}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Mail />
                  <h2>{user.email}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Phone />
                  <h2>{user.employer.tel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Link2 /> {user.employer.website}
              </div>
            </div>
          </div>

          <div className="w-full px-3 md:px-5 py-10 md:py-20">
            <h1 className="text-2xl md:text-3xl">About</h1>
            <p className="mt-2 text-sm md:text-base">{user.employer.about}</p>
          </div>

          <div className="w-full h-50px mt-8 flex justify-center">
            <Link to={`edit/${user.id}`}>
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

// import { useLoaderData, Link } from "react-router-dom";
// import profileImg from "../assets/profileImage.jpeg";
// import { Phone, Mail, MapPin, MoveRight, File, Link2 } from "lucide-react";
// import { useSkills } from "../hooks/useSkills";
// import SkillList from "@/components/SkillList";

// const Profile = () => {
//   const { getNamesForIds } = useSkills();
//   const user = useLoaderData();

//   return (
//     <div className="w-[90%] md:w-[80%] min-h-[700px] bg-white rounded-lg shadow-md hover:shadow-lg transition mx-auto my-[80px] p-5 md:p-10 md:px-[70px]">
//       {user.role === "Candidate" ? (
//         <>
//           <div className="flex flex-col md:flex-row justify-center items-center md:items-start w-full gap-6">
//             <div className="flex justify-center md:justify-start md:flex-[30%]">
//               <img
//                 src={profileImg}
//                 alt="Profile"
//                 className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
//               />
//             </div>

//             <div className="md:flex-[70%] text-center md:text-left">
//               <h1 className="text-2xl md:text-3xl font-roboto">
//                 {user.first_name} {user.last_name}
//               </h1>

//               <div className="flex flex-col md:flex-row gap-2 mt-3">
//                 <div className="flex items-center gap-2">
//                   <MapPin />
//                   <h2>
//                     {user.location}, {user.country}
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Mail />
//                   <h2>{user.email}</h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone />
//                   <h2>{user.tel}</h2>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 mt-2">
//                 <File /> {user.resume_url}
//               </div>
//             </div>
//           </div>

//           <div className="w-full px-3 md:px-5 py-10 md:py-20">
//             <h1 className="text-2xl md:text-3xl">About</h1>
//             <p className="mt-2 text-sm md:text-base">{user.bio}</p>
//           </div>

//           <div className="w-full px-3 md:px-5 mb-10">
//             <h1 className="text-2xl md:text-3xl mb-1">Desired Salary</h1>
//             <h2>{user.desired_salary}€</h2>
//           </div>

//           <div className="w-full px-3 md:px-5">
//             <h1 className="text-2xl md:text-3xl mb-1">Skills</h1>
//             <SkillList names={user.skills.map((skill) => skill.name)} />
//           </div>
//           <div className="w-full h-50px mt-8 flex justify-center">
//             <Link to={`/profile/edit/${user.id}`}>
//               <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer">
//                 Edit Profile
//               </button>
//             </Link>
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="flex flex-col md:flex-row justify-center items-center md:items-start w-full gap-6">
//             <div className="flex justify-center md:justify-start md:flex-[30%]">
//               <img
//                 src={profileImg}
//                 alt="Profile"
//                 className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full object-cover"
//               />
//             </div>

//             <div className="md:flex-[70%] text-center md:text-left">
//               <h1 className="text-2xl md:text-3xl font-roboto">{user.company_name}</h1>

//               <div className="flex flex-col md:flex-row gap-2 mt-3">
//                 <div className="flex items-center gap-2">
//                   <MapPin />
//                   <h2>
//                     {user.location}, {user.country}
//                   </h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Mail />
//                   <h2>{user.email}</h2>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone />
//                   <h2>{user.tel}</h2>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 mt-2">
//                 <Link2 /> {user.website}
//               </div>
//             </div>
//           </div>

//           <div className="w-full px-3 md:px-5 py-10 md:py-20">
//             <h1 className="text-2xl md:text-3xl">About</h1>
//             <p className="mt-2 text-sm md:text-base">{user.about}</p>
//           </div>

//           <div className="w-full h-50px mt-8 flex justify-center">
//             <Link to={`/profile/edit/${user.user_id}`}>
//               <button className="bg-emerald hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer">
//                 Edit Profile
//               </button>
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Profile;
