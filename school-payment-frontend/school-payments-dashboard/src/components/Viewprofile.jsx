import React, { useEffect, useState } from "react";
import axios from "axios";


const BASE_URL = process.env.NODE_ENV === "development" ? bcUrlLocal : bcUrl;

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/auth/view`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 animate-pulse">Loading profile...</p>
      </div>
    );

  if (!profile)
    return (
      <div className="text-center text-red-600 mt-12">
        <p>Please login to see profile details.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500 rounded-full h-16 w-16 flex items-center justify-center text-white text-3xl font-bold uppercase">
            {profile.username?.charAt(0) || "U"}
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">User Profile</h2>
        </div>

        <div className="border-t border-gray-200"></div>

        <ProfileRow label="Full Name" value={profile.username} />
        <ProfileRow label="Email" value={profile.email} />
        <ProfileRow label="Phone" value={profile.phone || "Not provided"} />
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-700 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

export default ViewProfile;
