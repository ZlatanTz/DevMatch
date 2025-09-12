import { Controller } from "react-hook-form";
import Select from "react-select";

const MultiSelect = ({ options, name, control, label, error, isDisabled, isMulti = false }) => {
  return (
    <div className="mb-4 min-w-[220px]">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti={isMulti}
            isDisabled={isDisabled}
            classNamePrefix="react-select"
            value={
              isMulti
                ? options.filter(
                    (opt) => Array.isArray(field.value) && field.value.includes(opt.value),
                  )
                : options.find((opt) => opt.value === field.value) || null
            }
            onChange={(selected) => {
              if (isMulti) {
                field.onChange(selected ? selected.map((opt) => opt.value) : []);
              } else {
                field.onChange(selected ? selected.value : "");
              }
            }}
            onBlur={field.onBlur}
          />
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default MultiSelect;
