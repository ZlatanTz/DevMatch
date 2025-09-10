import AllSkillsList from "../components/AllSkillsList";
import { useLoaderData, useParams } from "react-router-dom";
import SkillList from "../components/SkillList";
import { useSkills } from "../hooks/useSkills";

const JobDetails = () => {
  const jobs = useLoaderData();
  const { id } = useParams(); // ID iz URL-a
  const job = jobs.find((job) => job.id === parseInt(id));
  const {
    title,
    company,
    company_img,
    location,
    employment_type,
    seniority,
    min_salary,
    max_salary,
    is_remote,
    status,
    skills,
    created_at,
    description,
  } = job;

  const date = new Date(created_at);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const { getNamesForIds } = useSkills();
  const skillNames = getNamesForIds(skills);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika za slanje podataka
    console.log("Forma poslata!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white min-h-screen">
      <img
        src={company_img}
        alt={`${company} logo`}
        className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain object-center rounded-lg mb-6 shadow-md"
      />

      <div className="flex flex-wrap justify-around bg-federal-blue text-white p-4 rounded-lg mb-8">
        <p className="mx-2 font-medium">{company}</p>
        <p className="mx-2 font-medium">{title}</p>
        <p className="mx-2 font-medium">{location}</p>
        <p className="mx-2 font-medium">
          {min_salary}€-{max_salary}€
        </p>
        <p className="mx-2 font-medium">{employment_type}</p>
        <p className="mx-2 font-medium">{is_remote ? "Remote" : "On-site"}</p>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="job-description md:w-7/10  p-6 rounded-lg shadow border border-gray-200">
            <p className="mb-4 text-gray-700">Job description goes here. </p>
            <p className="font-semibold text-paynes-gray">The role entails:</p>
            <p className="mb-4 text-gray-700">{description}</p>
            <p className="font-semibold text-paynes-gray">Requiremnt:</p>
            <div className="mt-auto pt-4 flex items-center justify-between text-sm">
              <SkillList names={skillNames} max={3} />
            </div>
            .<p className="font-semibold text-paynes-gray">What we offer:</p>
            <p className="mb-4 text-gray-700">
              Job description goes here.Job description goes here.Job description goes here.Job
              description goes here.Job description goes here.Job description goes here.Job
              description goes here.Job description goes here.Job description goes here.Job
              description goes here.
            </p>
          </div>
          <div className="job-side-details flex-1  p-6 rounded-lg shadow border border-gray-200">
            <div className="flex justify-start items-center mb-4">
              <p className="text-paynes-gray font-medium">Date posted:</p>
              <p className="text-gray-700 pl-1">{formattedDate}</p>
            </div>
            <div className="flex justify-start items-center">
              <p className="text-paynes-gray font-medium">Location:</p>
              <p className="text-gray-700 pl-1">Podgorica</p>
            </div>
          </div>
        </div>

        <div className="job-apply-form bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-center mb-4 text-federal-blue">Apply for a job </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  First Name <span className="text-emerald">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Last Name <span className="text-emerald">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-federal-blue mb-1">
                  Email address <span className="text-emerald">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="example@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="birthYear"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Year of birth <span className="text-emerald">*</span>
                </label>
                <input
                  type="number"
                  id="birthYear"
                  required
                  min="1950"
                  max="2005"
                  placeholder="Year of birth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-federal-blue mb-1">
                  Phone number <span className="text-emerald">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder="+381 63 123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-federal-blue mb-1"
                >
                  Location <span className="text-emerald">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  placeholder="Where do you live?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-federal-blue mb-1"
              >
                Job experience (years) <span className="text-emerald">*</span>
              </label>
              <input
                type="number"
                id="experience"
                required
                min="0"
                placeholder="Number of years of experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-federal-blue mb-1"
              >
                Level<span className="text-emerald">*</span>
              </label>
              <select
                id="education"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              >
                <option value="">Choose a level</option>
                <option value="intern">Intern</option>
                <option value="junior">Junior</option>
                <option value="medior">Medior</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-federal-blue mb-1">
                Skill <span className="text-emerald">*</span>
              </label>
              <AllSkillsList max={3} />
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-federal-blue mb-1">
                Upload CV (PDF) <span className="text-emerald">*</span>
              </label>
              <input
                type="file"
                id="cv"
                accept=".pdf"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/90"
              />
            </div>

            <div>
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-federal-blue mb-1"
              >
                Cover letter{" "}
              </label>
              <textarea
                id="coverLetter"
                rows="4"
                placeholder="Write your cover letter here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald text-white py-3 px-4 rounded-md hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 transition-colors font-semibold text-base"
            >
              Send application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
