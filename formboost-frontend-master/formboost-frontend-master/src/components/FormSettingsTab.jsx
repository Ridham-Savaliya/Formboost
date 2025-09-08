import { useState, useEffect } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";

const FormSettingsTab = ({ formId, onDelete }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fromSendEmail, setFormSendEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterSpam, setFilterSpam] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/form/${formId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setFormName(response.data.data.formName);
        setFormDescription(response.data.data.formDescription);
        setFormSendEmail(response.data.data.targetEmail);
        setFilterSpam(response.data.data.filterSpam);
        setEmailNotification(response.data.data.emailNotification);
      } catch (error) {
        console.error("Error fetching form details:", error);
        toast.error("Failed to fetch form details");
      }
    };

    fetchFormDetails();
  }, [formId]);

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const handleDelete = () => {
    onDelete(formId);
    toast.success("Form deleted successfully!");
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formResponse = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/form/${formId}`,
        {
          formName,
          formDescription,
          targetEmail: fromSendEmail,
          filterSpam,
          emailNotification,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (formResponse.data.success) {
        toast.success("Form updated successfully!");
      }
    } catch (error) {
      console.error("Error updating form or email:", error);
      toast.error("Failed to update form or email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      {/* Form Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Form name
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>
      </div>
      {/* Form Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Description
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <textarea
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* Filter Spam */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Filter Spam
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filterSpam}
              onChange={(e) => setFilterSpam(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
            <span className="ml-3 text-sm text-gray-600">
              {filterSpam ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      {/* Email Notification */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Email Notification
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailNotification}
              onChange={(e) => setEmailNotification(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
            <span className="ml-3 text-sm text-gray-600">
              {emailNotification ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      {/* Send Email */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Send Email to
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={fromSendEmail}
            onChange={(e) => setFormSendEmail(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            This email will receive form submissions.
          </p>
        </div>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div>
          <button
            onClick={openDeleteConfirm}
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <FiTrash2 className="text-lg" />
            <span>Delete form</span>
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={() => {
              setFormName("");
              setFormDescription("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#0080FF] text-white rounded-md hover:bg-blue-800"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Confirm Delete Popover */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Delete
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeDeleteConfirm}
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this form? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                onClick={handleDelete}
              >
                <FiTrash2 className="text-lg" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSettingsTab;
