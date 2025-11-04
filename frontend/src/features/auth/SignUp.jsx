import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import EyeIcon from "../../components/ui/EyeIcon";
import axios from "axios";
import api from "../../config/api";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../../components/ui/Header";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "./styles.css";

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 chars")
    .max(20, "Max 20 chars")
    .required("Password is required"),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileExist", "Profile Image required", (value) => {
      return value && value.length > 0;
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && value[0] && value[0].size <= 5242880; // 5MB
    })
    .test("fileType", "Only image files are allowed", (value) => {
      return (
        value &&
        value[0] &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          value[0].type
        )
      );
    }),
});

function Signup() {
  const [selectedFileName, setSelectedFileName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoadingUser(true);
        const token = localStorage.getItem("pos-token");
        if (!token) return;

        const response = await api.get("/api/users/current");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const submitHandler = async (data) => {
    const { fullName, email, password, image } = data;

    try {
      setLoadingSubmit(true);
      setUploadProgress(10);

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image[0]);
      formData.append("upload_preset", "smit_hackathon");
      formData.append("cloud_name", "dnvikqjp1");

      setUploadProgress(30);
      
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dnvikqjp1/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 50) / progressEvent.total
            );
            setUploadProgress(30 + percentCompleted);
          },
        }
      );

      const imageUrl = uploadRes.data.secure_url;
      setUploadProgress(80);

      // Register user
      const response = await api.post("/api/users/register", {
        name: fullName,
        email,
        password,
        profileImage: imageUrl,
      });

      setUploadProgress(100);
      toast.success("Successfully registered! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      
      if (err.message.includes("cloudinary")) {
        toast.error("Image upload failed. Please try again.");
      } else if (err.response?.status === 409) {
        toast.error("Email already exists. Please login.");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.error || "Invalid data provided");
      } else if (err.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(err.response?.data?.error || "Registration failed");
      }
    } finally {
      setLoadingSubmit(false);
      setUploadProgress(0);
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-green-50 to-white font-sans">
  {/* <Header user={user} loadingUser={loadingUser} /> */}
  
  <div className="flex justify-center items-start py-8 px-4">
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="bg-white rounded-3xl shadow-lg border border-green-100 p-8 space-y-6"
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join HealthMate</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Progress Bar */}
        {loadingSubmit && uploadProgress > 0 && (
          <div className="bg-gray-100 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-2 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Name and Email in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Enter your full name"
                disabled={loadingSubmit}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                disabled={loadingSubmit}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPass ? "text" : "password"}
                placeholder="Create a password"
                disabled={loadingSubmit}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPass ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Profile Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-400 transition-colors duration-200">
              <input
                {...register("image")}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                disabled={loadingSubmit}
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFileName(file.name);
                  }
                  // Call the original register onChange
                  register("image").onChange(e);
                }}
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">Click to upload profile image</span>
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB • JPG, PNG, WEBP</p>
              </label>
              
              {/* Show selected file name */}
              {selectedFileName && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Selected: {selectedFileName}
                  </p>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.image.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loadingSubmit}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
        >
          {loadingSubmit ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              {uploadProgress < 80 ? "Uploading..." : "Creating account..."}
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:text-green-700 underline transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>
  );
}

export default Signup;