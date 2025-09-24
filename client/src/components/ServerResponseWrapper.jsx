import React from "react";

const ServerResponseWrapper = ({ isLoading, isError, isSuccess, children, errorStatus }) => {
  return (
    <>
      {isLoading && (
        <div className="flex flex-col w-full items-center gap-4 my-10">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl">Loading...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col w-full items-center">
          <p className="text-2xl">
            {errorStatus === 500 ? "Something went wrong" : "No results found"}
          </p>
        </div>
      )}

      {isSuccess && !isError && !isLoading && children}
    </>
  );
};

export default ServerResponseWrapper;
