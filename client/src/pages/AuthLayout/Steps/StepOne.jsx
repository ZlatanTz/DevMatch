// import React, { useState } from "react";

import { CircleCheck } from "lucide-react";

const StepOne = ({ role, setRole }) => {
  const ROLES = [
    {
      key: "candidate",
      title: "Candidate",
      description: "I am looking for a job through the platform.",
    },
    {
      key: "employer",
      title: "Employer",
      description: "I want to post job offers and hire candidates.",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-4/5 xl:w-full">
      {ROLES.map((r) => {
        const isActive = role === r.key;

        return (
          <div
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`flex items-start cursor-pointer px-6 py-8 rounded-lg border transition
              ${isActive ? "border-emerald-500 bg-white" : "border-gray-300 bg-white"}`}
          >
            <CircleCheck
              className={`mt-1 mr-3 w-5 h-5 flex-shrink-0 ${
                isActive ? "text-emerald-500" : "text-gray-400"
              }`}
            />
            <div>
              <h3 className={`font-semibold ${isActive ? "text-emerald-600" : "text-gray-800"}`}>
                {r.title}
              </h3>
              <p className="text-sm text-gray-500">{r.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepOne;
