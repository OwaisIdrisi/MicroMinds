import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import exampleImage from "/anime-moon.jpg";
export const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-36 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          {user
            ? ` ${user.username} Welcome to MicroMinds `
            : " Welcome to MicroMinds "}
        </h1>
        <p className="text-xl mt-4 opacity-90">
          Explore, Learn, and Share Your Thoughts
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link
            to="/explore"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-md transition hover:bg-gray-200"
          >
            Explore Blogs
          </Link>
          <Link
            to="/create"
            className="bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition hover:bg-indigo-800"
          >
            Write a Blog
          </Link>
        </div>
      </header>

      {/* Featured Blogs */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Featured Blogs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Blog Card */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
            <img
              // src="https://via.placeholder.com/400"
              src={exampleImage}
              alt="Blog Cover"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold">The Future of AI</h3>
              <p className="text-gray-600 text-sm mt-3">
                Discover how AI is shaping the world...
              </p>
              <Link
                to="/explore"
                className="text-blue-600 font-medium mt-4 block hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-6">
          {/* {["Tech", "Education", "Design", "Lifestyle", "Trending"] */}
          {["Default"].map((category) => (
            <Link
              key={category}
              to="/explore"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:bg-gray-300 transition"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-lg">© 2025 MicroMinds. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};
