import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, ChartLine, Users, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminSidebar = ({ pageName }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-full lg:w-1/5 min-h-screen flex flex-col bg-gradient-to-br from-paynes-gray to-federal-blue text-white">
      <div className="px-8 pt-10 pb-6">
        <h1 className="text-3xl font-bold">{pageName}</h1>
      </div>

      <nav className="px-8 flex-1">
        <ul className="flex flex-col gap-6">
          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `flex items-center gap-4 text-base transition ${
                  isActive ? "text-emerald-400 font-semibold" : "text-gray-200 hover:text-white"
                }`
              }
            >
              <Users className="w-5 h-5" />
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="jobs"
              className={({ isActive }) =>
                `flex items-center gap-4 text-base transition ${
                  isActive ? "text-emerald-400 font-semibold" : "text-gray-200 hover:text-white"
                }`
              }
            >
              <BriefcaseBusiness className="w-5 h-5" />
              Manage Jobs
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="border-t flex items-center justify-center border-white/10 p-3 w-full">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 active:scale-[.98] px-18 py-2 text-sm font-semibold text-white"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
