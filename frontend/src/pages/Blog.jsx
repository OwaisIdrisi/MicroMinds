import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addComment,
  deleteComment,
  deleteBlog,
  getBlog,
  getComments,
} from "../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../features/blogSlice";
import { Editblog } from "../components/Blog/EditBlog";
import toast from "react-hot-toast";

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
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const getSingleBlog = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getBlog(id);
        user?.username === response.data.creatorUsername
          ? setIsMyBlog(true)
          : setIsMyBlog(false);
        setBlog(response.data);
        const commentsResponse = await getComments(id);
        setComments(commentsResponse.data.comments || []);
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

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await addComment(id, commentText.trim());
      setComments((prev) => [...prev, response.data.comment]);
      setCommentText("");
      toast.success("Comment added");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to add comment";
      toast.error(message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
      toast.success("Comment deleted");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to delete comment";
      toast.error(message);
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

      <section className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>

        <form
          onSubmit={submitComment}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="3"
            placeholder="Write a comment..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="self-start sm:self-end bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">
              No comments yet. Be the first to comment.
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.author?.avatar}
                      alt={comment.author?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.author?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {comment.author?._id === user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

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
