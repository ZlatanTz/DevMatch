import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { getAllJobs } from "@/api/services/jobs";

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

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllJobs();
        if (mounted) setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
        if (mounted) setJobs([]);
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
      // await deleteJob(pendingDeleteId);
      setJobs((prev) => prev.filter((j) => j.id !== pendingDeleteId));
    } catch (e) {
      console.error("Delete failed:", e);
      // po želji: toast.error("Failed to delete job");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const formatDate = (dt) => {
    if (!dt) return "—";
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(dt));
    } catch {
      return String(dt);
    }
  };

  const hasData = useMemo(() => jobs && jobs.length > 0, [jobs]);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Manage Jobs</h1>
        <span className="text-sm text-muted-foreground">
          {hasData ? `${jobs.length} total` : ""}
        </span>
      </div>

      {/* Container s horizontalnim scrollom SAMO za tabelu */}
      <div className="rounded-lg border bg-white">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Seniority</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead className="w-[64px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                // jednostavan loading state
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading jobs…
                  </TableCell>
                </TableRow>
              ) : !hasData ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No jobs found.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title ?? "—"}</TableCell>
                    <TableCell>{job.company ?? "—"}</TableCell>
                    <TableCell>{job.location ?? "—"}</TableCell>
                    <TableCell>{job.seniority ?? "—"}</TableCell>
                    <TableCell>{formatDate(job.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <RowActions
                        onView={() => navigate(`/jobs/${job.id}`)}
                        onDelete={() => handleAskDelete(job.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* AlertDialog za potvrdu brisanja */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job will be permanently removed.
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
          Delete job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ManageJobs;
