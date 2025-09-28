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
import AuthSidebar from "./AuthSidebar";
import { registerCandidate, registerEmployer } from "@/api/services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { uploadFileService } from "@/api/services/uploadFiles";
const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("candidate");
  const STEPS = ["candidate", "employer"];
  const isLastStep = currentStep === STEPS.length;
  const { login } = useAuth();

  const handleNext = () => setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  const handlePrev = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const schema = role === "candidate" ? candidateRegistrationSchema : employerRegistrationSchema;

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onchange",
    defaultValues: {
      prefers_remote: true,
    },
  });

  const SERVICES = {
    candidate: registerCandidate,
    employer: registerEmployer,
  };

  const onSubmit = async (formData) => {
    const registerData = { ...formData, role };
    console.log(formData.companyLogoPicture);

    try {
      const service = SERVICES[role];
      if (!service) throw new Error(`Unsupported role: ${role}`);
      const data = await service(registerData);

      localStorage.setItem("token", data.access_token);
      await login({ email: formData.email, password: formData.password });

      // TEMPORARY
      const inputVal = formData.companyLogoPicture;
      const file =
        inputVal instanceof File ? inputVal : Array.isArray(inputVal) ? inputVal[0] : inputVal?.[0];

      if (file) {
        const logoUrl = await uploadFileService(file);
        console.log("Cloudinary URL:", logoUrl);
      } else {
        console.log("No file found for companyLogoPicture");
      }

      toast.success("Account created. Welcome aboard!");
      navigate("/");
    } catch (error) {
      setError("email", { type: "server", message: error.message });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[100vh] items-center lg:items-stretch">
      <AuthSidebar pageName={"Signup"} currentStep={currentStep} />
      <div className="w-full md:w-4/5 flex flex-col items-center mt-8 order-1 lg:order-2">
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
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:justify-between my-12 px-4">
            {currentStep === 1 ? (
              <div className="hidden sm:block" />
            ) : (
              <Button
                className="w-full sm:w-auto text-md px-8 py-4 sm:px-12 md:px-18 lg:px-16"
                onClick={handlePrev}
                disabled={currentStep < 2}
                variant="ghost"
              >
                <MoveLeft className="mr-2" />
                Previous step
              </Button>
            )}
            <Button
              className="w-full sm:w-auto bg-federal-blue hover:bg-paynes-gray text-md px-8 py-4 sm:px-12 md:px-18 lg:px-16"
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
