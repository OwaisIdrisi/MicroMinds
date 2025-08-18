import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteBlog, getBlog } from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../features/blogSlice";
import { Editblog } from "../components/Blog/EditBlog";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.blog.loading);
  const error = useSelector((state) => state.blog.error);
  const isError = useSelector((state) => state.blog.isError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMyBlog, setIsMyBlog] = useState(false);
  const [blog, setBlog] = useState({});

  useEffect(() => {
    const getSingleBlog = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getBlog(id);
        user?.username === response.data.creatorUsername
          ? setIsMyBlog(true)
          : setIsMyBlog(false);
        setBlog(response.data);
        dispatch(setLoading(false));
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error?.message ||
          "something went wrong while fetching the blog details";
        dispatch(setError(message));
        console.log(error);
      }
    };
    getSingleBlog();
  }, [dispatch, user?.username, id]);

  const editHandler = () => {
    console.log("edit is clicked");
    setIsModalOpen(true);
  };
  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    dispatch(setLoading(true));
    try {
      const response = await deleteBlog(blog._id);
      console.log(response);
      navigate("/explore", { replace: true });
      dispatch(setLoading(false));
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error?.message ||
        "server error! please try again";
      dispatch(setError(message));
      console.log(error);
    }
  };

  if (isError && error) {
    return (
      <div className="error text-red-500 text-center text-2xl">{error}</div>
    );
  }

  if (loading) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <>
      <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <img
            src={blog.cover}
            alt={blog.title}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="p-6 sm:p-8 md:p-12">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 leading-tight break-words">
                {blog.title}
              </h1>
              {isMyBlog && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={editHandler}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
                  >
                    ✏️ <span>Edit</span>
                  </button>
                  <button
                    onClick={deleteHandler}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
                  >
                    🗑️ <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {blog.creatorUsername?.charAt(0)?.toUpperCase()}
                </div>
                <span className="font-medium text-gray-800 text-sm sm:text-base">
                  {blog.creatorUsername}
                </span>
              </div>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <time className="text-xs sm:text-sm">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <div className="prose prose-sm sm:prose md:prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </p>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <Editblog
          blog={blog}
          setIsModalOpen={setIsModalOpen}
          setLocalBlog={setBlog}
        />
      )}
    </>
  );
};

export default Blog;
