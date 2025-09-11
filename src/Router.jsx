import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import App from "./App";
import JobDetails from "./pages/JobDetails";
import { Jobs } from "./pages/Jobs";
import { jobsLoader } from "./routes/loaders/jobsLoader";
import EditProfile from "./pages/EditProfile";
import MySubmits from "./pages/MySubmits";
import Profile from "./pages/Profile";
import Register from "./pages/AuthLayout/Register";
import Login from "./pages/AuthLayout/Login";
import ErrorPage from "./pages/ErrorPages/ErrorPage";
import { profileLoader, updateProfileLoader } from "./routes/loaders/profileLoader";
import ForgotPassword from "./pages/AuthLayout/ForgotPassword";
import Contact from "./pages/Contact";
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
        loader: jobsLoader,
        errorElement: <ErrorPage />,
      },
      { path: "my-submits", element: <MySubmits /> },
      { path: "contact", element: <Contact /> },
      { path: "profile", element: <Profile />, loader: profileLoader },
      { path: "profile/edit/:id", element: <EditProfile />, loader: updateProfileLoader },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
