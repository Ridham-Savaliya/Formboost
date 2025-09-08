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
          `${import.meta.env.VITE_BACKEND_URL}/formsubmission/${formId}/form`,
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
    <div className="p-6 shadow-lg rounded-lg transition-transform transform bg-white">
      <div className="flex justify-between items-center">
        <Link to={`/form/${formId}`}>
          <h2 className="text-2xl font-bold mb-2 text-[#0080FF]">{title}</h2>
        </Link>
        <button
          onClick={() => setShowPopover(true)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <MdDelete className="w-6 h-6 text-red-500 hover:text-red-800" />
        </button>
      </div>

      <p className="text-gray-500">
        <b>Description:</b>{" "}
        {formDescription.length > 100
          ? `${formDescription.substring(0, 64)}...`
          : formDescription}
      </p>

      <p className="text-gray-500">
        <b>Created:</b> {new Date(createdDate).toLocaleString().split(",")[0]}
      </p>
      <div className="mt-4 border-t py-4">
        <p className="">SUBMISSIONS</p>
        <div className="flex space-x-4 mt-1 py-2">
          <div>
            <p className="text-lg font-bold">{totalCount}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(formId)}
        className="bg-[#0080FF] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#006fdd] w-full"
      >
        View Form
      </button>

      {showPopover && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Form</h2>
            <p>Are you sure you want to delete this form?</p>
            <div className="mt-4 flex space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300"
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
