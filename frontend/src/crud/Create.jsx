import React from "react";
import axios from "axios";
import Button from "../components/Ui/Button";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  description: yup.string().required("Description is required"),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileExist", "Image file is required", (value) => {
      return value && value.length > 0;
    }),
});

function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitHandler = async (data) => {
    const { title, description, price, image } = data;

    setLoading(true);

    const uploadData = new FormData();
    uploadData.append("file", image[0]);
    uploadData.append("upload_preset", "smit_hackathon");
    uploadData.append("cloud_name", "dnvikqjp1");

    let imageUrl = "";

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dnvikqjp1/image/upload",
        uploadData
      );
      imageUrl = uploadRes.data.secure_url;
    } catch (uploadErr) {
      console.error("Upload error:", uploadErr);
      alert("Image upload failed");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("pos-token");

    if (!token) {
      alert("Please login to add items");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/items/createitem",
        {
          title,
          price,
          description,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Item added successfully!");
      navigate("/items");
    } catch (err) {
      console.error("Item creation error:", err.response?.data || err.message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100vh] justify-center items-center bg-gray-100">
      <div className="w-[400px] bg-white rounded p-6 shadow">
        <form onSubmit={handleSubmit(submitHandler)}>
          <h2 className="text-2xl font-bold text-center mb-4">Add Item</h2>

          {/* Title */}
          <div className="mb-3">
            <label className="block mb-1">Title</label>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter item title"
            />
            <p className="text-red-500 text-sm">{errors.title?.message}</p>
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="block mb-1">Price</label>
            <input
              {...register("price")}
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter price"
            />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="block mb-1">Description</label>
            <input
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter description"
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          {/* Image */}
          <div className="mb-4">
            <label className="block mb-1">Upload Image</label>
            <input
              {...register("image")}
              type="file"
              className="w-full border rounded p-2 bg-gray-50"
            />
            <p className="text-red-500 text-sm">{errors.image?.message}</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            {loading ? "Uploading..." : "Add Item"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Create;
