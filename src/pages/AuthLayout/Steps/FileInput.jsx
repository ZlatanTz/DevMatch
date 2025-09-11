const FileInput = ({ label, name, register, error, accept }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <input
        type="file"
        {...register(name)}
        accept={accept}
        className={`block w-full text-sm text-gray-900 border rounded cursor-pointer 
          file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 
          file:text-sm file:font-semibold 
          file:bg-blue-50 file:text-blue-700 
          hover:file:bg-blue-100
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FileInput;
