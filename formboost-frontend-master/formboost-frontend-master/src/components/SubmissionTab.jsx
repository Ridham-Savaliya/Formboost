import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { MdOutlineDownload, MdOutlineContentCopy } from "react-icons/md";
import { toast } from "react-toastify";

const SubmissionTab = ({ formId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "submittedAt",
    direction: "descending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [topKeys, setTopKeys] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("inbox"); // inbox | spam

  useEffect(() => {
    fetchSubmissions();
  }, [formId, currentPage, resultsPerPage, sortConfig, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/formsubmission/${formId}/submissions`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          params: {
            page: currentPage,
            limit: resultsPerPage,
            sortBy: sortConfig.key,
            sortOrder: sortConfig.direction === "ascending" ? "ASC" : "DESC",
          },
        }
      );
      setSubmissions(response.data.data.combinedResults);
      console.log(response.data.data);

      setTopKeys(Object.keys(response.data.data.keyCounts).slice(0, 3));
      setTotalPages(
        Math.ceil(response.data.data.pagination.total / resultsPerPage)
      );
    } catch (err) {
      setError("Failed to fetch submissions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission((prev) => (prev === submission ? null : submission));
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const downloadData = () => {
    const response = axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/formsubmission/${formId}/csv`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    response.then((res) => {
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "submissions.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    response.catch((err) => {
      console.error("Failed to download CSV:", err);
      toast.error("Failed to download CSV. Please try again later.");
    });
  };

  if (loading)
    return <div className="text-center py-4">Loading submissions...</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white mt-2">
      <ActionBar
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        onSearch={handleSearch}
        onDownloadCSV={downloadData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="border-b border-[#0080FF] ">
            <tr>
              {[...topKeys, "Created Date", "Action"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    handleSort(header === "Created Date" ? "submittedAt" : "")
                  }
                >
                  {header}
                  {header === "Created Date" &&
                    sortConfig.key === "submittedAt" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions
              .filter((submission) =>
                activeTab === "inbox" ? !submission.isSpam : submission.isSpam
              )
              .map((submission) => (
                <SubmissionItem
                  key={submission.id}
                  submission={submission}
                  topKeys={topKeys}
                  isSelected={selectedSubmission === submission}
                  onSelect={handleSelectSubmission}
                />
              ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        resultsPerPage={resultsPerPage}
        onPaginate={(direction) =>
          setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1))
        }
        setResultsPerPage={setResultsPerPage}
      />
    </div>
  );
};

const ActionBar = ({ onSearch, onDownloadCSV, activeTab, setActiveTab }) => (
  <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      {/* Spam Toggle */}
      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "inbox"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "spam"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("spam")}
        >
          Spam
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="border rounded px-2 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      onClick={onDownloadCSV}
      className="bg-green-400 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
    >
      <MdOutlineDownload size={18} className="mr-2" />
      Download CSV
    </button>
  </div>
);

const SubmissionItem = ({ submission, topKeys, isSelected, onSelect }) => (
  <>
    <tr
      className="hover:bg-gray-200 cursor-pointer"
      onClick={() => onSelect(submission)}
    >
      {topKeys.map((key) => (
        <td
          key={key}
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
        >
          {submission.formSubmissionData.find((field) => field.key === key)
            ?.value || ""}
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(submission.submittedAt), "dd-MM-yyyy")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(submission);
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          View
        </button>
      </td>
    </tr>
    {isSelected && (
      <tr>
        <td colSpan="5">
          <SubmissionDetails submission={submission} />
        </td>
      </tr>
    )}
  </>
);

const SubmissionDetails = ({ submission }) => {
  const copySubmissionDetails = () => {
    const details = `
ID: ${submission.id}
IP: ${submission.ip}
Submitted At: ${format(new Date(submission.submittedAt), "PPpp")}

Form Submission Data:
${submission.formSubmissionData
  .map((field) => `${field.key}: ${field.value}`)
  .join("\n")}
    `;
    navigator.clipboard.writeText(details.trim());

    toast.success("copied to clipboard");
  };

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-[#0080FF]">
          Submission Details
        </h3>
        <button
          onClick={copySubmissionDetails}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <MdOutlineContentCopy size={16} className="mr-2" />
          Copy Details
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">ID</p>
          <p className="mt-1 text-sm text-gray-900">{submission.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">IP</p>
          <p className="mt-1 text-sm text-gray-900">{submission.ip}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Submitted At</p>
          <p className="mt-1 text-sm text-gray-900">
            {format(new Date(submission.submittedAt), "PPpp")}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">
          Form Submission Data
        </p>
        <div className="mt-2 bg-white overflow-hidden ">
          {submission.formSubmissionData.map((field, index) => (
            <div
              key={index}
              className={`px-4 py-2 border border-blue-200 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <p className="text-sm font-medium text-gray-500">{field.key}</p>
              <p className="mt-1 text-sm text-gray-900">{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  resultsPerPage,
  onPaginate,
  setResultsPerPage,
}) => (
  <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-2 md:space-y-0">
    <p className="text-gray-600">Showing {resultsPerPage} results per page</p>
    <div className="flex items-center space-x-4">
      <select
        value={resultsPerPage}
        onChange={(e) => setResultsPerPage(Number(e.target.value))}
        className="bg-white text-gray-700 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto mt-2 sm:mt-0"
      >
        {[10, 20, 50].map((value) => (
          <option key={value} value={value}>
            {value} per page
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPaginate("prev")}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p className="text-gray-600 text-base md:text-lg">
        Page {currentPage} of {totalPages}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPaginate("next")}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </div>
);

export default SubmissionTab;
