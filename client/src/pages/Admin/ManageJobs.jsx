import { useEffect, useState, useMemo } from "react";
import ServerResponseWrapper from "@/components/ServerResponseWrapper";
import { getAllJobsAdmin } from "@/api/services/admin";
import SearchHeader from "./SearchHeader";
import JobsTable from "./JobsTable";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setIsError(false);
      setErrorStatus(null);

      try {
        const data = await getAllJobsAdmin();
        setJobs(data);
        setIsSuccess(true);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setErrorStatus(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  console.log("jobs in admin: ", jobs);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.employmentType?.toLowerCase().includes(q),
    );
  }, [jobs, search]);

  return (
    <ServerResponseWrapper
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      errorStatus={errorStatus}
    >
      <div className="p-4 space-y-4 w-full">
        <h1 className="text-3xl font-bold tracking-wide pb-2 border-b border-gray-200">All Jobs</h1>

        <SearchHeader value={search} onChange={setSearch} count={filteredJobs.length} />

        <JobsTable data={filteredJobs} />
      </div>
    </ServerResponseWrapper>
  );
};

export default ManageJobs;
