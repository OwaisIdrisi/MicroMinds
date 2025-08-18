import React from "react";
import { getUserProfile } from "../api/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const userObj = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await getUserProfile(userObj.username);
        console.log(response.data.user.avatar);
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
    console.log(profile);
  }, [userObj.username]);

  if (!profile) return <p className="text-center mt-10">Loading...</p>;
  const { user, blogs } = profile;
  const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes.length, 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        {/* Avatar */}
        <div className="absolute -bottom-16 left-6">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-20 px-6">
        <h2 className="text-2xl font-bold">{user.fullName}</h2>
        <p className="text-gray-600">@{user.username}</p>
        <p className="text-gray-500 mt-1">{user.email}</p>

        {/* Stats */}
        <div className="flex gap-6 mt-4 text-gray-700">
          <p>
            <span className="font-semibold">{blogs.length}</span>{" "}
            <span className="text-gray-500">Blogs</span>
          </p>
          <p>
            <span className="font-semibold">{totalLikes}</span>{" "}
            <span className="text-gray-500">Likes</span>
          </p>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="mt-8 px-6">
        <h3 className="text-lg font-semibold mb-4">Blogs by {user.username}</h3>

        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="border-b pb-4 flex gap-4">
                <img
                  src={blog.cover}
                  alt={blog.title}
                  className="w-32 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-lg">{blog.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {blog.content}
                  </p>
                  <div className="text-gray-500 text-xs mt-1 flex gap-4">
                    <span>❤️ {blog.likes.length}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
