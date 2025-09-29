import { TextField } from "@mui/material";

const SearchHeader = ({ value, onChange, count }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <TextField
        size="small"
        label="Search by email"
        placeholder="e.g. cand2@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="text-sm text-gray-500">
        {count} result{count === 1 ? "" : "s"}
      </span>
    </div>
  );
};

export default SearchHeader;
