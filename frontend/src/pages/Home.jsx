import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AddBlog, Card } from "../components";
import BlogCardSkeleton from "../components/Blog/BlogCardSkeleton";
import { getAllBlogs } from "../api/blog";

const TOPIC_LINKS = [
  { label: "Programming", tag: "programming" },
  { label: "JavaScript", tag: "javascript" },
  { label: "React", tag: "react" },
  { label: "AI", tag: "ai" },
  { label: "Education", tag: "education" },
  { label: "Technology", tag: "technology" },
];

export const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [latestBlogsLoading, setLatestBlogsLoading] = useState(true);
  const [latestBlogsError, setLatestBlogsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadLatestBlogs = async () => {
      try {
        setLatestBlogsLoading(true);
        setLatestBlogsError("");

        const response = await getAllBlogs({
          page: 1,
          limit: 3,
          sort: "latest",
        });

        if (!isMounted) return;

        setLatestBlogs(response?.blogs || []);
      } catch (error) {
        if (!isMounted) return;
        setLatestBlogsError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load latest blogs right now.",
        );
      } finally {
        if (isMounted) {
          setLatestBlogsLoading(false);
        }
      }
    };

    loadLatestBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => setIsModalOpen(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.2),_transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-28">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                MicroMinds community workspace
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Welcome back, {user?.username}!
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                  Discover ideas, share your thoughts, and learn from the
                  MicroMinds community.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Explore Blogs
                </Link>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-blue-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-400"
                >
                  Write a Blog
                </button>
              </div>

              <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  "Read the latest community posts",
                  "Share ideas with one click",
                  "Find topics that matter to you",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">
                      Your writing hub
                    </span>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                      Ready to publish
                    </span>
                  </div>

                  <div className="rounded-2xl bg-slate-950/50 p-5">
                    <p className="text-sm text-slate-300">Today&apos;s focus</p>
                    <p className="mt-2 text-2xl font-semibold leading-tight">
                      Turn a thought into a post in minutes.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Start a draft, refine your ideas, and publish for the
                      MicroMinds community when you are ready.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                        Explore
                      </p>
                      <p className="mt-2 text-sm text-white/90">
                        Read fresh ideas from other creators.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                        Write
                      </p>
                      <p className="mt-2 text-sm text-white/90">
                        Publish your own thoughts with the existing editor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Community feed
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Latest Blogs
              </h2>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center text-sm font-semibold text-sky-700 transition hover:text-sky-900"
            >
              View All Blogs →
            </Link>
          </div>

          {latestBlogsLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          ) : latestBlogsError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {latestBlogsError}
            </div>
          ) : latestBlogs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-600 shadow-sm">
              No blogs published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {latestBlogs.map((blog) => (
                <Card blog={blog} key={blog._id} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Browse by Topic
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Find a theme that fits what you want to read
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Jump into Explore with a topic tag to discover posts in areas
                you care about.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {TOPIC_LINKS.map((topic) => (
                <Link
                  key={topic.tag}
                  to={`/explore?tag=${topic.tag}`}
                  className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
          <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 to-blue-950 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                  Have something to share?
                </p>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Turn your ideas into a blog and share them with the MicroMinds
                  community.
                </h2>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Start Writing
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-lg font-semibold text-slate-900">MicroMinds</p>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
              Discover ideas, share your thoughts, and connect through writing.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
            <Link to="/explore" className="transition hover:text-sky-700">
              Explore
            </Link>
            <Link to="/my-blogs" className="transition hover:text-sky-700">
              My Blogs
            </Link>
            <Link to="/about" className="transition hover:text-sky-700">
              About
            </Link>
            <span>Contact</span>
            <span>Privacy Policy</span>
          </div>
        </div>

        <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
          © 2025 MicroMinds. All rights reserved.
        </div>
      </footer>

      {isModalOpen && <AddBlog setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};
