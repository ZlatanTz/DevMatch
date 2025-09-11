import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateParamBatch, useJobsFilter } from "../hooks/useJobsFilter";
import { useSkills } from "../hooks/useSkills";
import MultiSelect from "@/pages/AuthLayout/MultiSelect";

export default function Toolbar() {
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

  const urlKey = useMemo(() => {
    const join = (arr) => (Array.isArray(arr) ? arr.join(",") : "");
    return [q, join(location), join(seniority), join(skills), join(sort)].join("|");
  }, [q, location, seniority, skills, sort]);

  useEffect(() => {
    console.log("Resetting form with skills:", skills);
    reset({
      q: q || "",
      loc: location,
      seniority: seniority,
      skills: skills,
      sort: sort,
    });
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

  return (
    <form
      onSubmit={handleSubmit(onApply)}
      className="w-full bg-white shadow rounded-lg p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex-1">
        <input
          {...register("q")}
          type="text"
          placeholder="Search jobs..."
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
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
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">
          Apply
        </button>
        <button type="button" onClick={onClear} className="px-4 py-2 border rounded-md">
          Clear
        </button>
      </div>
    </form>
  );
}
