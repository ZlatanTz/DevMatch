import React from "react";
import logo from "../../assets/devmatch.svg";

const AuthSidebar = ({ pageName, currentStep }) => {
  return (
    <div className="w-full lg:w-1/5 flex flex-col order-2 lg:order-1 justify-between items-center bg-gradient-to-br from-dark-purple to-federal-blue text-white">
      <div className="w-full flex flex-col gap-22 md:gap-12">
        <div className="w-full flex justify-center">
          <div className="flex flex-col gap-2 w-35 xl:w-55 items-center mt-12">
            {/* <h1 className=" text-3xl xl:text-5xl font-bold">DevMatch</h1> */}
            <img src={logo} alt="" />
            <span className="text-sm xl:text-xl font-bold self-start">{pageName}</span>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-start pl-5">
          {/* steps */}
          {currentStep && (
            <ul className="flex flex-col gap-6 text-xs xl:text-md 2xl:text-sm">
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
      <div className="text-sm my-12 md:my-4 px-2 text-start">
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
