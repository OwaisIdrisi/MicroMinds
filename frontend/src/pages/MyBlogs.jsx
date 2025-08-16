import { useDispatch, useSelector } from "react-redux";
import { Card } from "../components";
import { useEffect } from "react";
import { setError, setMyBlogs, setLoading } from "../features/blogSlice";
import { getAllBlogs } from "../api/blog";

const MyBlogs = () => {
  const myBlogs = useSelector((state) => state.blog.myBlogs);
  const error = useSelector((state) => state.blog.error);
  const isError = useSelector((state) => state.blog.isError);
  const loading = useSelector((state) => state.blog.loading);
  const dispatch = useDispatch();
  useEffect(() => {
    const getMyBlogs = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getAllBlogs();
        console.log(response.data);
        dispatch(setMyBlogs(response.data?.myBlogs));
      } catch (error) {
        if (error.response.data.success === false) {
          dispatch(error.response.data.message);
        } else {
          dispatch(
            setError(
              error?.message || "something went wrong while fetching the blogs"
            )
          );
        }
        console.log("error", error);
      }
    };
    getMyBlogs();
  }, [dispatch]);

  if (isError && error) {
    return (
      <div className="error text-red-500 text-center text-2xl">
        this is an error
      </div>
    );
  }

  if (loading) {
    return <div className="text-center text-2xl my-6">Loading...</div>;
  }

  if (myBlogs?.length === 0) {
    return (
      <div className="text-center text-2xl my-6">You don't Have any Blogs.</div>
    );
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myBlogs &&
            myBlogs.length > 0 &&
            myBlogs.map((blog) => <Card blog={blog} key={blog._id} />)}
        </div>
      </div>
    </section>
  );
};

export default MyBlogs;
