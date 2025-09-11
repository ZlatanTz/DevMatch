import React from "react";

const AuthSidebar = ({ pageName, currentStep }) => {
  return (
    <div className="w-full md:w-1/5 flex flex-col justify-between items-center bg-gradient-to-br from-dark-purple to-federal-blue text-white">
      <div className="mt-22 ml-18 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold">DevMatch</h1>
          <p className=" text-xl font-bold">{pageName}</p>
        </div>
        <div>
          {/* steps */}
          {currentStep && (
            <ul className="flex flex-col gap-6">
              <li className="flex flex-row gap-3 items-center">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${currentStep >= 1 ? "bg-emerald-500" : "bg-orange-300"}`}
                >
                  1
                </span>
                Choose account type
              </li>
              <li className="flex flex-row gap-3 items-center">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${currentStep >= 2 ? "bg-emerald-500" : "bg-orange-300"}`}
                >
                  2
                </span>
                Tell us more about yourself
              </li>
              <li className="flex flex-row gap-3 items-center">
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white ${currentStep >= 3 ? "bg-emerald-500" : "bg-orange-300"}`}
                >
                  3
                </span>
                You're all set
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="text-sm my-4 px-2 text-start">
        <p>devmatch.com</p>
        <p>All right reserved to Devmatch ltd.</p>
        <p>
          <a href="#">Terms and conditions</a> | <a href="#">Support center</a>
        </p>
      </div>
    </div>
  );
};

export default AuthSidebar;
