import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useRecoilState } from "recoil";
import { formStatsState } from "../recoil/states";
import {
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineExternalLink
} from "react-icons/hi";

export const FormCard = ({
  title,
  formDescription,
  createdDate,
  formId,
  alias,
  onDelete,
  onView,
  template,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useRecoilState(formStatsState);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalCount();
  }, [formId]);

  const handleDelete = async () => {
    try {
      await onDelete(formId);

      setStats((prevStats) => ({
        ...prevStats,
        totalForms: prevStats.totalForms - 1,
        totalSubmissionsAllTime: prevStats.totalSubmissionsAllTime - totalCount,
      }));

      setShowPopover(false);
      toast.success("Form deleted successfully!");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form");
    }
  };

  const formattedDate = new Date(createdDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Get form initial for avatar
  const formInitial = title?.charAt(0)?.toUpperCase() || 'F';

  // Generate gradient colors based on title hash
  const getGradientClass = () => {
    const hash = title?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    const gradients = [
      'from-[#0080FF] to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
      'from-indigo-500 to-purple-600',
      'from-teal-500 to-cyan-600',
    ];
    return gradients[hash % gradients.length];
  };

  return (
    <>
      <div className="p-5 sm:p-6 h-full flex flex-col">
        {/* Header with Avatar and Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Form Avatar */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradientClass()} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <span className="text-white text-lg font-bold">{formInitial}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPopover(true)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              aria-label="Delete form"
            >
              <HiOutlineTrash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Title */}
        <Link to={`/dashboard/form/${formId}`} className="group flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#0080FF] transition-colors mb-2 line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {formDescription || 'No description provided'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <HiOutlineCalendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl mb-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <HiOutlineMail className="w-4 h-4 text-[#0080FF]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Submissions</p>
              <p className="text-lg font-bold text-gray-900">
                {isLoading ? (
                  <span className="inline-block w-8 h-5 bg-gray-200 rounded animate-pulse" />
                ) : (
                  totalCount
                )}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${totalCount > 0
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
            }`}>
            {totalCount > 0 ? 'Active' : 'No data'}
          </div>
        </div>

        {/* View Button */}
        <button
          onClick={() => onView(formId)}
          className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0080FF] to-blue-600 text-white font-semibold rounded-xl shadow-md shadow-[#0080FF]/20 hover:shadow-lg hover:shadow-[#0080FF]/30 transition-all duration-300 transform hover:-translate-y-0.5 group"
        >
          <HiOutlineEye className="w-5 h-5" />
          <span>View Details</span>
          <HiOutlineExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showPopover && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-scale-in">
            {/* Modal Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <HiOutlineTrash className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              Delete Form?
            </h2>
            <p className="text-gray-500 text-center mb-6">
              This will permanently delete <strong className="text-gray-700">{title}</strong> and all its {totalCount} submission{totalCount !== 1 ? 's' : ''}. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => setShowPopover(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
