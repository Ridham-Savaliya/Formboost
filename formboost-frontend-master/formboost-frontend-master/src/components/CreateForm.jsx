import { useState } from "react";
import { useRecoilState } from "recoil";
import { formStatsState } from "../recoil/states";
import axios from "axios";
import { toast } from "react-toastify";

const CreateForm = ({ showModal, toggleModal, onFormCreated }) => {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSendEmail, setFormSendEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useRecoilState(formStatsState);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormSendEmail("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/form`,
        {
          formName,
          formDescription,
          targetEmail: formSendEmail,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        // Update the total forms count in the stats
        setStats((prevStats) => ({
          ...prevStats,
          totalForms: prevStats.totalForms + 1,
        }));

        toast.success("Form created successfully!");
        onFormCreated(response.data.data);
        resetForm();
        toggleModal();
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50">
      <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-extrabold text-gray-900">
            Create New Form
          </h3>
          <button
            type="button"
            onClick={toggleModal}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                Form Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formName}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="My Form 1"
                autoFocus
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                Form Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={formDescription}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write form description here"
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                Send Email to:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formSendEmail}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Send email to"
                onChange={(e) => setFormSendEmail(e.target.value)}
              />

              <p className="text-xs text-gray-500 mt-1">
                This email will receive form submissions.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-semibold mb-4">
              *{error}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white items-center bg-[#0080FF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Form"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
