import { useLoaderData } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import { JobCard } from "../components/JobCard";
export const Jobs = () => {
  const jobs = useLoaderData();

  return (
    <>
      <Toolbar />
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {jobs.map((job) => {
          const { title, company, location, employment_type, description, id } = job;
          return (
            <JobCard
              key={id}
              title={title}
              company={company}
              location={location}
              employment_type={employment_type}
              description={description}
            />
          );
        })}
      </section>
    </>
  );
};
