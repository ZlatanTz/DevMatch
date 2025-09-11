import { Button } from "@/components/ui/button";
import { useState } from "react";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import { MoveLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateRegistrationSchema,
  employerRegistrationSchema,
} from "@/schemas/registrationSchemas";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthSidebar from "./AuthSidebar";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("candidate");
  const navigate = useNavigate();

  const STEPS = ["candidate", "employer"];
  const isLastStep = currentStep === STEPS.length;

  const handleNext = () => setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  const handlePrev = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const schema = role === "candidate" ? candidateRegistrationSchema : employerRegistrationSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onchange",
  });

  const onSubmit = (data) => {
    const registerData = {
      ...data,
      role: role,
    };
    // TODO: Call register service
    console.log(registerData);
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[100vh]">
      <AuthSidebar pageName={"Signup"} currentStep={currentStep} />
      <div className="w-4/5 flex flex-col items-center mt-8">
        <div className="flex flex-col w-full h-full max-w-4xl">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold p-3">
              {currentStep === 1 ? "Choose your account type" : "Tell us more about yourself"}
            </h3>
            <span className="text-xl">Step {currentStep}/3</span>
          </div>

          {/* MAIN */}
          <div className="flex-1 flex justify-center items-start">
            {currentStep === 1 && <StepOne role={role} setRole={setRole} />}
            {currentStep === 2 && (
              <StepTwo role={role} register={register} errors={errors} control={control} />
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between my-12">
            {currentStep === 1 ? (
              <div></div>
            ) : (
              <Button
                className="text-md px-16 py-6"
                onClick={handlePrev}
                disabled={currentStep < 2}
                variant="ghost"
              >
                <MoveLeft />
                Previous step
              </Button>
            )}
            <Button
              className="bg-federal-blue hover:bg-paynes-gray px-16 py-6 text-md"
              onClick={isLastStep ? handleSubmit(onSubmit) : handleNext}
              disabled={!role}
            >
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
