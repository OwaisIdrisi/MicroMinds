import { useState } from "react";
import { AddBlog } from "./AddBlog";

export const FloatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-2xl z-50"
      >
        +
      </button>
      {isModalOpen && <AddBlog setIsModalOpen={setIsModalOpen} />}
    </>
  );
};
