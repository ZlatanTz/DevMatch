import AuthSidebar from "./AuthSidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Input from "./Input";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "@/schemas/loginSchemas";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("Forgot password email:", data);
    // TODO: Call API to send reset link
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[100vh]">
      <div className="flex flex-1 items-center justify-center p-8 order-2 lg:order-2">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Reset your password</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Enter your email address and we’ll send you instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              register={register}
              error={errors.email}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-federal-blue hover:bg-paynes-gray px-16 text-md text-white py-6 rounded"
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <div className="flex justify-center mt-4 text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
      <AuthSidebar pageName="Forgot password" />
    </div>
  );
};

export default ForgotPassword;
