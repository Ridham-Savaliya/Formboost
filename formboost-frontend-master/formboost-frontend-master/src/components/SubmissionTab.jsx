import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { 
  MdOutlineDownload, 
  MdOutlineContentCopy, 
  MdInbox, 
  MdReportProblem,
  MdSearch,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdExpandMore,
  MdExpandLess
} from "react-icons/md";
import { HiEye, HiFilter } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
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
  const [activeTab, setActiveTab] = useState("inbox");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    fetchSubmissions();
  }, [formId, currentPage, resultsPerPage, sortConfig, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/formsubmission/${formId}/submissions`,
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
    setSelectedSubmission(submission);
  };

  const handleCloseSubmission = () => {
    setSelectedSubmission(null);
  };

  const toggleCardExpansion = (submissionId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(submissionId)) {
      newExpanded.delete(submissionId);
    } else {
      newExpanded.add(submissionId);
    }
    setExpandedCards(newExpanded);
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

  const downloadData = () => {
    const response = axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/formsubmission/${formId}/csv`,
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
    }).catch((err) => {
      console.error("Failed to download CSV:", err);
      toast.error("Failed to download CSV. Please try again later.");
    });
  };

  const filteredSubmissions = submissions.filter((submission) =>
    activeTab === "inbox" ? !submission.isSpam : submission.isSpam
  );

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-20 w-full bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Mobile-First Action Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 sm:p-4">
        <div className="flex flex-col space-y-2 sm:space-y-3">
          {/* Top Row - Title and Download */}
          <div className="flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Submissions</h2>
            <button
              onClick={downloadData}
              className="flex items-center space-x-1 sm:space-x-2 bg-green-500 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
            >
              <MdOutlineDownload size={16} />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 sm:p-1">
            <button
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-1.5 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === "inbox"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("inbox")}
            >
              <MdInbox size={18} />
              <span>Inbox</span>
            </button>
            <button
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-1.5 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === "spam"
                  ? "bg-white text-red-500 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("spam")}
            >
              <MdReportProblem size={18} />
              <span>Spam</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex space-x-1 sm:space-x-2">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
            >
              <HiFilter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-medium text-gray-600">Per page:</span>
                <select
                  value={resultsPerPage}
                  onChange={(e) => setResultsPerPage(Number(e.target.value))}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  {[10, 20, 50].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <span className="text-xs font-medium text-gray-600">Sort:</span>
                <select
                  value={`${sortConfig.key}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [key, direction] = e.target.value.split('-');
                    setSortConfig({ key, direction });
                  }}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="submittedAt-descending">Newest first</option>
                  <option value="submittedAt-ascending">Oldest first</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submissions List */}
      <div className="p-2 sm:p-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-lg mb-2">
              {activeTab === "inbox" ? <MdInbox size={48} className="mx-auto" /> : <MdReportProblem size={48} className="mx-auto" />}
            </div>
            <p className="text-gray-500">
              {activeTab === "inbox" ? "No submissions yet" : "No spam submissions"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[...topKeys, "Created Date", "Action"].map((header) => (
                      <th
                        key={header}
                        className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() =>
                          handleSort(header === "Created Date" ? "submittedAt" : "")
                        }
                      >
                        {header}
                        {header === "Created Date" && sortConfig.key === "submittedAt" && (
                          sortConfig.direction === "ascending" ? " ↑" : " ↓"
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {topKeys.map((key) => (
                        <td key={key} className="px-4 py-3 text-sm text-gray-900">
                          {submission.formSubmissionData.find((field) => field.key === key)
                            ?.value || ""}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(submission.submittedAt), "dd-MM-yyyy")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleSelectSubmission(submission)}
                          className="flex items-center space-x-1 text-primary hover:text-primary-700"
                        >
                          <HiEye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {filteredSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  topKeys={topKeys}
                  isExpanded={expandedCards.has(submission.id)}
                  onToggleExpand={() => toggleCardExpansion(submission.id)}
                  onView={() => handleSelectSubmission(submission)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 space-y-2 sm:space-y-0">
            <p className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:mx-4 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
              <button
                onClick={handleCloseSubmission}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <IoClose size={20} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              <SubmissionDetails submission={selectedSubmission} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile-optimized submission card component
const SubmissionCard = ({ submission, topKeys, isExpanded, onToggleExpand, onView }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="p-3 sm:p-4">
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {topKeys.length > 0 && submission.formSubmissionData.find(field => field.key === topKeys[0])?.value}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {format(new Date(submission.submittedAt), "MMM dd, yyyy 'at' HH:mm")}
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-3">
          <button
            onClick={onView}
            className="p-1.5 sm:p-2 text-primary hover:bg-primary/10 rounded-lg"
          >
            <HiEye size={16} />
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            {isExpanded ? <MdExpandLess size={16} /> : <MdExpandMore size={16} />}
          </button>
        </div>
      </div>

      {/* Quick preview of key fields */}
      <div className="space-y-0.5 sm:space-y-1">
        {topKeys.slice(0, 2).map((key) => {
          const field = submission.formSubmissionData.find(f => f.key === key);
          if (!field?.value) return null;
          return (
            <div key={key} className="text-xs text-gray-600">
              <span className="font-medium">{key}:</span> {field.value.slice(0, 50)}{field.value.length > 50 ? '...' : ''}
            </div>
          );
        })}
      </div>

      {/* Expanded view */}
      {isExpanded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {submission.formSubmissionData.map((field, index) => (
              <div key={index} className="text-xs">
                <div className="font-medium text-gray-700 mb-1">{field.key}</div>
                <div className="text-gray-600 bg-gray-50 p-1.5 sm:p-2 rounded text-xs sm:text-sm">{field.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div>ID: {submission.id}</div>
            <div>IP: {submission.ip}</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Enhanced submission details component
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
    toast.success("Copied to clipboard");
  };

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Header with copy button */}
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900">Submission Information</h4>
        <button
          onClick={copySubmissionDetails}
          className="flex items-center space-x-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <MdOutlineContentCopy size={16} />
          <span>Copy</span>
        </button>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <span className="font-medium text-gray-600">ID:</span>
            <div className="text-gray-900 font-mono text-xs mt-0.5 sm:mt-1 break-all">{submission.id}</div>
          </div>
          <div>
            <span className="font-medium text-gray-600">IP Address:</span>
            <div className="text-gray-900 mt-0.5 sm:mt-1">{submission.ip}</div>
          </div>
          <div className="sm:col-span-2">
            <span className="font-medium text-gray-600">Submitted At:</span>
            <div className="text-gray-900 mt-1">
              {format(new Date(submission.submittedAt), "EEEE, MMMM dd, yyyy 'at' HH:mm:ss")}
            </div>
          </div>
        </div>
      </div>

      {/* Form Data */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Form Data</h4>
        <div className="space-y-3">
          {submission.formSubmissionData.map((field, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3"
            >
              <div className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{field.key}</div>
              <div className="text-xs sm:text-sm text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-md whitespace-pre-wrap break-words">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmissionTab;