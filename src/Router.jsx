import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import App from "./App";
import JobDetails from "./pages/JobDetails";
import Jobs from "./pages/Jobs";
import EditProfile from "./pages/EditProfile";
import MySubmits from "./pages/MySubmits";
import Profile from "./pages/Profile";
import Register from "./pages/AuthLayout/Register";
import Login from "./pages/AuthLayout/Login";

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
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <JobDetails /> },
      { path: "my-submits", element: <MySubmits /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/edit/:id", element: <EditProfile /> }
    ],
  },
]);