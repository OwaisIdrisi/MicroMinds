import React from "react";

const Avatar = ({ user, size = "md" }) => {
  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words.length >= 2
      ? words[0][0] + words[1][0]
      : words[0][0].toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold ${sizeClasses[size]}`}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        getInitials(user?.name || user?.email)
      )}
    </div>
  );
};

export default Avatar;
