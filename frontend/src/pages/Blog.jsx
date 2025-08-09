import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlog } from "../api/blog";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const response = await getBlog(id);
        console.log(response.data);
        setBlog(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSingleBlog();
  }, [id]);
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <img
        src={blog.cover}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-lg mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-4">
        By {blog.creatorUsername} •{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg leading-relaxed">{blog.content}</p>
    </div>
  );
};

export default Blog;
