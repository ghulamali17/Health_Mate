import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../config/api";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  UploadCloud,
  ChevronRight,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .max(20, "Max 20 characters")
    .required("Password is required"),
  image: yup
    .mixed()
    .required("Profile photo is required")
    .test(
      "fileExist",
      "Profile photo is required",
      (value) => value && value.length > 0,
    )
    .test(
      "fileSize",
      "Max image size: 5MB",
      (value) => value && value[0] && value[0].size <= 5242880,
    ),
});

function Signup() {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const { fullName, email, password, image } = data;

    try {
      setLoadingSubmit(true);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append("file", image[0]);
      formData.append("upload_preset", "smit_hackathon");
      formData.append("cloud_name", "dnvikqjp1");

      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dnvikqjp1/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 70) / progressEvent.total,
            );
            setUploadProgress(10 + percentCompleted);
          },
        },
      );

      const imageUrl = uploadRes.data.secure_url;
      setUploadProgress(90);

      await api.post("/api/users/register", {
        name: fullName,
        email,
        password,
        profileImage: imageUrl,
      });

      setUploadProgress(100);
      toast.success("Account created successfully. Please sign in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.error || "Failed to create account");
    } finally {
      setLoadingSubmit(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 font-medium">
            Join HealthLens to start tracking your health
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] animate-slideUp overflow-hidden relative">
          {loadingSubmit && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="John Doe"
                    disabled={loadingSubmit}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium shadow-sm"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-rose-500 text-xs font-bold ml-1 animate-fadeIn">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium shadow-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs font-bold ml-1 animate-fadeIn">
                    {errors.email.message}
                  </p>
                )}
              </div>
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
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium shadow-sm"
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                Profile Photo
              </label>
              <div className="relative group/upload">
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  disabled={loadingSubmit}
                  className="hidden"
                  id="identity-upload"
                  onChange={(e) => {
                    if (e.target.files[0])
                      setSelectedFileName(e.target.files[0].name);
                    register("image").onChange(e);
                  }}
                />
                <label
                  htmlFor="identity-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-8 bg-slate-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer text-center group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4">
                    <UploadCloud className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 tracking-tight">
                    {selectedFileName || "Click to upload photo"}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    JPEG, PNG, WEBP (Max 5MB)
                  </p>
                </label>
                {errors.image && (
                  <p className="text-rose-500 text-xs font-bold ml-1 mt-2">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loadingSubmit ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign Up
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
