import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import App from "./App";
import JobDetails from "./pages/JobDetails";
import { Jobs } from "./pages/Jobs";
import { jobsLoader } from "./routes/loaders/jobsLoader";
import { jobLoader } from "./routes/loaders/jobLoader";
import EditProfile from "./pages/EditProfile";
import MySubmits from "./pages/MySubmits";
import Profile from "./pages/Profile";
import Register from "./pages/AuthLayout/Register";
import Login from "./pages/AuthLayout/Login";
import ErrorPage from "./pages/ErrorPages/ErrorPage";
// import { profileLoader } from "./routes/loaders/profileLoader";
import ForgotPassword from "./pages/AuthLayout/ForgotPassword";
import Statistics from "./pages/Admin/Statistics";
import ManageJobs from "./pages/Admin/ManageJobs";
import ManageUsers from "./pages/Admin/ManageUsers";
import AdminLayout from "./pages/Admin/AdminLayout";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MyJobSubmits from "./pages/MyJobSubmits";
import ProtectedRoute from "./guards/ProtecedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "jobs", element: <Jobs />, loader: jobsLoader },
      {
        path: "jobs/:id",
        element: <JobDetails />,
        loader: jobLoader,
        errorElement: <ErrorPage />,
      },
      { path: "applications", element: <MySubmits />, loader: jobsLoader },
      { path: "my-jobs", element: <MyJobSubmits />, loader: jobsLoader },
      { path: "contact", element: <Contact /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "profile/:id/edit", element: <EditProfile /> },
      { path: "about", element: <About /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <ManageUsers /> },
          { path: "jobs", element: <ManageJobs /> },
          { path: "statistics", element: <Statistics /> },
        ],
      },
    ],
  },
  {
    path: "*",

    element: <ErrorPage />,
  },
]);
