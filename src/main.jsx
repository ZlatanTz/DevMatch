import { createRoot } from "react-dom/client";
import "./main.css";
import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { SkillsProvider } from "./context/SkillsProvider";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SkillsProvider>
      <RouterProvider router={router} />
    </SkillsProvider>
  </AuthProvider>,
);
