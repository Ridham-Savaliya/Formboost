import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "../components/CommonTable";
import { createMRTColumnHelper } from "material-react-table";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { BACKEND_URL } from "../../src/utils/constants";
import { Box, Button } from "@mui/material";
const columnHelper = createMRTColumnHelper();
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { saveAs } from "file-saver";
import { BsFiletypeCsv } from "react-icons/bs";
import { useMaterialReactTable } from "material-react-table";

const User = () => {
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const requestQueue = []; // Stores timestamps of requests

  const throttleRequest = () => {
    const now = Date.now();

    // Remove requests older than 1 second
    while (requestQueue.length > 0 && now - requestQueue[0] > 1000) {
      requestQueue.shift();
    }

    // Allow the request if less than 5 requests have been made in the last second
    if (requestQueue.length < 5) {
      requestQueue.push(now);
      return true;
    }

    return false;
  };

  const fetchFormCount = async (userId) => {
    if (!throttleRequest()) {
      // Skip the request if throttled
      return 0;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/user/${userId}/forms`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formCount = response.data.data.length;
      return formCount;
    } catch (error) {
      console.error("Error fetching form count", error);
      return 0;
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BACKEND_URL}/admin/alluser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const users = response.data.data.rows;

        // Fetch form count for each user
        const usersWithFormCounts = await Promise.all(
          users.map(async (user) => {
            const formCount = await fetchFormCount(user.id);
            return { ...user, formCount };
          })
        );

        setData(usersWithFormCounts);
      }
    } catch (error) {
      console.error("Error fetching the data", error);
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.patch(
        `${BACKEND_URL}/user/${selectedUser.id}`,
        {
          name: selectedUser.name,
          email: selectedUser.email,
          password: selectedUser.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully!");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `${BACKEND_URL}/user/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User deleted successfully!");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete user", error);
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
              setSelectedUser(row.original);
              setShowEditModal(true);
            }}
            className="text-blue-500"
          >
            <FaRegEdit className="text-xl" />
          </button>
          <button
            onClick={() => {
              setSelectedUser(row.original);
              setShowDeleteModal(true);
            }}
            className="text-red-500"
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ),
    },
    columnHelper.accessor("name", {
      header: "Name",
      size: 100,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      size: 200,
    }),
    {
      accessorKey: "formCount",
      header: "Form Created",
      size: 100,
    },
    columnHelper.accessor("createdAt", {
      header: "Created At",
      size: 200,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated At",
      size: 200,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    }),
  ];

  // Function to export CSV
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/admin/alluser/csv`,
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
      saveAs(blob, "users_data.csv"); // This will save the file as 'users_data.csv'
    } catch (error) {
      console.error("Error exporting CSV", error);
    }
  };

  return (
    <div className="ms-5">
      <div className="text-black mt-20 mb-5 flex justify-between items-center">
        <h1 className="font-bold text-xl">User's Data</h1>
        <button
          onClick={exportToCSV}
          className="h-10 w-35 flex items-center gap-2 p-2 border-[1px] border-[#7ebeff] hover:border-[#1976d2] hover:text-[#1976d2] sticky top-[10%] left-0 z-50 text-[#7ebeff] font-semibold rounded-md"
        >
          Export To{" "}
          <span>
            <BsFiletypeCsv className="w-7 h-6" />
          </span>
        </button>
      </div>
      <CommonTable columns={customColumns} data={data} />

      {/* Modals */}
      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={selectedUser.name || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={selectedUser.email || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={selectedUser.password || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={updateUser}
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

      {/* Confirm Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete {selectedUser.name}?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, delete
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

export default User;
