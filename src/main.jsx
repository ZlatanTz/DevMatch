import { createRoot } from "react-dom/client";
import "./main.css";
import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { SkillsProvider } from "./context/SkillsProvider";
import { AuthProvider } from "./context/AuthContext";
import { SkeletonStyles } from "./components/Skeleton";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SkillsProvider>
      <SkeletonStyles />
      <RouterProvider router={router} />
    </SkillsProvider>
  </AuthProvider>,
);
