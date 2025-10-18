import EyeIcon from "../../components/ui/EyeIcon";
import Button from "../../components/Ui/Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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
        "http://localhost:3001/api/users/register",
        {
          name: fullName,
          email,
          password,
          profileImage: imageUrl,
        }
      );

      alert("Successfully Registered");

      // Send email
      try {
        const response = await axios.post(
          "http://localhost:3001/api/users/send-email",
          { name: fullName, email }
        );
        console.log("Email sent:", response.data);
      } catch (err) {
        console.warn("Email not sent:", err);
      }
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEE] flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6"
      >
        <h2 className="text-2xl font-bold text-primary text-center">
          Hackathon Registration
        </h2>

        {/* Name */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Name</label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Ali"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="ali@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
            <EyeIcon
              visible={showPass}
              toggle={() => setShowPass((prev) => !prev)}
            />
          </div>
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block text-gray-800 font-medium mb-1">
            Profile Image
          </label>
          <input
            {...register("image")}
            type="file"
            className="w-full border rounded p-2 bg-gray-50"
          />
          <p className="text-red-500 text-sm">{errors.image?.message}</p>
        </div>

        {/* Submit */}
        <Button
          className="w-full cursor-pointer bg-primary hover:bg-white hover:border hover:border-primary text-white hover:text-primary transition duration-200"
          type="submit"
        >
          Sign Up
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
