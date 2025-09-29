import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, Chip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const RowMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleView = () => {
    handleClose();
    navigate(`/jobs/${row.id}`);
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
      </Menu>
    </>
  );
};

const JobsTable = ({ data }) => {
  const columns = [
    { field: "title", headerName: "Title", flex: 1.4, minWidth: 220 },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={p.value === "open" ? "success" : "default"}
          size="small"
          variant="outlined"
        />
      ),
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
      renderCell: (params) => <RowMenu row={params.row} />,
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

export default JobsTable;
