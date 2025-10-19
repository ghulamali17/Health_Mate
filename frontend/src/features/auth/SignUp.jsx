import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import EyeIcon from "../../components/ui/EyeIcon";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../../components/ui/Header";
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
    }),
});

function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
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

        const response = await axios.get("https://health-mate-dcv3.vercel.app/api/users/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

    const formData = new FormData();
    formData.append("file", image[0]);
    formData.append("upload_preset", "smit_hackathon");
    formData.append("cloud_name", "dnvikqjp1");

    let imageUrl = "";

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dnvikqjp1/image/upload",
        formData
      );
      imageUrl = uploadRes.data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed");
      return;
    }

    try {
      const response = await axios.post(
        "https://health-mate-dcv3.vercel.app/api/users/register",
        {
          name: fullName,
          email,
          password,
          profileImage: imageUrl,
        }
      );

      alert("Successfully Registered");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col font-sans">
      <Header user={user} loadingUser={loadingUser} />
      <div className="flex-1 flex justify-center items-center px-4">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            HealthMate Signup
          </h2>

          {/* Name */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Name</label>
            <input
              {...register("fullName")}
              type="text"
              placeholder="Ali"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <EyeIcon
                visible={showPass}
                toggle={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600"
              />
            </div>
            <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Profile Image</label>
            <input
              {...register("image")}
              type="file"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 file:font-medium"
            />
            <p className="text-sm text-red-500 mt-1">{errors.image?.message}</p>
          </div>

          {/* Submit */}
          <Button
            className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 font-medium py-3 rounded-lg transition-opacity"
            type="submit"
          >
            Sign Up
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