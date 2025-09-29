import AuthSidebar from "./AuthSidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { loginSchema } from "@/schemas/loginSchemas";
import Input from "./Input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { login, user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!user) return;

    if (user.role?.name === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate(from || "/", { replace: true });
    }
  }, [user, navigate, from]);

  const onSubmit = async (formData) => {
    try {
      await login(formData);
    } catch (error) {
      setError("email", { type: "server", message: error.message });
      setError("password", { type: "server", message: error.message });
    }
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
