export const AddJobModal = () => {
  return (
    <>
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
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
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
              <div className="space-y-1">
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
              </div>
            </div>

            {/* Meta */}
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
                  <option>Intern</option>
                  <option>Junior</option>
                  <option>Mid</option>
                  <option>Senior</option>
                  <option>Lead</option>
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

            {/* Skills multi-select, stores array of string IDs, convert to numbers on submit */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Skills</label>
              <Controller
                name="skills"
                control={controlJob}
                render={({ field }) => (
                  <MultiSelect
                    name={field.name}
                    control={{
                      // minimal adapter so our MultiSelect can work inside Controller
                      register: () => {},
                    }}
                    // Our MultiSelect expects react-hook-form's Controller pattern; we simply pass props through
                    // by using its internal Controller in the implementation you shared earlier
                    // so here we just render a compatible react-select directly using its options/value.
                    // If your MultiSelect wraps Controller internally, use its own 'control' from job form instead:
                    // name="skills" control={controlJob}
                    options={skillOptions}
                    isDisabled={skillsLoading}
                    isMulti
                  />
                )}
              />
              {/* Fallback: if your MultiSelect already wraps Controller, just use it like below and remove the Controller above:
                <MultiSelect name="skills" control={controlJob} options={skillOptions} isDisabled={skillsLoading} isMulti />
                */}
            </div>

            {/* Descriptions */}
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

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">
                Save job
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
