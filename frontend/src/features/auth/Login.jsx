import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import api from "../../config/api";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Loader2,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  Activity,
  Sparkles,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      setLoadingSubmit(true);
      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      const { message, token, user } = response.data;

      if (message === "success") {
        login(user);
        localStorage.setItem("pos-token", token);
        toast.success("Authentication Successful");
        navigate("/dashboard");
      } else {
        toast.error(message || "Authentication Failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Connection Fault Detected");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual Infrastructure Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-500 font-medium">
              Enter your credentials to access your account
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] animate-slideUp">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@example.com"
                    disabled={loadingSubmit}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium shadow-sm ${
                      errors.email ? "border-rose-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs font-bold ml-1 animate-fadeIn">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loadingSubmit}
                    className={`w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium shadow-sm ${
                      errors.password ? "border-rose-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs font-bold ml-1 animate-fadeIn">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loadingSubmit ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-slate-500 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
            <div className="flex items-center gap-3 opacity-30 grayscale pointer-events-none">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                AES-256 Encryption Active
              </span>
            </div>
          </form>
        </div>

        {/* Footer Trademark */}
        <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          © 2025 HealthLens Clinical Registry
        </p>
      </div>
    </div>
  );
}

export default Login;
