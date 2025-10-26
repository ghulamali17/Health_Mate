import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import api from "../../config/api"; 
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../../components/ui/Header";
import { Loader2 } from "lucide-react";
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
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
        toast.success("Successfully logged in");
        navigate("/");
      } else if (message === "No record found") {
        toast.error("No user found with this email");
      } else if (message === "Incorrect password") {
        toast.error("Incorrect password");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      
      // Better error handling
      if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col font-sans">
      <Header user={user} loadingUser={loadingUser} />
      <div className="flex-1 flex justify-center items-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            HealthMate Login
          </h2>

          {/* Email Field */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="ali@gmail.com"
              disabled={loadingSubmit}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-800 font-medium mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              disabled={loadingSubmit}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <p className="text-sm text-red-500 mt-1">{errors.password?.message}</p>
          </div>

          <Button
            className={`w-full bg-gradient-to-br from-green-500 to-green-600 text-white hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 font-medium py-3 rounded-lg transition-opacity flex items-center justify-center ${
              loadingSubmit ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <>
                <Loader2 className="w-5 h-5 text-white spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-green-500 font-semibold hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;