import { useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { updateParamBatch, useJobsFilter } from "../hooks/useJobsFilter";
import { useSkills } from "../hooks/useSkills";
import MultiSelect from "@/pages/AuthLayout/MultiSelect";
import { useAuth } from "../context/AuthContext";
import { createJob } from "@/api/services/jobs";

export default function Toolbar() {
  const { q, location, seniority, skills, sort, setSearchParams, searchParams } = useJobsFilter();
  const { skills: allSkills = [], loading: skillsLoading } = useSkills();
  const { user } = useAuth();
  const roleName = user?.role?.name?.toLowerCase();
  const isCandidate = Boolean(user?.candidate?.candidateId || roleName === "candidate");

  console.log(user);

  const skillOptions = useMemo(
    () => allSkills.map((s) => ({ value: String(s.id), label: s.name })),
    [allSkills],
  );

  const locationOptions = useMemo(
    () => [
      { value: "loc-remote", label: "Remote" },
      { value: "loc-onsite", label: "On-site" },
    ],
    [],
  );

  const seniorityOptions = useMemo(
    () => [
      { value: "junior", label: "Junior" },
      { value: "mid", label: "Mid" },
      { value: "senior", label: "Senior" },
    ],
    [],
  );

  const sortOptions = useMemo(() => {
    const options = [
      { value: "date-desc", label: "Newest" },
      { value: "date-asc", label: "Oldest" },
      { value: "salary-desc", label: "Salary High → Low" },
      { value: "salary-asc", label: "Salary Low → High" },
    ];

    if (isCandidate) {
      return [{ value: "recommended", label: "Recommended" }, ...options];
    }

    return options;
  }, [isCandidate]);

  const { register, control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      q: q || "",
      loc: Array.isArray(location) ? location : [],
      seniority: Array.isArray(seniority) ? seniority : [],
      skills: Array.isArray(skills) ? skills : [],
      sort: Array.isArray(sort) ? sort : sort || (isCandidate ? "recommended" : "date-desc"),
    },
  });

  const join = (arr) => (Array.isArray(arr) ? arr.join(",") : "");
  const urlKey = useMemo(
    () => [q, join(location), join(seniority), join(skills), join(sort)].join("|"),
    [q, location, seniority, skills, sort],
  );

  useEffect(() => {
    reset({ q: q || "", loc: location, seniority, skills, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey, reset]);

  const onApply = (values) => {
    updateParamBatch(searchParams, setSearchParams, {
      q: values.q,
      loc: values.loc,
      seniority: values.seniority,
      skills: values.skills,
      sort: values.sort,
      page: 1,
    });
  };

  const onClear = () => {
    reset({ q: "", loc: [], seniority: [], skills: [], sort: [] });
    updateParamBatch(searchParams, setSearchParams, {
      q: "",
      loc: [],
      seniority: [],
      skills: [],
      sort: [],
      page: 1,
    });
  };

  const [open, setOpen] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState(null);
  const [benefitInput, setBenefitInput] = useState("");

  const {
    register: regJob,
    handleSubmit: submitJob,
    control: controlJob,
    reset: resetJob,
    watch: watchJob,
    setValue: setValueJob,
  } = useForm({
    defaultValues: {
      title: "",
      location: "",
      employment_type: "Full-time",
      seniority: "Junior",
      min_salary: "",
      max_salary: "",
      is_remote: false,
      skills: [],
      description: "",
      company_description: user?.employer?.about || "",
      benefits: [],
      employer_id: user?.employer?.employerId,
    },
  });

  const benefits = watchJob("benefits") || [];

  const addBenefit = () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;

    const exists = benefits.some((benefit) => benefit.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setBenefitInput("");
      return;
    }

    setValueJob("benefits", [...benefits, trimmed]);
    setBenefitInput("");
  };

  const removeBenefit = (index) => {
    setValueJob(
      "benefits",
      benefits.filter((_, benefitIndex) => benefitIndex !== index),
    );
  };

  const closeJobModal = () => {
    setOpen(false);
    setCreateJobError(null);
    setCreatingJob(false);
    resetJob();
    setBenefitInput("");
  };

  const submitNewJob = async (values) => {
    const employerId = user?.employer?.employerId;
    if (!employerId) {
      setCreateJobError("Employer profile is required before posting jobs.");
      return;
    }

    const trimOrNull = (input) => {
      if (typeof input !== "string") return null;
      const trimmed = input.trim();
      return trimmed.length ? trimmed : null;
    };

    const title = typeof values.title === "string" ? values.title.trim() : "";
    if (!title) {
      setCreateJobError("Job title is required.");
      return;
    }

    const benefitsList = Array.isArray(values.benefits)
      ? values.benefits.map((benefit) => benefit.trim()).filter(Boolean)
      : [];

    const payload = {
      title,
      location: trimOrNull(values.location),
      employment_type: values.employment_type || null,
      seniority: values.seniority || null,
      min_salary: values.min_salary ? Number(values.min_salary) : null,
      max_salary: values.max_salary ? Number(values.max_salary) : null,
      is_remote: !!values.is_remote,
      status: "open",
      description: trimOrNull(values.description),
      company_description: trimOrNull(values.company_description),
      skills: Array.isArray(values.skills) ? values.skills.map((v) => Number(v)) : [],
      benefits: benefitsList.length > 0 ? benefitsList : null,
      employer_id: employerId,
    };

    setCreatingJob(true);
    setCreateJobError(null);
    try {
      const createdJob = await createJob(payload);
      window.dispatchEvent(
        new CustomEvent("job:add", {
          detail: {
            ...createdJob,
          },
        }),
      );

      closeJobModal();
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to create job.";
      setCreateJobError(message);
    } finally {
      setCreatingJob(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onApply)}
        className="w-full bg-white shadow rounded-lg p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2 flex-1">
          <input
            {...register("q")}
            type="text"
            placeholder="Search jobs..."
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => {
              setValue("q", e.target.value);
              updateParamBatch(searchParams, setSearchParams, {
                q: e.target.value,
                loc: watch("loc"),
                seniority: watch("seniority"),
                skills: watch("skills"),
                sort: watch("sort"),
                page: 1,
              });
            }}
          />

          {/* STARI INPUT KOJI CEKA APPLY CHANGES DA SE PRITISNE 
          <input
            {...register("q")}
            type="text"
            placeholder="Search jobs..."
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          /> */}

          {user?.employer && (
            <button
              type="button"
              onClick={() => {
                setCreateJobError(null);
                setCreatingJob(false);
                resetJob();
                setBenefitInput("");
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald text-white rounded-md "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M12 5a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5V6a1 1 0 011-1z" />
              </svg>
              Add job
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <MultiSelect
            name="skills"
            control={control}
            label="Skills"
            options={skillOptions}
            isDisabled={skillsLoading}
            isMulti
          />
          <MultiSelect
            name="loc"
            control={control}
            label="Location"
            options={locationOptions}
            isMulti
          />
          <MultiSelect
            name="seniority"
            control={control}
            label="Seniority"
            options={seniorityOptions}
            isMulti
          />
          <MultiSelect
            name="sort"
            control={control}
            label="Sort"
            options={sortOptions}
            isMulti={false}
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-emerald text-white rounded-md">
            Apply Filters
          </button>
          <button type="button" onClick={onClear} className="px-4 py-2 border rounded-md">
            Clear
          </button>
        </div>
      </form>

      {open && user?.employer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeJobModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Add a new job</h2>
                <p className="text-sm text-gray-500">
                  Fill out the details and save to create a new job post.
                </p>
              </div>
              <button
                type="button"
                onClick={closeJobModal}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={submitJob(submitNewJob)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="job-title" className="text-sm font-medium">
                    Job title
                  </label>
                  <input
                    id="job-title"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Frontend Developer (React)"
                    {...regJob("title", { required: true })}
                  />
                </div>
                {/* <div className="space-y-1">
                  <label htmlFor="job-company" className="text-sm font-medium">
                    Company
                  </label>
                  <input
                    id="job-company"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="TechNova"
                    {...regJob("company", { required: true })}
                  />
                </div> 
                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="job-company-img" className="text-sm font-medium">
                    Company logo URL
                  </label>
                  <input
                    id="job-company-img"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://…"
                    {...regJob("company_img")}
                  />
                </div>*/}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="job-location" className="text-sm font-medium">
                    Location
                  </label>
                  <input
                    id="job-location"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Remote"
                    {...regJob("location")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Employment type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={watchJob("employment_type")}
                    onChange={(e) => setValueJob("employment_type", e.target.value)}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Seniority</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={watchJob("seniority")}
                    onChange={(e) => setValueJob("seniority", e.target.value)}
                  >
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="job-min-salary" className="text-sm font-medium">
                    Min salary
                  </label>
                  <input
                    id="job-min-salary"
                    type="number"
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="2000"
                    {...regJob("min_salary")}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="job-max-salary" className="text-sm font-medium">
                    Max salary
                  </label>
                  <input
                    id="job-max-salary"
                    type="number"
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="3000"
                    {...regJob("max_salary")}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="job-is-remote"
                    type="checkbox"
                    checked={!!watchJob("is_remote")}
                    onChange={(e) => setValueJob("is_remote", e.target.checked)}
                  />
                  <label htmlFor="job-is-remote" className="text-sm">
                    Remote friendly
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <MultiSelect
                  name="skills"
                  control={controlJob}
                  label="Skills"
                  options={skillOptions}
                  isDisabled={skillsLoading}
                  isMulti
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="job-description" className="text-sm font-medium">
                  Job description
                </label>
                <textarea
                  id="job-description"
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="What the candidate will do…"
                  {...regJob("description")}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="job-company-description" className="text-sm font-medium">
                  Company description
                </label>
                <textarea
                  id="job-company-description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Who you are as a company…"
                  {...regJob("company_description")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="job-benefit-input" className="text-sm font-medium">
                  Benefits
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="job-benefit-input"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g. Health insurance"
                    value={benefitInput}
                    onChange={(event) => setBenefitInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    disabled={!benefitInput.trim()}
                    className="px-4 py-2 bg-emerald hover:bg-emerald/80 text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                {benefits.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {benefits.map((benefit, index) => (
                      <li
                        key={`${benefit}-${index}`}
                        className="flex items-center gap-2 bg-emerald/10 text-emerald px-3 py-1 rounded-full text-sm"
                      >
                        <span>{benefit}</span>
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="text-emerald hover:text-emerald/70"
                          aria-label={`Remove benefit ${benefit}`}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">
                    Add each benefit separately so candidates can see them clearly on the posting.
                  </p>
                )}
              </div>

              {createJobError && <p className="text-sm text-red-600">{createJobError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeJobModal}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-4 py-2 bg-emerald hover:bg-emerald/80 text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creatingJob ? "Saving..." : "Save job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
