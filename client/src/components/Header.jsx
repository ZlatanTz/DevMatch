import { NavLink, useLocation, useNavigation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/devmatch.svg";
import { useAuth } from "../context/AuthContext";

const navItems = [
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
  const { user, logout } = useAuth();
  const [isLogged, setIsLogged] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [selectedJobSort, setSelectedJobSort] = useState(""); // novo
  const hideJobsTimeout = useRef(null);

  const location = useLocation();
  const avatarBtnRef = useRef(null);
  const userDropdownRef = useRef(null);
  const nav = useNavigation();
  const isLoading = nav.state !== "idle";

  // const route =
  //   user.role.name === "candidate"
  //     ? "/applications"
  //     : user.role.name === "employer"
  //       ? "/jobpostings"
  //       : "/admin";

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    if (user != null) {
      setIsLogged(true);
    }
  }, [location.pathname, user]);

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
    <>
      {isLoading && (
        <div className="fixed inset-x-0 top-0 h-1 bg-emerald/80 animate-pulse z-[9999]" />
      )}

      <header className="bg-federal-blue text-white sticky top-0 z-50 border-b border-white/10 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <NavLink to="/" className="shrink-0">
              <img src={logo} alt="Logo" className="h-15 w-60 p-2" />
            </NavLink>

            <nav className="hidden items-center gap-1 md:flex">
              <NavLink
                to="/"
                className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                onClick={() => {
                  setSelectedJobSort("");
                }}
              >
                Home
              </NavLink>

              {/* Desktop Jobs dropdown */}
              <div
                className="relative"
                onMouseEnter={() => {
                  clearTimeout(hideJobsTimeout.current);
                  setJobsOpen(true);
                }}
                onMouseLeave={() => {
                  hideJobsTimeout.current = setTimeout(() => setJobsOpen(false), 150);
                }}
              >
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive} inline-flex items-center`
                  }
                  onClick={() => {
                    setSelectedJobSort("Newest");
                  }}
                >
                  Jobs
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </NavLink>

                {jobsOpen && (
                  <div className="absolute left-0 top-full pt-2 transition duration-150 ease-out">
                    <div className="w-64 rounded-xl bg-federal-blue/95 p-2 shadow-lg ring-1 ring-white/10 backdrop-blur">
                      {sortLinks.map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-sm transition-colors ${
                              selectedJobSort === item.label
                                ? "rounded-xl text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                                : "text-white/85 hover:text-emerald hover:bg-white/5"
                            }`
                          }
                          onClick={() => setSelectedJobSort(item.label)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                  onClick={() => {
                    setSelectedJobSort("");
                  }}
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
                    <img src={user.img} alt="Profile" className="h-full w-full object-cover" />
                  </button>

                  {dropdownOpen && (
                    <div
                      ref={userDropdownRef}
                      role="menu"
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-federal-blue/95 p-2 shadow-xl ring-1 ring-white/10 backdrop-blur"
                    >
                      <div className="flex flex-col">
                        {user?.employer ? (
                          <NavLink
                            to="/my-jobs"
                            className={({ isActive }) =>
                              `w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                                isActive
                                  ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                                  : "text-white/85 hover:text-emerald hover:bg-white/5"
                              }`
                            }
                          >
                            My Jobs
                          </NavLink>
                        ) : user?.candidate ? (
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
                        ) : null}
                        <NavLink
                          to={`/profile/${user.id}`}
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
                            logout();
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
                <div
                  onClick={() => setJobsOpen((v) => !v)}
                  className="flex items-center justify-between px-3 py-3"
                >
                  <button className="text-base font-semibold text-white/90">Jobs</button>
                  <button
                    onClick={() => setJobsOpen((v) => !v)}
                    className="text-white/70 hover:text-emerald"
                  >
                    {jobsOpen ? "▲" : "▼"}
                  </button>
                </div>

                {jobsOpen && (
                  <div className="flex flex-col ml-4">
                    {sortLinks.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) =>
                          `rounded-xl px-3 py-2 text-base transition-colors ${
                            selectedJobSort === item.label
                              ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                              : "text-white/85 hover:text-emerald hover:bg-white/5"
                          }`
                        }
                        onClick={() => {
                          setSelectedJobSort(item.label);
                          setMobileOpen(false);
                        }}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
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
                  onClick={() => {
                    setSelectedJobSort("");
                  }}
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
                  {user?.employer ? (
                    <NavLink
                      to="/my-jobs"
                      className={({ isActive }) =>
                        `w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "text-emerald bg-white/5 ring-1 ring-inset ring-emerald/30"
                            : "text-white/85 hover:text-emerald hover:bg-white/5"
                        }`
                      }
                    >
                      My Jobs
                    </NavLink>
                  ) : user?.candidate ? (
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
                  ) : null}
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
                      logout();
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
    </>
  );
}
