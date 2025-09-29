import { useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { updateParamBatch, useJobsFilter } from "../hooks/useJobsFilter";
import { useSkills } from "../hooks/useSkills";
import MultiSelect from "@/pages/AuthLayout/MultiSelect";
import { useAuth } from "../context/AuthContext";
import { createNewJob } from "@/api/services/jobs";

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

  const openModal = () => {
    setOpen(true);
    resetJob({
      title: "",
      location: "",
      employment_type: "Full-time",
      seniority: "Junior",
      min_salary: "",
      max_salary: "",
      is_remote: false,
      status: "open",
      skills: [],
      description: "",
      company_description: user?.employer?.about || "",
      benefits: "",
      employer_id: user?.employer?.employerId,
    });
  };

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
      status: "open",
      skills: [],
      description: "",
      company_description: user?.employer?.about || "",
      benefits: "",
      employer_id: user?.employer?.employerId,
    },
  });

  const submitNewJob = async (values) => {
    const job = {
      title: values.title.trim(),
      location: values.location.trim(),
      employment_type: values.employment_type,
      seniority: values.seniority,
      min_salary: values.min_salary ? Number(values.min_salary) : null,
      max_salary: values.max_salary ? Number(values.max_salary) : null,
      is_remote: !!values.is_remote,
      // status: values.status,
      skills: Array.isArray(values.skills) ? values.skills.map((v) => Number(v)) : [],
      // created_at: values.created_at || new Date().toISOString(),
      description: values.description.trim(),
      company_description: values.company_description.trim(),
      benefits: values.benefits ? values.benefits.split(",").map((b) => b.trim()) : [],
      employer_id: user?.employer.employerId,
    };

    try {
      const createdJob = await createNewJob(job);
      // console.log("Job created:", createdJob);

      window.dispatchEvent(new CustomEvent("job:add", { detail: createdJob }));

      setOpen(false);
      resetJob();
    } catch (err) {
      console.error("Failed to create job:", err);
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
              // onClick={() => setOpen(true)}
              onClick={openModal}
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
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
                onClick={() => setOpen(false)}
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

                {/* <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={watchJob("status")}
                    onChange={(e) => setValueJob("status", e.target.value)}
                  >
                    <option value="open">open</option>
                    <option value="paused">paused</option>
                    <option value="closed">closed</option>
                  </select>
                </div> */}
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

              <div className="space-y-1">
                <label htmlFor="job-benefits" className="text-sm font-medium">
                  Benefits
                </label>
                <textarea
                  id="job-benefits"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="What are your company benefits…"
                  {...regJob("benefits")}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald hover:bg-emerald/80 text-white rounded-md"
                >
                  Save job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
