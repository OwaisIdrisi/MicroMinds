import { useState } from "react";
import { updateBlog } from "../../api/blog";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading } from "../../features/blogSlice";

export const Editblog = ({ blog, setIsModalOpen, setLocalBlog }) => {
  const dispatch = useDispatch();
  const isError = useSelector((state) => state.blog.isError);
  const error = useSelector((state) => state.blog.error);
  const loading = useSelector((state) => state.blog.loading);
  //   const [formDetails, setFormDetails] = useState({
  //     title: "",
  //     content: "",
  //     tags: "",
  //     cover: "",
  //   });
  const [formDetails, setFormDetails] = useState(blog);
  const [tag, setTag] = useState("");
  const onClose = () => setIsModalOpen(false);

  const changeHandler = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const tags = tag.split(",");
    dispatch(setLoading(true));
    try {
      setFormDetails({ ...formDetails, tags: tags });
      const response = await updateBlog(
        {
          title: formDetails.title,
          content: formDetails.content,
          tags: tags,
        },
        blog._id
      );
      console.log(response);
      // dispatch(setBlog(response.data.newBlog));
      setLocalBlog(response.data);
      setFormDetails({ title: "", content: "", tags: "", cover: "" });
      setIsModalOpen(false);
      dispatch(setLoading(false));
    } catch (error) {
      if (error.response?.data.success === false) {
        dispatch(setError("Something went wrong while submiting the form"));
      } else {
        dispatch(setError(error?.message || "something went wrong"));
      }
      console.log(error);
    }
  };
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      {/* Soft blurred backdrop */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs"></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 animate-[fadeIn_0.3s_ease-out] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          ✨ Edit Blog
        </h2>

        {isError && (
          <div className="text-red-500 py-2">
            {error ? error : "something went wrong while submitting the form"}
          </div>
        )}

        <form
          encType="multipart/form-data"
          method="post"
          className="space-y-5"
          onSubmit={submitHandler}
        >
          {/* Floating Label Input */}
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              value={formDetails.title}
              onChange={changeHandler}
              placeholder=" "
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <label
              htmlFor="title"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm"
            >
              Title
            </label>
          </div>

          {/* Content */}
          <div className="relative">
            <textarea
              id="content"
              name="content"
              placeholder=" "
              rows="4"
              value={formDetails.content}
              onChange={changeHandler}
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              required
            ></textarea>
            <label
              htmlFor="content"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm"
            >
              Content
            </label>
          </div>

          {/* Tags */}
          <div className="relative">
            <input
              type="text"
              name="tags"
              id="tags"
              placeholder=" "
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <label
              htmlFor="tags"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-blue-500 peer-focus:text-sm"
            >
              Tags (comma separated)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:scale-[1.02] transition-transform"
          >
            {loading ? "Loading..." : "🚀 Edit Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};
