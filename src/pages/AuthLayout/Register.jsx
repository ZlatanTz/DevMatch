import { Button } from "@/components/ui/button";
import { useState } from "react";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import { MoveLeft } from "lucide-react";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("candidate");

  const STEPS = ["candidate", "employer"];

  const handleNext = () => setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  const handlePrev = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="flex w-full h-[100vh]">
      <div className="w-1/5 flex flex-col justify-between items-center bg-federal-blue text-white">
        <div className="mt-22 ml-25 w-full flex flex-col gap-12">
          <div>
            <h1 className="text-4xl font-bold">DevMatch</h1>
            <p>Signup</p>
          </div>
          <div>
            {/* steps */}
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
      <div className="w-4/5 flex flex-col items-center mt-6+2 justify-start">
        <div className="flex flex-col justify-around items-center gap-12 w-full h-full">
          <div className="flex flex-col gap-12 w-2/3">
            <div className="text-center">
              <h3 className="text-3xl font-bold p-3">
                {currentStep === 1 ? "Choose your account type" : "Tell us more about yourself"}
              </h3>
              <span className="text-xl">Step {currentStep}/3</span>
            </div>
            <div className="w-full flex justify-center">
              {currentStep === 1 && <StepOne role={role} setRole={setRole} />}
              {currentStep === 2 && <StepTwo role={role} />}
            </div>
          </div>
          <div className="w-full flex flex-row justify-around">
            {currentStep === 1 ? (
              <div></div>
            ) : (
              <Button
                className="text-md px-18 py-6"
                onClick={handlePrev}
                disabled={currentStep < 2}
                variant="ghost"
              >
                <MoveLeft />
                Previous step
              </Button>
            )}
            <Button
              className="bg-federal-blue hover:bg-paynes-gray px-18 py-6 text-md"
              onClick={handleNext}
              disabled={!role}
            >
              {currentStep === STEPS.length ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
