import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components";
import BlogCardSkeleton from "../components/Blog/BlogCardSkeleton";
import { getMyBlogs } from "../api/blog";
import {
  setError,
  setMyBlogs,
  setMyBlogsFilters,
  setMyBlogsLoading,
  setMyBlogsPagination,
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
    sort: params.get("sort") || "latest",
  };
};

const MyBlogs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const myBlogs = useSelector((state) => state.blog.myBlogs);
  const error = useSelector((state) => state.blog.error);
  const isError = useSelector((state) => state.blog.isError);
  const myBlogsLoading = useSelector((state) => state.blog.myBlogsLoading);
  const myBlogsPagination = useSelector(
    (state) => state.blog.myBlogsPagination,
  );
  const myBlogsFilters = useSelector((state) => state.blog.myBlogsFilters);

  const [localSearch, setLocalSearch] = useState(myBlogsFilters.search || "");
  const skipSearchSyncRef = useRef(true);

  const updateUrl = (nextState) => {
    const params = new URLSearchParams();
    params.set("page", String(nextState.page || 1));
    params.set("limit", String(nextState.limit || 9));

    if (nextState.search) params.set("search", nextState.search);
    if (nextState.sort && nextState.sort !== "latest") {
      params.set("sort", nextState.sort);
    }

    navigate(`/my-blogs?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    const query = getQueryFromUrl(location.search);
    const normalizedQuery = {
      page: Number.isFinite(query.page) && query.page > 0 ? query.page : 1,
      limit: Number.isFinite(query.limit) && query.limit > 0 ? query.limit : 9,
      search: query.search,
      sort: SORT_OPTIONS.some((option) => option.value === query.sort)
        ? query.sort
        : "latest",
    };

    dispatch(
      setMyBlogsFilters({
        search: normalizedQuery.search,
        sort: normalizedQuery.sort,
      }),
    );
    dispatch(
      setMyBlogsPagination({
        page: normalizedQuery.page,
        limit: normalizedQuery.limit,
      }),
    );
    setLocalSearch(normalizedQuery.search);
    skipSearchSyncRef.current = true;

    let isCancelled = false;

    const fetchMyBlogs = async () => {
      try {
        dispatch(setMyBlogsLoading(true));
        const response = await getMyBlogs({
          page: normalizedQuery.page,
          limit: normalizedQuery.limit,
          search: normalizedQuery.search,
          sort: normalizedQuery.sort,
        });

        if (isCancelled) return;

        dispatch(setMyBlogs(response?.blogs || []));
        dispatch(
          setMyBlogsPagination({
            page: response?.pagination?.page || normalizedQuery.page,
            limit: response?.pagination?.limit || normalizedQuery.limit,
            totalBlogs: response?.pagination?.totalBlogs || 0,
            totalPages: response?.pagination?.totalPages || 1,
          }),
        );
      } catch (error) {
        if (isCancelled) return;
        const message =
          error.response?.data?.message ||
          error?.message ||
          "something went wrong while fetching the blogs";
        dispatch(setError(message));
      } finally {
        if (!isCancelled) {
          dispatch(setMyBlogsLoading(false));
        }
      }
    };

    fetchMyBlogs();

    return () => {
      isCancelled = true;
    };
  }, [dispatch, location.search]);

  useEffect(() => {
    if (skipSearchSyncRef.current) {
      skipSearchSyncRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextSearch = localSearch.trim();
      dispatch(setMyBlogsFilters({ search: nextSearch }));
      dispatch(setMyBlogsPagination({ page: 1 }));
      updateUrl({
        page: 1,
        limit: myBlogsPagination.limit,
        search: nextSearch,
        sort: myBlogsFilters.sort,
      });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, localSearch]);

  const handleSortChange = (event) => {
    const nextSort = event.target.value;
    dispatch(setMyBlogsFilters({ sort: nextSort }));
    dispatch(setMyBlogsPagination({ page: 1 }));
    updateUrl({
      page: 1,
      limit: myBlogsPagination.limit,
      search: localSearch.trim(),
      sort: nextSort,
    });
  };

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(
      Math.max(nextPage, 1),
      myBlogsPagination.totalPages || 1,
    );

    dispatch(setMyBlogsPagination({ page: safePage }));
    updateUrl({
      page: safePage,
      limit: myBlogsPagination.limit,
      search: localSearch.trim(),
      sort: myBlogsFilters.sort,
    });
  };

  const pageNumbers = Array.from(
    { length: myBlogsPagination.totalPages || 1 },
    (_, index) => index + 1,
  );

  const hasActiveFilters = Boolean(
    localSearch.trim() || myBlogsFilters.sort !== "latest",
  );

  if (isError && error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-red-500 text-2xl text-center">{error}</div>
      </div>
    );
  }

  if (myBlogsLoading) {
    return (
      <section className="text-gray-600 body-font overflow-hidden px-5 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!myBlogsLoading && myBlogs.length === 0) {
    return (
      <section className="text-gray-600 body-font overflow-hidden px-5 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-700">
                {hasActiveFilters
                  ? "No blogs found matching your filters."
                  : "No blogs available."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden px-5 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Blogs</h1>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search your blogs..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={myBlogsFilters.sort}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myBlogs.map((blog) => (
            <Card blog={blog} key={blog._id} />
          ))}
        </div>

        {myBlogsPagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(myBlogsPagination.page - 1)}
              disabled={myBlogsPagination.page <= 1}
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
                    myBlogsPagination.page === pageNumber
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(myBlogsPagination.page + 1)}
              disabled={myBlogsPagination.page >= myBlogsPagination.totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBlogs;
