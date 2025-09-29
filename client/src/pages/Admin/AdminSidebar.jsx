import React from "react";
import { NavLink } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { ChartLine } from "lucide-react";
import { Users } from "lucide-react";

const AdminSidebar = ({ pageName }) => {
  return (
    <div className="w-full lg:w-1/5 flex flex-col justify-between items-center bg-gradient-to-br from-paynes-gray to-federal-blue text-white">
      <div className="mt-12 px-8 w-full flex flex-col gap-12">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold">{pageName}</h1>
        </div>
        <div>
          {/* Navigation */}
          <ul className="flex flex-col gap-6">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `flex gap-5 ${isActive ? "text-emerald-600 font-semibold" : "text-gray-200"}`
              }
            >
              <Users />
              Manage Users
            </NavLink>
            <NavLink
              to="jobs"
              className={({ isActive }) =>
                `flex gap-5 ${isActive ? "text-emerald-600 font-semibold" : "text-gray-200"}`
              }
            >
              <BriefcaseBusiness />
              Manage Jobs
            </NavLink>
            <NavLink
              to="statistics"
              className={({ isActive }) =>
                `flex gap-5 ${isActive ? "text-emerald-600 font-semibold" : "text-gray-200"}`
              }
            >
              <ChartLine />
              Statistics
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
