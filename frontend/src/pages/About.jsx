import React from "react";

export const About = () => {
  return (
    <div className="container mx-auto px-5 py-24">
      <h1 className="text-4xl font-bold text-center mb-6">About MicroMind</h1>
      <p className="text-lg text-gray-700 mb-4">
        MicroMind is a blogging platform that allows users to create, explore,
        and interact with blogs. Users can publish their own blogs, read blogs
        from other creators, and engage with content through likes.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        The platform is designed to be fast, intuitive, and visually appealing
        with a responsive interface built using modern web technologies.
      </p>
      <p className="text-lg text-gray-700 mb-4">Key Features:</p>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Create and publish blogs with images and tags</li>
        <li>Like and interact with blogs from other users</li>
        <li>Explore all blogs or view your own blogs</li>
        <li>Responsive and modern UI built with TailwindCSS</li>
      </ul>
      <p className="text-lg text-gray-700">
        MicroMind is designed to help knowledge seekers and content creators
        share their insights and learn from each other in an easy-to-use
        environment.
      </p>
      <p className="text-center text-blue-800 md:text-2xl my-2">
        Created by Owais Idrisi
      </p>
    </div>
  );
};
