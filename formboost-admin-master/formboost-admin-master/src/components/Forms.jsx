import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "../components/CommonTable";
import { createMRTColumnHelper } from "material-react-table";
import { BACKEND_URL } from "../../src/utils/constants"; // Import the BACKEND_URL
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { saveAs } from "file-saver";
import { BsFiletypeCsv } from "react-icons/bs";

const columnHelper = createMRTColumnHelper();

const Forms = () => {
  const [data, setData] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // const fetchData = async () => {
  //   try {
  //     const data = BACKEND_URL
  //     console.log(data);
  //     const token = localStorage.getItem("authToken"); // Get token from local storage
  //     const response = await axios.get(`${BACKEND_URL}/admin/allforms?limit=50&page=1&sortBy=formName&sortOrder=ASC`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.data.status === "success") {
  //       setData(response.data.data.rows);
  //       console.log(`${BACKEND_URL}/admin/allforms?limit=50&page=1&sortBy=formName&sortOrder=ASC`);
        
  //       console.log(response.data.data); 
  //     }
  //   } catch (error) {
  //     console.error("Error fetching the data", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BACKEND_URL}/admin/allforms?limit=50&page=1&sortBy=formName&sortOrder=ASC`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setData(response.data.data); // Adjusted to directly use the data array
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching the data", error);
    }
  };
  
  const updateForm = async () => {
    if (!selectedForm) return;

    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        formName: selectedForm.formName,
        formDescription: selectedForm.formDescription,
      };

      await axios.patch(`${BACKEND_URL}/form/${selectedForm.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Form updated successfully!");
      setShowEditForm(false);
      setSelectedForm(null);
      fetchData();
    } catch (error) {
      console.error("Failed to update form", error);
    }
  };

  const deleteForm = async () => {
    if (!selectedForm) return;

    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(`${BACKEND_URL}/form/${selectedForm.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Form deleted successfully!");
      setShowConfirmDelete(false);
      setSelectedForm(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete form", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to export CSV
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/admin/allform/csv`,
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
      saveAs(blob, "forms_data.csv"); // This will save the file as 'users_data.csv'
    } catch (error) {
      console.error("Error exporting CSV", error);
    }
  };

  const customColumns = [
    columnHelper.accessor("id", {
      header: "FormID",
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
              setSelectedForm(row.original);
              setShowEditForm(true);
            }}
            className="text-blue-500"
          >
            <FaRegEdit className="text-xl" />
          </button>
          <button
            onClick={() => {
              setSelectedForm(row.original);
              setShowConfirmDelete(true);
            }}
            className="text-red-500"
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ),
    },

    columnHelper.accessor("User.name", {
      header: "User Name",
      size: 150,
    }),
    
  
    columnHelper.accessor("formName", {
      header: "Form Name",
      size: 150,
    }),
    columnHelper.accessor("totalSubmissions", {
      header: "Total Submissions",
      size: 50,
    }),

    columnHelper.accessor("alias", {
      header: "Alias",
      size: 100,
    }),
   
    columnHelper.accessor("formDescription", {
      header: "Form Description",
      size: 200,
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(), // format date
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated At",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(), // format date
    }),
  ];

  return (
    <div className="ms-5">
      <div className="text-black mt-20 mb-5 flex justify-between items-center">
        <h1 className="font-bold text-xl">Forms Data</h1>
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

      {/* Edit Form */}
      {showEditForm && selectedForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Form</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Form Name
              </label>
              <input
                type="text"
                value={selectedForm.formName || ""}
                onChange={(e) =>
                  setSelectedForm({ ...selectedForm, formName: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Form Description
              </label>
              <input
                type="text"
                value={selectedForm.formDescription || ""}
                onChange={(e) =>
                  setSelectedForm({
                    ...selectedForm,
                    formDescription: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={updateForm}
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
      {showConfirmDelete && selectedForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete {selectedForm.formName}?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={deleteForm}
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

export default Forms;
