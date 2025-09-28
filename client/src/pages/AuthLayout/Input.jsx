import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  error,
  register,
  name,
  type = "text",
  placeholder,
  registerOptions = {},
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          {...register(name, registerOptions)}
          {...rest}
          className={`border p-2 w-full rounded pr-10 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default Input;
