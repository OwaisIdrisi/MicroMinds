const BlogCardSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-200" />

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
        </div>

        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
