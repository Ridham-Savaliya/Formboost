import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useRecoilState } from "recoil";
import { formStatsState } from "../recoil/states";

export const FormCard = ({
  title,
  formDescription,
  createdDate,
  formId,
  alias,
  onDelete,
  onView,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useRecoilState(formStatsState);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/formsubmission/${formId}/form`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setTotalCount(response.data.data.totalCount);
      } catch (error) {
        console.error("Error fetching total count:", error);
        toast.error("Failed to fetch submission count");
      }
    };

    fetchTotalCount();
  }, [formId]);

  const handleDelete = async () => {
    try {
      // Call the parent's onDelete handler
      await onDelete(formId);

      // Update the form count in Recoil state
      setStats((prevStats) => ({
        ...prevStats,
        totalForms: prevStats.totalForms - 1,
        // If the form had submissions, update the submission counts accordingly
        totalSubmissionsAllTime: prevStats.totalSubmissionsAllTime - totalCount,
        // Note: We might need more complex logic for monthly submissions
        // depending on when the submissions were made
      }));

      setShowPopover(false);
      toast.success("Form deleted successfully!");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  return (
    <div className="p-4 sm:p-6 shadow-lg rounded-lg transition-transform transform bg-white h-full flex flex-col">
      <div className="flex justify-between items-start gap-2 sm:gap-3">
        <Link to={`/dashboard/form/${formId}`} className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#0080FF] leading-snug line-clamp-2 break-words">{title}</h2>
        </Link>
        <button
          onClick={() => setShowPopover(true)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0 p-1"
        >
          <MdDelete className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 hover:text-red-800" />
        </button>
      </div>

      <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-2">
        <b>Description:</b>{" "}
        {formDescription.length > 80
          ? `${formDescription.substring(0, 50)}...`
          : formDescription}
      </p>

      <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-3">
        <b>Created:</b> {new Date(createdDate).toLocaleString().split(",")[0]}
      </p>
      <div className=" border-t py-3 sm:py-4">
        <p className="text-sm font-medium text-gray-700">SUBMISSIONS</p>
        <div className="flex space-x-4 mt-1 py-2 items-end">
          <div>
            <p className="text-lg sm:text-base md:text-lg font-bold">{totalCount}</p>
            <p className="text-xs md:text-sm text-gray-500">Total</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(formId)}
        className="mt-auto bg-primary text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md hover:bg-primary-700 w-full text-sm sm:text-base font-medium"
      >
        View Form
      </button>

      {showPopover && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 sm:p-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Delete Form</h2>
            <p className="text-sm sm:text-base mb-4">Are you sure you want to delete this form?</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 text-sm font-medium"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 text-sm font-medium"
                onClick={() => setShowPopover(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
