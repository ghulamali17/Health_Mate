import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Ui/Button";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          email,
          password,
        }
      );

      const { message, token, user } = response.data;

      if (message === "success") {
        login(user);
        localStorage.setItem("pos-token", token);
        alert("Successfully logged in");
        navigate("/");
      } else if (message === "No record found") {
        alert("No user found with this email");
      } else if (message === "Incorrect password") {
        alert("Incorrect password");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEE] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6"
      >
        <h2 className="text-2xl font-bold text-primary text-center">
          Hackathon Login
        </h2>

        {/* Email Field */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="ali@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-sm text-red-500">{errors.password?.message}</p>
        </div>

        <Button className="w-full cursor-pointer bg-primary hover:bg-white hover:border hover:border-primary text-white hover:text-primary transition duration-200">
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
