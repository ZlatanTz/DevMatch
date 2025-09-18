import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateParamBatch, useJobsFilter } from "../hooks/useJobsFilter";
import { useSkills } from "../hooks/useSkills";
import MultiSelect from "@/pages/AuthLayout/MultiSelect";
import NewJobModal from "@/components/NewJobModal";
import axios from "axios";
import { useRevalidator } from "react-router-dom";
export default function Toolbar() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { q, location, seniority, skills, sort, setSearchParams, searchParams } = useJobsFilter();
  const { skills: allSkills = [], loading: skillsLoading } = useSkills();

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

  const sortOptions = useMemo(
    () => [
      { value: "date-desc", label: "Newest" },
      { value: "date-asc", label: "Oldest" },
      { value: "salary-desc", label: "Salary High → Low" },
      { value: "salary-asc", label: "Salary Low → High" },
    ],
    [],
  );

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      q: q || "",
      loc: Array.isArray(location) ? location : [],
      seniority: Array.isArray(seniority) ? seniority : [],
      skills: Array.isArray(skills) ? skills : [],
      sort: Array.isArray(sort) ? sort : "date-desc",
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
    });
  };

  const [open, setOpen] = useState(false);
  const { revalidate } = useRevalidator();
  const handlePostJob = async (job) => {
    try {
      const res = await axios.post(`${apiUrl}jobs`, job);

      setOpen(false);
      console.log(res);
      revalidate();
      return res.data;
    } catch (err) {
      console.error("Failed to post job", err);
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
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
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

      <NewJobModal
        open={open}
        onClose={() => setOpen(false)}
        onPost={handlePostJob}
        skillOptions={skillOptions}
        skillsLoading={skillsLoading}
      />
    </div>
  );
}
