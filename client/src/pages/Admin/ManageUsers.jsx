import { useEffect, useState, useMemo } from "react";
import ServerResponseWrapper from "@/components/ServerResponseWrapper";
import { getAllUsersAdmin, suspendUser } from "@/api/services/admin";
import { toast } from "react-hot-toast";
import SearchHeader from "./SearchHeader";
import UsersTable from "./UsersTable";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      setErrorStatus(null);

      try {
        const data = await getAllUsersAdmin();
        setUsers(data);
        setIsSuccess(true);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setErrorStatus(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, search]);

  const handleToggleSuspend = async (userId, nextSuspended) => {
    try {
      await suspendUser(userId, nextSuspended);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isSuspended: nextSuspended } : u)),
      );
      toast.success(nextSuspended ? "User suspended" : "User unsuspended");
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    }
  };

  console.log("users in admin: ", users);

  return (
    <ServerResponseWrapper
      isLoading={isLoading}
      isError={isError}
      isSuccess={isSuccess}
      errorStatus={errorStatus}
    >
      <div className="p-4 space-y-4 w-full">
        <h1 className="text-3xl font-bold  tracking-wide pb-2 border-b border-gray-200">
          All Users
        </h1>
        <SearchHeader value={search} onChange={setSearch} count={filteredUsers.length} />
        <UsersTable data={filteredUsers} onToggleSuspend={handleToggleSuspend} />
      </div>
    </ServerResponseWrapper>
  );
};

export default ManageUsers;
