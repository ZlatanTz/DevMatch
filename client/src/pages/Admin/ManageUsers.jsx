import { getAllUsers } from "@/api/services/users";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllUsers();
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch users:", e);
        if (mounted) setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleAskDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    try {
      setDeleting(true);
      setUsers((prev) => prev.filter((j) => j.id !== pendingDeleteId));
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const hasData = useMemo(() => users && users.length > 0, [users]);

  return (
    <div className="w-full space-y-6 flex flex-col items-center">
      <div className="flex items-center justify-between w-9/10 h-16">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Users</h1>
        <span className="text-sm text-muted-foreground">
          {hasData ? `${users.length} total` : ""}
        </span>
      </div>

      <div className="rounded-lg border w-9/10">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Full name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[64px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : !hasData ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name ?? "—"}</TableCell>
                    <TableCell>{user.email ?? "—"}</TableCell>
                    <TableCell>{user.role ?? "—"}</TableCell>
                    <TableCell>{user.location.seniority ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <RowActions
                        onView={() => navigate(`users/${user.id}`)}
                        onDelete={() => handleAskDelete(user.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={deleting} onClick={handleConfirmDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function RowActions({ onView, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onView}>View details</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={onDelete}>
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ManageUsers;
