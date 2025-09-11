import { Controller } from "react-hook-form";
import Select from "react-select";

const MultiSelect = ({ name, control, label, error }) => {
  const options = [
    { value: 1, label: "React" },
    { value: 2, label: "Vue" },
    { value: 3, label: "Angular" },
    { value: 4, label: "FastAPI" },
    { value: 5, label: "Djnago" },
  ];

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti
            classNamePrefix="react-select"
            onChange={(selected) => {
              field.onChange(selected ? selected.map((opt) => opt.value) : []);
            }}
            value={options.filter((opt) => field.value?.includes(opt.value))}
          />
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default MultiSelect;
