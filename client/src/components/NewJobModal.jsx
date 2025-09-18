import { useEffect } from "react";
import { useForm } from "react-hook-form";
import MultiSelect from "@/pages/AuthLayout/MultiSelect";

export default function NewJobModal({
  open,
  onClose,
  onPost,
  skillOptions = [],
  skillsLoading = false,
}) {
  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      company: "",
      company_img: "",
      location: "Remote",
      employment_type: "Full-time",
      seniority: "Junior",
      min_salary: "",
      max_salary: "",
      is_remote: true,
      status: "open",
      skills: [],
      created_at: new Date().toISOString(),
      description: "",
      company_description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        company: "",
        company_img: "",
        location: "Remote",
        employment_type: "Full-time",
        seniority: "Junior",
        min_salary: "",
        max_salary: "",
        is_remote: true,
        status: "open",
        skills: [],
        created_at: new Date().toISOString(),
        description: "",
        company_description: "",
      });
    }
  }, [open, reset]);

  const submit = (values) => {
    const job = {
      title: values.title.trim(),
      company: values.company.trim(),
      company_img: values.company_img.trim(),
      location: values.location.trim(),
      employment_type: values.employment_type,
      seniority: values.seniority,
      min_salary: values.min_salary ? Number(values.min_salary) : null,
      max_salary: values.max_salary ? Number(values.max_salary) : null,
      is_remote: !!values.is_remote,
      status: values.status,
      skills: Array.isArray(values.skills) ? values.skills.map((v) => Number(v)) : [],
      created_at: values.created_at || new Date().toISOString(),
      description: values.description.trim(),
      company_description: values.company_description.trim(),
    };

    onPost?.(job);
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
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
            onClick={onClose}
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

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="job-title" className="text-sm font-medium">
                Job title
              </label>
              <input
                id="job-title"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Frontend Developer (React)"
                {...register("title", { required: true })}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="job-company" className="text-sm font-medium">
                Company
              </label>
              <input
                id="job-company"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="TechNova"
                {...register("company", { required: true })}
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
                {...register("company_img")}
              />
            </div>
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
                {...register("location")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Employment type</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={watch("employment_type")}
                onChange={(e) => setValue("employment_type", e.target.value)}
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
                value={watch("seniority")}
                onChange={(e) => setValue("seniority", e.target.value)}
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
                {...register("min_salary")}
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
                {...register("max_salary")}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="job-is-remote"
                type="checkbox"
                checked={!!watch("is_remote")}
                onChange={(e) => setValue("is_remote", e.target.checked)}
              />
              <label htmlFor="job-is-remote" className="text-sm">
                Remote friendly
              </label>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={watch("status")}
                onChange={(e) => setValue("status", e.target.value)}
              >
                <option value="open">open</option>
                <option value="paused">paused</option>
                <option value="closed">closed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <MultiSelect
              name="skills"
              control={control}
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
              {...register("description")}
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
              {...register("company_description")}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">
              Post job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
