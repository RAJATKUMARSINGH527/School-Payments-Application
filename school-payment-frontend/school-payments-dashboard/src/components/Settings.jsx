import React, { useEffect, useState } from "react";
import axios from "axios";


const Settings = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("https://school-payments-application.onrender.com/auth/view", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          username: res.data.username || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setMessage("You must be logged in to update settings");
      return;
    }
    try {
      await axios.put("https://school-payments-application.onrender.com/auth/edit", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Settings</h1>

        {message && (
          <p
            className={`mb-6 text-center px-4 py-3 rounded ${
              message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-1 text-gray-700 font-semibold">Full Name</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 border rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-gray-700 font-semibold">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700 font-semibold">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-semibold"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
