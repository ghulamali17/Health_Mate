import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import EyeIcon from "../../components/ui/EyeIcon";
import axios from "axios";
import api from "../../config/api"; // Import centralized API
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col font-sans">
      <Header user={user} loadingUser={loadingUser} />
      <div className="flex-1 flex justify-center items-center px-4 py-8">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            HealthMate Signup
          </h2>

          {/* Progress bar */}
          {loadingSubmit && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-2 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Name</label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Ali"
              disabled={loadingSubmit}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
              }`}
            />
            <p className="text-sm text-red-500 mt-1">{errors.fullName?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="ali@gmail.com"
              disabled={loadingSubmit}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
              }`}
            />
            <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                disabled={loadingSubmit}
                className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  loadingSubmit ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
                }`}
              />
              <EyeIcon
                visible={showPass}
                toggle={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800"
              />
            </div>
            <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">
              Profile Image
            </label>
            <input
              {...register("image")}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              disabled={loadingSubmit}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 file:font-medium hover:file:bg-green-200 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed bg-gray-50" : "bg-gray-50"
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Max size: 5MB. Formats: JPG, PNG, WEBP
            </p>
            <p className="text-sm text-red-500 mt-1">{errors.image?.message}</p>
          </div>

          {/* Submit */}
          <Button
            className={`w-full bg-gradient-to-br from-green-500 to-green-600 text-white hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 font-medium py-3 rounded-lg transition-opacity flex items-center justify-center ${
              loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <>
                <Loader2 className="w-5 h-5 text-white animate-spin mr-2" />
                {uploadProgress < 80 ? "Uploading..." : "Creating account..."}
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;