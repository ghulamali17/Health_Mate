import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
});

function Update() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/items/getitems/${id}`
        );
        const { title, price, description } = response.data;
        setValue("title", title);
        setValue("price", price);
        setValue("description", description);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchItem();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/items/updateitem/${id}`,
        data
      );
      console.log("Item updated:", response.data);
      alert("Item updated successfully");
      navigate("/items");
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex h-[100vh] justify-center items-center bg-gray-100">
      <div className="w-[400px] bg-white rounded p-4 shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold text-center mb-4">Update Item</h2>

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
            <p className="text-red-500 text-sm">{errors.description?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Update;
