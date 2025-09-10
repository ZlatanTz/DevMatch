import { getAllJobs, getHighestRatedJobs } from "@/api/services/jobs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [highestPaidJobs, setHighestPaidJobs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllJobs(), getHighestRatedJobs()])
      .then(([jobsData, highestPaidData]) => {
        setJobs(jobsData);
        setHighestPaidJobs(highestPaidData);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const daysAgo = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Added today";
    }
    return `Added ${days} days ago`;
  };

  const sortByNewest = (jobs) =>
    [...jobs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 border-solid"></div>
    </div>
  ) : error ? (
    <div>erorr</div>
  ) : (
    <div className="container mx-auto p-4 sm:p-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-4">
      {/* Carousel */}
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white p-4 sm:p-6 h-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Newest Jobs</h2>
          <div className="relative px-8 sm:px-12">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: false,
                initial: 0,
              }}
            >
              <CarouselContent className="flex gap-2 sm:gap-4">
                {sortByNewest(jobs)
                  .slice(0, 10)
                  .reverse()
                  .map((job) => (
                    <CarouselItem key={job.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="flex flex-col justify-between p-3 sm:p-4 bg-gray-300 rounded-lg shadow h-72 sm:h-80 w-full hover:bg-gray-400 hover:shadow-lg transition-all"
                      >
                        <h3 className="text-base sm:text-lg font-semibold mb-2 text-center line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-700 text-center mb-1 truncate">
                          {job.company}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 text-center italic mb-2">
                          {job.employment_type}
                        </p>
                        <p className="text-xs sm:text-sm text-center font-medium text-emerald-700 mb-2">
                          {job.min_salary}€ – {job.max_salary}€
                        </p>
                        <div className="flex flex-wrap justify-center gap-1 mb-2">
                          {job.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-gray-200 rounded-full"
                            >
                              {skill.length > 8 ? skill.substring(0, 8) + "..." : `Skill ${skill}`}
                            </span>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-gray-200 rounded-full">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          {daysAgo(job.created_at)}
                        </p>
                      </Link>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4 -translate-y-1/2 bg-paynes-gray text-white hover:text-white hover:bg-federal-blue shadow-md rounded-full p-2 sm:p-3" />
              <CarouselNext className="right-2 sm:right-4 -translate-y-1/2 bg-paynes-gray text-white hover:bg-federal-blue hover:text-white shadow-md rounded-full p-2 sm:p-3" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Highest paid */}
      <div className="col-span-1 order-last lg:order-none">
        <div className="bg-white p-4 sm:p-6 h-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Top 3 highest-paid</h2>
          <div className="flex flex-col gap-3">
            {highestPaidJobs.map((job, index) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <div className="bg-gray-50 rounded-lg shadow-xl p-3 sm:p-4 hover:bg-gray-200 transition relative">
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold mb-1 pr-8 line-clamp-2">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-500 mb-2 truncate">{job.company}</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-700">
                    {job.min_salary}€ – {job.max_salary}€
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated */}
      <div className="col-span-1 lg:col-span-4">
        <div className="bg-white p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Top rated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {jobs.slice(0, visibleCount).map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block bg-gray-50 rounded-lg border-2 shadow-xl p-3 sm:p-4 hover:bg-gray-200 transition"
              >
                <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{job.company}</p>
                <p className="text-xs italic text-gray-600 mb-2">{job.employment_type}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-800">Rating: 4.5</p>
                  <div className="flex text-yellow-400">
                    {"★".repeat(4)}
                    {"☆".repeat(1)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {jobs.length > 6 && (
            <div className="flex justify-center mt-4 sm:mt-6">
              <Button
                onClick={
                  visibleCount >= jobs.length
                    ? () => setVisibleCount(6)
                    : () => setVisibleCount((prev) => prev + 6)
                }
                className="px-4 py-2 sm:py-4 w-28 sm:w-32 text-sm sm:text-base rounded shadow bg-paynes-gray hover:bg-federal-blue transition-colors"
              >
                {visibleCount >= jobs.length ? "Show Less" : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
