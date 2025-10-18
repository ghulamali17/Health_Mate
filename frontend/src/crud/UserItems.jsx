
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function UserItems() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("pos-token");
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/items/useritems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Axios error:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/items/deleteitem/${id}`);
      console.log("Item deleted successfully");
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Items</h2>
          <Link
            to={"/create"}
            className="bg-primary px-4 py-2 rounded text-white hover:bg-green-700 transition"
          >
            Add +
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">${item.price}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">
                    <img
                      src={item.image}
                      // src={`http://localhost:3001${item.image}`}multer
                      alt="img"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link
                      to={`/update/${item._id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </Link>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserItems;
