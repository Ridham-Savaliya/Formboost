import React, { useEffect, useState } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import { FaEdit, FaTrash, FaFileCsv } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { BACKEND_URL } from "../../src/utils/constants";
import CommonTable from "../../src/components/CommonTable";
import { MdOutlineDelete } from "react-icons/md";
import { saveAs } from "file-saver";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink, CSVDownload } from "react-csv";

const ManageAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const fetchUsers = async () => {
    try {
      // const token = localStorage.getItem("authToken");

      const token = localStorage.getItem("authToken"); // Retrieve token from local storage
      // console.log("manageadmintoken",token)
      const response = await axios.get(
        `${BACKEND_URL}/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data.rows);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    try {
      // const token = localStorage.getItem("authToken");

      const token = localStorage.getItem("authToken"); // Retrieve token from local storage

      await axios.delete(
        `${BACKEND_URL}/admin/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User deleted successfully!");
      setShowConfirmDelete(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      // const token = localStorage.getItem("authToken");

      const token = localStorage.getItem("authToken");

      const payload = {
        name: selectedUser.name,
        email: selectedUser.email,
        password: selectedUser.password,
      };

      await axios.patch(
        `${BACKEND_URL}/admin/${selectedUser.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully!");
      setShowEditForm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      size: 50,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              console.log("Edit User:", row.original);
              setSelectedUser(row.original);
              setShowEditForm(true);
            }}
            className="text-blue-500"
          >
            <FaRegEdit className="text-xl" />
          </button>
          <button
            onClick={() => {
              console.log("Delete User:", row.original);
              setSelectedUser(row.original);
              setShowConfirmDelete(true);
            }}
            className="text-red-500"
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 150,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
    },
    // {
    //   accessorKey: "password",
    //   header: "Password",
    //   size: 200,
    // },
    {
      accessorKey: "createdAt",
      header: "Created At",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    },
  ];

  // Function to export CSV
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/admin/all/csv`,
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
      saveAs(blob, "admins_data.csv"); // This will save the file as 'users_data.csv'
    } catch (error) {
      console.error("Error exporting CSV", error);
    }
  };

  return (
    <div className="p-5">
      <div className="text-black mt-50 mb-2 ">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl mt-14 ">Manage Admins</h1>
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
        <div className="mt-4"></div>

        <div className="">
          <CSVLink
            data={users || []}
            headers={columns.map((col) => ({
              label: col.header,
              key: col.accessorKey,
            }))}
            filename={"admins-data.csv"}
            className=" bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            {/* <FaFileCsv /> */}
            {/* <span>Export CSV</span> */}
          </CSVLink>
        </div>
      </div>
      {/* <MaterialReactTable
        columns={columns}
        data={users}
        enableRowSelection
        enableGlobalFilter
        enableColumnFilters
        state={{
          isLoading: loading,
        }}
      /> */}
      <CommonTable
        columns={columns}
        data={users}
        enableRowSelection
        enableGlobalFilter
        enableColumnFilters
        state={{
          isLoading: loading,
        }}
      />

      {/* Edit Form */}
      {showEditForm && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity ease-in-out duration-1000 z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transition-transform ease-in-out duration-300 transform"
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              marginTop: "20vh",
              marginLeft: "20vw",
            }}
          >
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
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {showConfirmDelete && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30  transition-opacity ease-in-out duration-300 z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transition-transform ease-in-out duration-300 transform"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              marginTop: "30vh",
              marginLeft: "10vw",
            }}
          >
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
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
