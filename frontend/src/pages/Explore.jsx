import { useEffect } from "react";
import { Card } from "../components";
import { getAllBlogs } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import {
  setBlogs,
  setMyBlogs,
  setLoading,
  setError,
} from "../features/blogSlice";

export const Explore = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.blogs);
  const error = useSelector((state) => state.blog.error);
  const isError = useSelector((state) => state.blog.isError);
  const loading = useSelector((state) => state.blog.loading);
  useEffect(() => {
    const getBlogs = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getAllBlogs();
        dispatch(setBlogs(response?.data.blogs));
        if (response.data.myBlogs) {
          dispatch(setMyBlogs(response?.data.myBlogs));
        }
      } catch (error) {
        console.log(error);
        if (error.response?.data.success === false) {
          dispatch(setError(error.response.data.message));
        } else {
          dispatch(
            setError(
              error?.message || "something went wrong while fetching blogs"
            )
          );
        }
      }
    };
    getBlogs();
  }, [dispatch]);

  if (isError && error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500 text-2xl text-center">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-2xl">Loading...</div>
      </div>
    );
  }

  if (!loading && !isError && blogs.length === 0) {
    console.log("no blogs");
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500 text-2xl text-center">
          There are No blogs
        </div>
      </div>
    );
  }

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
