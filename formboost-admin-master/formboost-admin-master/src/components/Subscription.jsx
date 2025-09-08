import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "./CommonTable";
import { createMRTColumnHelper } from "material-react-table";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink, CSVDownload } from "react-csv";
import { BACKEND_URL } from "../../src/utils/constants";

const columnHelper = createMRTColumnHelper();

const Subscription = () => {
  const [data, setData] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/userplan`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setData(response.data.data.rows);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const updateSubscription = async () => {
    if (!selectedSubscription) return;

    // Basic validation
    if (
      !selectedSubscription.userId ||
      !selectedSubscription.planId ||
      !selectedSubscription.startDate ||
      !selectedSubscription.endDate
    ) {
      alert("Please enter valid details for all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        userId: selectedSubscription.userId,
        planId: selectedSubscription.planId,
        startDate: selectedSubscription.startDate,
        endDate: selectedSubscription.endDate,
      };

      await axios.patch(
        `${BACKEND_URL}/userplan/${selectedSubscription.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Subscription updated successfully!");
      setShowEditModal(false);
      setSelectedSubscription(null);
      fetchData();
    } catch (error) {
      // Handle errors from the API
      if (error.response && error.response.data) {
        alert(
          `Failed to update subscription: ${
            error.response.data.message || "Invalid details"
          }`
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      console.error("Failed to update subscription", error);
    }
  };


  const deleteSubscription = async () => {
    if (!selectedSubscription) return;
    // console.log(selectedSubscription.id);
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `${BACKEND_URL}/userplan/${selectedSubscription.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Subscription deleted successfully!");
      setShowDeleteModal(false);
      setSelectedSubscription(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete subscription", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customColumns = [
    columnHelper.accessor("id", {
      header: "ID",
      size: 50,
    }),
    {
      accessorKey: "actions",
      header: "Actions",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedSubscription(row.original);
              setShowEditModal(true);
            }}
            className="text-blue-500"
          >
            <FaRegEdit className="text-xl" />
          </button>
          <button
            onClick={() => {
              setSelectedSubscription(row.original);
              setShowDeleteModal(true);
            }}
            className="text-red-500"
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ),
    },
    columnHelper.accessor("userId", {
      header: "User ID",
      size: 100,
    }),
    columnHelper.accessor("planId", {
      header: "Plan ID",
      size: 100,
    }),
    columnHelper.accessor("isActive", {
      header: "Active Status",
      size: 100,
      Cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(), // format date
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(), // format date
    }),
  ];

  // Function to export CSV
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/userplan/csv`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important: tells axios to handle binary data
        }
      );

      // Create a downloadable link and trigger the download
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, "plans_data.csv"); // This will save the file as 'users_data.csv'
    } catch (error) {
      console.error("Error exporting CSV", error);
    }
  };

  return (
    <div className="ms-5">
      <div className="text-black mt-20 mb-5 flex justify-between items-center">
        <h1 className="font-bold text-xl">Subscriptions</h1>
        <button
          onClick={exportToCSV}
          className="h-10 w-35 flex items-center gap-2 p-2 border-[1px] border-[#7ebeff] hover:border-[#1976d2] hover:text-[#1976d2] sticky top-[20%] left-0  text-[#7ebeff] font-semibold rounded-md"
        >
          Export To{" "}
          <span>
            <BsFiletypeCsv className="w-7 h-6" />
          </span>
        </button>
      </div>
      <CommonTable columns={customColumns} data={data} />

      {/* Edit Modal */}
      {showEditModal && selectedSubscription && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Subscription</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="number"
                value={selectedSubscription.userId || ""}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    userId: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Plan ID
              </label>
              <input
                type="number"
                value={selectedSubscription.planId || ""}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    planId: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={selectedSubscription.startDate || ""}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    startDate: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={selectedSubscription.endDate || ""}
                onChange={(e) =>
                  setSelectedSubscription({
                    ...selectedSubscription,
                    endDate: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={updateSubscription}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSubscription && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete this subscription?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={deleteSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
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

export default Subscription;
