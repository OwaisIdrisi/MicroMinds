import React, { useEffect } from "react";
import { Card } from "../components";
import { getAllBlogs } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setBlogs } from "../features/blogSlice";

export const Explore = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.blogs);
  console.log(blogs);
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await getAllBlogs();
        console.log(response);
        dispatch(setBlogs(response?.data));
      } catch (error) {
        console.log(error);
      }
    };
    getBlogs();
  }, [dispatch]);

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card blog={blog} key={blog._id} />
          ))}
        </div>
      </div>
    </section>
  );
};
