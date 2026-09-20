import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../components";
import { getAllBlogs } from "../api/blog";
import BlogCardSkeleton from "../components/Blog/BlogCardSkeleton";
import {
  setBlogs,
  setLoading,
  setError,
  setPagination,
  setFilters,
  resetFilters,
} from "../features/blogSlice";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostLiked", label: "Most liked" },
];

const getQueryFromUrl = (search) => {
  const params = new URLSearchParams(search);
  return {
    page: Number.parseInt(params.get("page") || "1", 10),
    limit: Number.parseInt(params.get("limit") || "9", 10),
    search: params.get("search") || "",
    tag: params.get("tag") || "",
    sort: params.get("sort") || "latest",
  };
};

const buildTagOptions = (blogs = []) => {
  const tags = new Set();
  blogs.forEach((blog) => {
    (blog.tags || []).forEach((tag) => {
      if (tag) tags.add(tag);
    });
  });
  return [...tags].sort((a, b) => a.localeCompare(b));
};

export const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const blogs = useSelector((state) => state.blog.blogs);
  const error = useSelector((state) => state.blog.error);
  const isError = useSelector((state) => state.blog.isError);
  const loading = useSelector((state) => state.blog.loading);
  const pagination = useSelector((state) => state.blog.pagination);
  const filters = useSelector((state) => state.blog.filters);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const debounceRef = useRef(null);

  const tagOptions = useMemo(() => buildTagOptions(blogs), [blogs]);

  const updateUrl = (nextState) => {
    const params = new URLSearchParams();
    params.set("page", String(nextState.page || 1));
    params.set("limit", String(nextState.limit || 9));

    if (nextState.search) params.set("search", nextState.search);
    if (nextState.tag) params.set("tag", nextState.tag);
    if (nextState.sort && nextState.sort !== "latest")
      params.set("sort", nextState.sort);

    navigate(`/explore?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const query = getQueryFromUrl(location.search);
    const normalizedQuery = {
      page: Number.isFinite(query.page) && query.page > 0 ? query.page : 1,
      limit: Number.isFinite(query.limit) && query.limit > 0 ? query.limit : 9,
      search: query.search,
      tag: query.tag,
      sort: SORT_OPTIONS.some((option) => option.value === query.sort)
        ? query.sort
        : "latest",
    };

    dispatch(
      setFilters({
        search: normalizedQuery.search,
        tag: normalizedQuery.tag,
        sort: normalizedQuery.sort,
      }),
    );
    dispatch(
      setPagination({
        page: normalizedQuery.page,
        limit: normalizedQuery.limit,
      }),
    );
    setLocalSearch(normalizedQuery.search);
  }, [dispatch, location.search]);

  useEffect(() => {
    const query = {
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      tag: filters.tag,
      sort: filters.sort,
    };

    const getBlogs = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getAllBlogs(query);
        dispatch(setBlogs(response?.blogs || []));
        dispatch(
          setPagination({
            page: response?.pagination?.page || 1,
            limit: response?.pagination?.limit || 9,
            totalBlogs: response?.pagination?.totalBlogs || 0,
            totalPages: response?.pagination?.totalPages || 1,
          }),
        );
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error?.message ||
          "something went wrong while fetching blogs";
        dispatch(setError(message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    getBlogs();
  }, [
    dispatch,
    filters.search,
    filters.tag,
    filters.sort,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const nextPage = 1;
      const nextFilters = {
        search: localSearch.trim(),
        tag: filters.tag,
        sort: filters.sort,
      };

      dispatch(setFilters(nextFilters));
      dispatch(setPagination({ page: nextPage }));
      updateUrl({
        page: nextPage,
        limit: pagination.limit,
        search: nextFilters.search,
        tag: nextFilters.tag,
        sort: nextFilters.sort,
      });
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [localSearch]);

  const handleSortChange = (event) => {
    const nextSort = event.target.value;
    const nextFilters = { ...filters, sort: nextSort };
    dispatch(setFilters(nextFilters));
    dispatch(setPagination({ page: 1 }));
    updateUrl({
      page: 1,
      limit: pagination.limit,
      search: nextFilters.search,
      tag: nextFilters.tag,
      sort: nextFilters.sort,
    });
  };

  const handleTagChange = (event) => {
    const nextTag = event.target.value;
    const nextFilters = { ...filters, tag: nextTag };
    dispatch(setFilters(nextFilters));
    dispatch(setPagination({ page: 1 }));
    updateUrl({
      page: 1,
      limit: pagination.limit,
      search: nextFilters.search,
      tag: nextFilters.tag,
      sort: nextFilters.sort,
    });
  };

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(
      Math.max(nextPage, 1),
      pagination.totalPages || 1,
    );
    dispatch(setPagination({ page: safePage }));
    updateUrl({
      page: safePage,
      limit: pagination.limit,
      search: filters.search,
      tag: filters.tag,
      sort: filters.sort,
    });
  };

  const clearFilters = () => {
    setLocalSearch("");
    dispatch(resetFilters());
    updateUrl({
      page: 1,
      limit: pagination.limit,
      search: "",
      tag: "",
      sort: "latest",
    });
  };

  const pageNumbers = Array.from(
    { length: pagination.totalPages || 1 },
    (_, index) => index + 1,
  );

  if (isError && error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500 text-2xl text-center">{error}</div>
      </div>
    );
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Explore Blogs</h1>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search blogs..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.tag}
              onChange={handleTagChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(filters.search || filters.tag || filters.sort !== "latest") && (
            <button
              onClick={clearFilters}
              className="self-start text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-700">
                {pagination.totalBlogs === 0
                  ? "No blogs available."
                  : "No blogs found matching your filters."}
              </p>
              {pagination.totalBlogs > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card blog={blog} key={blog._id} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg border ${
                        pagination.page === pageNumber
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
