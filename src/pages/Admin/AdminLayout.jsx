import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex flex-row min-h-[100vh] ">
      <AdminSidebar pageName={"Admin Panel"} />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
