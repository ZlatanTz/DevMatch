import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.jpg";
import profileImage from "../assets/profileIcon.jpg";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const sortLinks = [
  { label: "Newest", to: { pathname: "/jobs", search: "?sort=date-desc" } },
  { label: "Oldest", to: { pathname: "/jobs", search: "?sort=date-asc" } },
  { label: "Salary High → Low", to: { pathname: "/jobs", search: "?sort=salary-desc" } },
  { label: "Salary Low → High", to: { pathname: "/jobs", search: "?sort=salary-asc" } },
];

export default function Header() {
  const [isLogged, setIsLogged] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const avatarBtnRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleDocClick(e) {
      if (
        dropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [dropdownOpen]);

  const linkBase = "px-3 py-2 rounded-xl text-sm md:text-base transition-colors";
  const linkActive = "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30";
  const linkInactive =
    "text-white/85 hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald";

  return (
    <header className="bg-federal-blue text-white sticky top-0 z-50 border-b border-white/10 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <NavLink to="/" className="shrink-0">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
            />
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            <div className="relative group">
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive} inline-flex items-center`
                }
              >
                Jobs
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </NavLink>

              {/* Wrapper sits directly under the trigger, no external margin */}
              <div
                className="absolute left-0 top-full pt-2 opacity-0 translate-y-1 transition
                  duration-150 ease-out group-hover:opacity-100 group-hover:translate-y-0"
              >
                <div className="w-64 rounded-xl bg-federal-blue/95 p-2 shadow-lg ring-1 ring-white/10 backdrop-blur">
                  <NavLink
                    to={{ pathname: "/jobs", search: "?sort=date-desc" }}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm ${
                        isActive
                          ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                          : "text-white/85 hover:text-emerald hover:bg-white/5"
                      }`
                    }
                  >
                    Newest
                  </NavLink>
                  <NavLink
                    to={{ pathname: "/jobs", search: "?sort=date-asc" }}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm ${
                        isActive
                          ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                          : "text-white/85 hover:text-emerald hover:bg-white/5"
                      }`
                    }
                  >
                    Oldest
                  </NavLink>
                  <NavLink
                    to={{ pathname: "/jobs", search: "?sort=salary-desc" }}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm ${
                        isActive
                          ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                          : "text-white/85 hover:text-emerald hover:bg-white/5"
                      }`
                    }
                  >
                    Salary High → Low
                  </NavLink>
                  <NavLink
                    to={{ pathname: "/jobs", search: "?sort=salary-asc" }}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm ${
                        isActive
                          ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                          : "text-white/85 hover:text-emerald hover:bg-white/5"
                      }`
                    }
                  >
                    Salary Low → High
                  </NavLink>
                </div>
              </div>
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-xl p-2 text-white/90 hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          <div className="hidden md:flex items-center gap-3">
            {!isLogged ? (
              <>
                <NavLink
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm text-white/90 hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl bg-emerald px-3 py-2 text-sm font-medium text-federal-blue hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={avatarBtnRef}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20 hover:ring-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                </button>

                {dropdownOpen && (
                  <div
                    ref={userDropdownRef}
                    role="menu"
                    className="absolute right-0 mt-3 w-56 rounded-2xl bg-federal-blue/95 p-2 shadow-xl ring-1 ring-white/10 backdrop-blur"
                  >
                    <div className="flex flex-col">
                      <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                          `w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                              : "text-white/85 hover:text-emerald hover:bg-white/5"
                          }`
                        }
                      >
                        My Applications
                      </NavLink>
                      <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                          `w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                              : "text-white/85 hover:text-emerald hover:bg-white/5"
                          }`
                        }
                      >
                        Profile
                      </NavLink>
                      <div className="my-2 h-px bg-white/10" />
                      <button
                        className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/90 transition-colors hover:text-emerald hover:bg-white/5"
                        onClick={() => {
                          setDropdownOpen(false);
                          setIsLogged(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-federal-blue/95 shadow-lg ring-1 ring-white/10">
          <nav className="flex flex-col p-2">
            {/* Jobs with sort links */}
            <div className="flex flex-col">
              <span className="px-3 py-3 text-base font-semibold text-white/90">Jobs</span>
              {sortLinks.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `ml-4 rounded-xl px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "text-emerald bg-white/5"
                        : "text-white/85 hover:text-emerald hover:bg-white/5"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="my-3 h-px bg-white/10" />

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-base transition-colors ${
                    isActive
                      ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                      : "text-white/90 hover:text-emerald hover:bg-white/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="my-3 h-px bg-white/10" />

            {!isLogged ? (
              <div className="grid grid-cols-2 gap-2">
                <NavLink
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-base text-white/90 ring-1 ring-inset ring-white/20 transition-colors hover:text-emerald hover:ring-emerald/40"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald px-3 py-2 text-base font-medium text-federal-blue transition-opacity hover:opacity-90"
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="flex flex-col">
                <NavLink
                  to="/applications"
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-base transition-colors ${
                      isActive
                        ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                        : "text-white/90 hover:text-emerald hover:bg-white/5"
                    }`
                  }
                >
                  My Applications
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-base transition-colors ${
                      isActive
                        ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                        : "text-white/90 hover:text-emerald hover:bg-white/5"
                    }`
                  }
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsLogged(false);
                  }}
                  className="rounded-xl px-3 py-3 text-left text-base text-white/90 transition-colors hover:text-emerald hover:bg-white/5"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
