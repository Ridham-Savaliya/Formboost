import React, { useEffect, useState } from "react";
import {BACKEND_URL} from "../../src/utils/constants"
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { BsFiletypeCsv } from "react-icons/bs";
import { CSVLink, CSVDownload } from "react-csv";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [updatedPlanDetails, setUpdatedPlanDetails] = useState({
    name: "",
    formLimit: "",
    submissionLimit: "",
    price: "",
  });
  const [newPlanDetails, setNewPlanDetails] = useState({
    name: "",
    formLimit: "",
    submissionLimit: "",
    price: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/plan`,
              {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlans(response.data.data.rows);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleOpenDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeletePlan = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${BACKEND_URL}/plan/${selectedPlan.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlans(); // Refresh the list of plans
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  // Function to export CSV
  const exportToCSV = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${BACKEND_URL}/plan/csv`,
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
      saveAs(blob, "plans_data.csv");
    } catch (error) {
      console.error("Error exporting CSV", error);
    }
  };

  const handleOpenUpdateDialog = (plan) => {
    setSelectedPlan(plan);
    setUpdatedPlanDetails({
      name: plan.name,
      formLimit: plan.formLimit,
      submissionLimit: plan.submissionLimit,
      price: plan.price,
    });
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleUpdatePlan = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        name: updatedPlanDetails.name,
        formLimit: parseInt(updatedPlanDetails.formLimit, 10),
        submissionLimit: parseInt(updatedPlanDetails.submissionLimit, 10),
        price: parseFloat(updatedPlanDetails.price),
      };
      await axios.patch(
        `${BACKEND_URL}/plan/${selectedPlan.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlans(); // Refresh the list of plans
      handleCloseUpdateDialog();
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const handleOpenCreateDialog = () => {
    setNewPlanDetails({
      name: "",
      formLimit: "",
      submissionLimit: "",
      price: "",
    });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCreatePlan = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        name: newPlanDetails.name,
        formLimit: parseInt(newPlanDetails.formLimit, 10),
        submissionLimit: parseInt(newPlanDetails.submissionLimit, 10),
        price: parseFloat(newPlanDetails.price),
      };
      await axios.post(
        `${BACKEND_URL}/plan`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPlans(); // Refresh the list of plans
      handleCloseCreateDialog();
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mt-20 ml-7 font-bold text-2xl">Plans</h1>
      
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {/* Render plans */}
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg shadow-lg p-6 border ${
              plan.name === "Premium"
                ? "bg-blue-600 text-white"
                : plan.name === "Pro"
                ? "bg-indigo-100 text-indigo-900"
                : "bg-white"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <p className="mb-2">Form Limit: {plan.formLimit}</p>
            <p className="mb-2">Submission Limit: {plan.submissionLimit}</p>
            <p className="mb-4">Price: ${plan.price}</p>
            <div className="flex justify-between">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenUpdateDialog(plan)}
                className="mr-2"
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenDeleteDialog(plan)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Plan Button */}
        <div
          onClick={handleOpenCreateDialog}
          className="rounded-lg shadow-lg p-6 border border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-100"
        >
          <span className="text-3xl text-gray-500">+</span>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the plan "{selectedPlan?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeletePlan} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Plan Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Plan</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={updatedPlanDetails.name}
              onChange={(e) =>
                setUpdatedPlanDetails({
                  ...updatedPlanDetails,
                  name: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Form Limit"
              fullWidth
              type="number"
              value={updatedPlanDetails.formLimit}
              onChange={(e) =>
                setUpdatedPlanDetails({
                  ...updatedPlanDetails,
                  formLimit: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Submission Limit"
              fullWidth
              type="number"
              value={updatedPlanDetails.submissionLimit}
              onChange={(e) =>
                setUpdatedPlanDetails({
                  ...updatedPlanDetails,
                  submissionLimit: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Price"
              fullWidth
              type="number"
              value={updatedPlanDetails.price}
              onChange={(e) =>
                setUpdatedPlanDetails({
                  ...updatedPlanDetails,
                  price: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdatePlan} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create New Plan Dialog */}
        <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
          <DialogTitle>Create New Plan</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={newPlanDetails.name}
              onChange={(e) =>
                setNewPlanDetails({
                  ...newPlanDetails,
                  name: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Form Limit"
              fullWidth
              type="number"
              value={newPlanDetails.formLimit}
              onChange={(e) =>
                setNewPlanDetails({
                  ...newPlanDetails,
                  formLimit: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Submission Limit"
              fullWidth
              type="number"
              value={newPlanDetails.submissionLimit}
              onChange={(e) =>
                setNewPlanDetails({
                  ...newPlanDetails,
                  submissionLimit: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Price"
              fullWidth
              type="number"
              value={newPlanDetails.price}
              onChange={(e) =>
                setNewPlanDetails({
                  ...newPlanDetails,
                  price: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreatePlan} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Plans;
