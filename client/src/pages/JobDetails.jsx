import AllSkillsList from "../components/AllSkillsList";
import { Link, useLoaderData, useParams } from "react-router-dom";
import SkillList from "../components/SkillList";
import { useSkills } from "../hooks/useSkills";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { applyToJob } from "@/api/services/applications";
import { uploadFileService } from "@/api/services/uploadFiles";

const JobDetails = () => {
  const { user, token } = useAuth();
  // console.log(user.candidate.skills);
  const job = useLoaderData();
  const { id } = useParams(); // ID iz URL-a
  // const job = jobs.find((job) => job.id === parseInt(id));

  const {
    title,
    employer_id,
    company_img,
    location,
    employment_type,
    seniority,
    min_salary,
    max_salary,
    is_remote,
    status,
    created_at,
    description,
    company_description,
    benefits,
    employer,
  } = job;

  const statusLabel = status === "open" ? "Open" : status === "paused" ? "Paused" : "Closed";

  const [visibleCount, setVisibleCount] = useState(6);

  // console.log(user);
  // console.log(job);
  // const loggedIn = user ? true : false; --> depricated!
  // console.log(loggedIn);
  // const [candidateLoggedIn, setCandidateLoggedIn] = useState(loggedIn); //da li je ulogovan candidate --> depricated!

  const date = new Date(created_at);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const skill_ids = job.skills.map((skill) => skill.id);
  const { getNamesForIds } = useSkills();
  const skillNames = getNamesForIds(skill_ids);
  // console.log(skill_ids);
  // console.log(skillNames);

  const [formData, setFormData] = useState(() => ({
    firstName: user?.candidate?.firstName || "",
    lastName: user?.candidate?.lastName || "",
    email: user?.email || "",
    birthYear: "",
    phone: user?.candidate?.tel || "",
    location: user?.candidate?.location || "",
    experience: user?.candidate?.yearsExp || 0,
    seniority: user?.candidate?.seniority || "",
    skills: user?.candidate?.skills || [],
    cv_path: null,
    coverLetter: "",
  }));

  //const [selectedSkills, setSelectedSkills] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [uploadingCV, setUploadingCV] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data.items || []));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data.items || []));
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setUploadingCV(true);
    setFormData((prev) => ({ ...prev, cv_path: null }));
    try {
      const fileUrl = await uploadFileService(file);
      console.log(fileUrl);
      setFormData((prev) => ({ ...prev, cv_path: fileUrl }));
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading CV. Please try again.");
    } finally {
      setUploadingCV(false);
    }
  };

  const handleClickLink = () => {
    window.scrollTo(0, 0);
    setVisibleCount(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cv_path) {
      alert("Please upload your CV before submitting.");
      return;
    }

    try {
      const data = await applyToJob(id, formData);
      console.log("Application submitted:", data);
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "Something went wrong");
    }
  };

  const initialSelected = user?.candidate.skills.map((skill) => skill.name) || null;
  const [selectedSkills, setSelectedSkills] = useState(initialSelected);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, skills: selectedSkills }));
  }, [selectedSkills]);

  if (!job) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <p className="mt-4">The job you're looking for doesn't exist or was removed.</p>
        <Link to="/jobs" className="inline-block mt-6 px-4 py-2 rounded-xl bg-emerald text-white">
          Back to Jobs
        </Link>
      </section>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white min-h-screen min-w-[320px]">
      <img
        src={company_img}
        alt={`${employer_id} logo`}
        className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain object-center rounded-lg mb-6 shadow-md"
      />

      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:flex-wrap sm:justify-around sm:space-y-0 p-4 rounded-lg mb-8 bg-federal-blue text-white">
        <p className="mx-2 font-medium">{employer.company_name}</p>
        <p className="mx-2 font-medium">{title}</p>
        <p className="mx-2 font-medium">{location}</p>
        <p className="mx-2 font-medium">{seniority}</p>
        <p className="mx-2 font-medium">{employment_type}</p>
        <p className="mx-2 font-medium">{is_remote ? "Remote" : "On-site"}</p>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="job-description lg:w-7/10 md:w-6/10 p-6 rounded-lg shadow border border-gray-200 order-2 md:order-1">
            <p className="font-semibold text-federal-blue text-2xl">About the job</p>
            <p className="mb-4 text-gray-700">{company_description}</p>
            <p className="font-semibold text-paynes-gray">The role entails:</p>
            <p className="mb-4 text-gray-700">{description}</p>
            <p className="font-semibold text-paynes-gray">What we are looking for in you:</p>
            <div className="mt-auto pt-3 pb-3 flex items-center justify-between text-sm">
              <SkillList names={skillNames} max={skillNames.length} />
            </div>
            <p className="font-semibold text-paynes-gray">What we offer:</p>

            <ul className="mb-4 text-gray-700 list-disc list-inside">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 order-1 md:order-2 lg:w-3/10 md:w-4/10">
            <div className="job-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Status:</p>
                <p className="text-gray-700 pl-1">{statusLabel}</p>
              </div>

              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Date posted:</p>
                <p className="text-gray-700 pl-1">{formattedDate}</p>
              </div>
              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Location:</p>
                <p className="text-gray-700 pl-1">{location}</p>
              </div>
              <div className="flex justify-start items-center ">
                <p className="text-paynes-gray font-medium">Salary:</p>
                <p className="text-gray-700 pl-1">
                  {min_salary}€ - {max_salary}€
                </p>
              </div>
            </div>
            <div className="employer-side-details w-full p-6 rounded-lg shadow border border-gray-200 md:self-start">
              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Compamy:</p>
                <p className="text-gray-700 pl-1">{employer.company_name}</p>
              </div>

              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Location :</p>
                <p className="text-gray-700 pl-1">{employer.location}</p>
              </div>
              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Country:</p>
                <p className="text-gray-700 pl-1">{employer.country}</p>
              </div>
              <div className="flex justify-start items-center mb-4">
                <p className="text-paynes-gray font-medium">Phone:</p>
                <p className="text-gray-700 pl-1">{employer.tel}</p>
              </div>
              <div className="flex justify-start items-center ">
                <p className="text-paynes-gray font-medium">Website:</p>
                <a href={employer.website} target="_blank" className="text-emerald pl-1">
                  {employer.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {user ? (
          user?.candidate ? (
            <div className="job-apply-form bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-center mb-4 text-federal-blue">
                Apply for a job
              </h2>

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
                      value={formData.firstName}
                      onChange={handleInputChange}
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
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-federal-blue mb-1"
                    >
                      Email address <span className="text-emerald">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.birthYear}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-federal-blue mb-1"
                    >
                      Phone number <span className="text-emerald">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="+381 63 123456"
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      value={formData.location}
                      onChange={handleInputChange}
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
                    value={formData.experience}
                    onChange={handleInputChange}
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
                    id="seniority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                    value={formData.seniority}
                    onChange={handleInputChange}
                  >
                    <option value="">Seniority</option>
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior</option>
                    <option value="Medior">Medior</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-federal-blue mb-1"
                  >
                    Skill <span className="text-emerald">*</span>
                  </label>
                  <AllSkillsList
                    max={5}
                    value={selectedSkills}
                    onChange={(newSelected) => setSelectedSkills(newSelected)}
                  />
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
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/80"
                  />
                  {uploadingCV && <p className="mt-2 text-sm text-emerald">Uploading CV...</p>}
                  {formData.cv_path && !uploadingCV && (
                    <p className="mt-2 text-sm text-emerald">Uploaded CV URL: {formData.cv_path}</p>
                  )}
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
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald focus:border-transparent transition text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={uploadingCV}
                  className="w-full bg-emerald text-white py-3 px-4 rounded-md hover:bg-emerald/80 focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 transition-colors font-semibold text-base"
                >
                  {uploadingCV ? "Uploading CV..." : "Send application"}
                </button>
              </form>
            </div>
          ) : null
        ) : (
          <Link to="/login" state={{ from: window.location.pathname }}>
            <button className="w-full bg-emerald text-white mb-8 py-3 px-4 rounded-md hover:bg-emerald/80 focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 transition-colors font-semibold text-base">
              Log In to Apply
            </button>
          </Link>
        )}

        <div className="col-span-1 lg:col-span-4">
          <div className="rounded-2xl border border-border bg-card/70 mt-8 backdrop-blur supports-[backdrop-filter]:bg-card/60 p-4 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">Top rated</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {jobs.slice(0, visibleCount).map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  onClick={handleClickLink}
                  className="block rounded-2xl border-2 border-border bg-white/80 dark:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4 shadow-sm transition-all motion-safe:duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                    {job.company}
                  </p>
                  <p className="text-xs italic text-foreground/80 mb-3">{job.employment_type}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-foreground/80">Rating: 4.5</p>
                    <div className="flex text-yellow-400" aria-hidden="true">
                      {"★".repeat(4)}
                      {"☆".repeat(1)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {jobs.length > 3 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <Button
                  onClick={
                    visibleCount >= jobs.length
                      ? () => setVisibleCount(3)
                      : () => setVisibleCount((prev) => prev + 3)
                  }
                  className="bg-emerald text-white hover:bg-emerald/80 px-4 py-2 sm:py-4 w-28 sm:w-32 text-sm sm:text-base rounded-full shadow-md"
                >
                  {visibleCount >= jobs.length ? "Show Less" : "Load More"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
