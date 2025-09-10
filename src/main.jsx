import { createRoot } from "react-dom/client";
import "./main.css";
import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { SkillsProvider } from "./context/SkillsProvider";

createRoot(document.getElementById("root")).render(
  <SkillsProvider>
    <RouterProvider router={router} />
  </SkillsProvider>,
);
