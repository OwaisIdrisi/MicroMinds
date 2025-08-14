import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toggleLike } from "../api/blog.js";
import { useSelector } from "react-redux";

const Card = ({ blog }) => {
  const { title, content, cover, creatorUsername, _id, likes } = blog;
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const likeHandler = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await toggleLike(_id);
      setIsLike(!isLike);
      console.log("liked", response.data._id);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      setIsLike((prev) => !prev);
      setLikeCount(likes.length);
      console.log("failed to toggle like ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLikeCount(likes.length);
    // // aproach 1
    // const islikeT = likes.includes(user._id);
    // if (islikeT) {
    //   console.log("user is already liked");
    //   setIsLike(true);
    // } else {
    //   setIsLike(false);
    // }
    // aproach 2:
    setIsLike(user?._id ? likes.includes(user._id) : false);
  }, [likes, user?._id]);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]">
      {/* Cover Image */}
      <div className="relative group">
        <img
          src={cover}
          alt="Blog Cover"
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between min-h-[260px]">
        {/* Title + Like Button */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 leading-tight hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <button
            disabled={loading}
            onClick={likeHandler}
            className={`flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors ${
              loading ? "opacity-50" : "cursor-pointer"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={isLike ? "red" : "none"}
              viewBox="0 0 24 24"
              stroke={isLike ? "red" : "currentColor"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>

        {/* Author */}
        <span className="text-sm text-gray-500 flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {creatorUsername}
        </span>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 flex-1">{content}</p>

        {/* Read More */}
        <Link
          to={`/blog/${_id}`}
          className="inline-flex items-center mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors"
        >
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Card;
