import AuthSidebar from "./AuthSidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema } from "@/schemas/loginSchemas";
import Input from "./Input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("Login datas:", data);
    // TODO: Call API service
    navigate("/");
  };
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[100vh]">
      <div className="flex flex-1 items-center justify-center p-8 order-2 lg:order-2">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Log in to your account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              register={register}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              register={register}
              error={errors.password}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-federal-blue hover:bg-paynes-gray px-16 text-md text-white py-6  rounded"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="flex justify-between mt-4 text-sm">
            <Link to="/register" className="text-blue-600 hover:underline">
              Don’t have an account? Sign up
            </Link>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
      <AuthSidebar pageName={"Log in"} />
    </div>
  );
};

export default Login;
