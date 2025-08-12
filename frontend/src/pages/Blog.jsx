import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteBlog, getBlog } from "../api/blog";
import { useSelector } from "react-redux";

const Blog = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [isMyBlog, setIsMyBlog] = useState(false);
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const response = await getBlog(id);
        console.log(response.data);
        if (user.username === response.data.creatorUsername) {
          setIsMyBlog(true);
        } else {
          setIsMyBlog(false);
        }
        setBlog(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleBlog();
  }, [id, user]);

  const editHandler = () => {
    console.log("edit is clicked");
  };
  const deleteHandler = async () => {
    try {
      const response = await deleteBlog(blog._id);
      console.log(response);
      if (!response.success) {
        console.log("something went wrong while deleting the blog");
        return;
      }
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back</span>
        </button>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative">
            <img
              src={blog.cover}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="p-8 md:p-12">
            <header className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {blog.title}
                </h1>
                {isMyBlog && (
                  <div className="flex space-x-3">
                    <button
                      onClick={editHandler}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={deleteHandler}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {blog.creatorUsername?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">
                    {blog.creatorUsername}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <time className="text-sm">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Blog;
