import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { formatDateIso } from "@/utils/helpers";

const RowMenu = ({ row, onToggleSuspend }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleView = () => {
    handleClose();
    navigate(`/profile/${row.id}`);
  };

  const handleSuspend = () => {
    handleClose();
    onToggleSuspend(row.id, !row.isSuspended);
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={handleView}>View details</MenuItem>
        <MenuItem onClick={handleSuspend}>
          {row.isSuspended ? "Unsuspend user" : "Suspend user"}
        </MenuItem>
      </Menu>
    </>
  );
};

const UsersTable = ({ data, onToggleSuspend }) => {
  const columns = [
    { field: "email", headerName: "Email", flex: 1.4, minWidth: 220 },
    {
      field: "roleName",
      headerName: "Role",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => <Chip label={params.value} variant="outlined" size="small" />,
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 0.6,
      minWidth: 100,
      type: "boolean",
    },

    {
      field: "isSuspended",
      headerName: "Suspended",
      flex: 0.8,
      minWidth: 120,
      type: "boolean",
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 0.8,
      minWidth: 120,
      valueFormatter: ({ value }) => formatDateIso(value),
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      flex: 0.8,
      minWidth: 120,
      valueFormatter: ({ value }) => formatDateIso(value),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      disableExport: true,
      align: "right",
      headerAlign: "right",
      flex: 0.4,
      minWidth: 60,
      renderCell: (params) => <RowMenu row={params.row} onToggleSuspend={onToggleSuspend} />,
    },
  ];

  const rows = data;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-2">
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
      />
    </div>
  );
};

export default UsersTable;
