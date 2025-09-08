import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonTable from "./CommonTable";
import { createMRTColumnHelper } from "material-react-table";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai"; // Import the plus icon
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink, CSVDownload } from "react-csv";
import { BACKEND_URL } from "../../src/utils/constants";

const columnHelper = createMRTColumnHelper();

const Transaction = () => {
  const [data, setData] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for create modal
  const [newTransaction, setNewTransaction] = useState({
    userPlanId: "",
    amount: "",
    currency: "",
    paymentMethod: "",
    status: "",
    transactionDate: "",
  });

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/transaction`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        setData(response.data.data.rows);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      alert("Error fetching transactions. Please try again later.");
    }
  };

  const createTransaction = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${BACKEND_URL}/transaction`,
        newTransaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create response:", response);
      alert("Transaction created successfully!");
      setShowCreateModal(false);
      setNewTransaction({
        userPlanId: "",
        amount: "",
        currency: "",
        paymentMethod: "",
        status: "",
        transactionDate: "",
      });
      fetchTransactions();
    } catch (error) {
      console.error(
        "Failed to create transaction:",
        error.response?.data || error.message
      );
      alert(
        `Error creating transaction: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const updateTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      const token = localStorage.getItem("authToken");

      // Format date for API
      const formattedTransactionDate = formatDateForApi(
        selectedTransaction.transactionDate
      );

      const payload = {
        amount: selectedTransaction.amount,
        currency: selectedTransaction.currency,
        paymentMethod: selectedTransaction.paymentMethod,
        status: selectedTransaction.status,
        transactionDate: formattedTransactionDate,
      };

      const response = await axios.patch(
        `${BACKEND_URL}/${selectedTransaction.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response);
      alert("Transaction updated successfully!");
      setShowEditModal(false);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error(
        "Failed to update transaction",
        error.response || error.message
      );
      alert(
        `Error updating transaction: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const deleteTransaction = async () => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.delete(
        `${BACKEND_URL}/transaction/${
          selectedTransaction.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Transaction deleted successfully!");
      setShowDeleteModal(false);
      fetchTransactions();
    } catch (error) {
      console.error(
        "Failed to delete transaction:",
        error.response?.data || error.message
      );
      alert(
        `Error deleting transaction: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/transaction/csv`,
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
      saveAs(blob, "transactions_data.csv"); // This will save the file as 'users_data.csv'
    } catch (error) {
      console.error("Error exporting CSV", error);
      alert("Error exporting CSV. Please try again later.");
    }
  };

  // Utility function to format date
  const formatDateForApi = (date) => {
    // Ensure the date is in the yyyy-MM-dd format
    return new Date(date).toISOString().split("T")[0];
  };

  // Function to export CSV
  // const exportToCSV = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await axios.get(
  //       "${import.meta.env.VITE_BACKEND_URL}/transaction/csv",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: "blob", // Important: tells axios to handle binary data
  //       }
  //     );

  //     // Create a downloadable link and trigger the download
  //     const blob = new Blob([response.data], {
  //       type: "text/csv;charset=utf-8;",
  //     });
  //     saveAs(blob, "transactions_data.csv"); // This will save the file as 'users_data.csv'
  //   } catch (error) {
  //     console.error("Error exporting CSV", error);
  //   }
  // };

  // const deleteTransaction = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     await axios.delete(
  //       `${import.meta.env.VITE_BACKEND_URL}/transaction/${selectedTransaction.id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert("Transaction deleted successfully!");
  //     setShowDeleteModal(false);
  //     fetchTransactions();
  //   } catch (error) {
  //     console.error(
  //       "Failed to delete transaction:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const customColumns = [
    columnHelper.accessor("id", {
      header: (
        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-green-500"
          >
            <AiOutlinePlus className="text-xl" />
          </button>
          <span> Transaction ID</span>
        </div>
      ),
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
              setSelectedTransaction(row.original);
              setShowEditModal(true);
            }}
            className="text-blue-500"
          >
            <FaRegEdit className="text-xl" />
          </button>
          <button
            onClick={() => {
              setSelectedTransaction(row.original);
              setShowDeleteModal(true);
            }}
            className="text-red-500"
          >
            <MdOutlineDelete className="text-xl" />
          </button>
        </div>
      ),
    },
    columnHelper.accessor("userPlanId", {
      header: "UserPlan ID",
      size: 50,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      size: 100,
    }),
    columnHelper.accessor("currency", {
      header: "Currency",
      size: 100,
    }),
    columnHelper.accessor("paymentMethod", {
      header: "Payment Method",
      size: 150,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      size: 100,
    }),
    columnHelper.accessor("transactionDate", {
      header: "Transaction Date",
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue()).toISOString().split("T")[0], // format date as yyyy-MM-dd
    }),
  ];

  return (
    <div className="ms-5">
      <div className="ms-">
        <div className="text-black mt-20 mb-5 flex justify-between items-center">
          <h1 className="font-bold text-xl">Transactions</h1>
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
      </div>
      <CommonTable columns={customColumns} data={data} />

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] overflow-x-auto max-w-md modal-scroll ">
            <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>
            {/* Form fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                UserPlan ID
              </label>
              <input
                type="number"
                value={newTransaction.userPlanId}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    userPlanId: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <input
                type="text"
                value={newTransaction.currency}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    currency: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <input
                type="text"
                value={newTransaction.paymentMethod}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    paymentMethod: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value={newTransaction.status}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    status: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Transaction Date
              </label>
              <input
                type="date"
                value={newTransaction.transactionDate}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    transactionDate: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={createTransaction}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] overflow-x-auto modal-scroll  max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
            {/* Form fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                UserPlan ID
              </label>
              <input
                type="number"
                value={selectedTransaction.userPlanId}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    userPlanId: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={selectedTransaction.amount}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    amount: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <input
                type="text"
                value={selectedTransaction.currency}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    currency: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <input
                type="text"
                value={selectedTransaction.paymentMethod}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    paymentMethod: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value={selectedTransaction.status}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    status: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Transaction Date
              </label>
              <input
                type="date"
                value={selectedTransaction.transactionDate}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    transactionDate: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={updateTransaction}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete transaction ID{" "}
              {selectedTransaction.id}?
            </p>
            <div className="flex justify-end">
              <button
                onClick={deleteTransaction}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
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

export default Transaction;
