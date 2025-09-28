import { createRoot } from "react-dom/client";
import "./main.css";
import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { SkillsProvider } from "./context/SkillsProvider";
import { AuthProvider } from "./context/AuthContext";
import { SkeletonStyles } from "./components/Skeleton";
import { ThemeProvider } from "./context/ThemeProvider";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <SkillsProvider>
        <SkeletonStyles />
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </SkillsProvider>
    </ThemeProvider>
  </AuthProvider>,
);
