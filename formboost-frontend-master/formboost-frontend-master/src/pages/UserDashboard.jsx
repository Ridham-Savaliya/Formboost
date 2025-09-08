import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import UserSettings from "../components/UserSettings";
import TabComponent from "../components/TabComponent";
import { FormCard } from "../components/FormCard";
import CreateForm from "../components/CreateForm"; // Import CreateForm
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";
import { useRecoilState } from "recoil";
import { formListState } from "../recoil/states";
import { ToastContainer } from "react-toastify";
import Charts from "../components/Charts";
import FormStatsCard from "../components/FormStatsCard";

export const UserDashboard = () => {
  const [userId, setUserId] = useState(null);
  const [forms, setForms] = useRecoilState(formListState);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedUserId = decodeTokenUserId(token);
      setUserId(decodedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getFormDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/forms`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setForms(response.data.data);
      } catch (error) {
        console.error("Failed to fetch form details:", error);
      }
    };

    if (userId) {
      getFormDetails();
    }
  }, [setForms, userId]);

  const handleDelete = async (formId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/form/${formId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        setForms(forms.filter((form) => form.id !== formId));
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const handleFormCreated = (newForm) => {
    setForms((prevForms) => [...prevForms, newForm]);
  };

  const renderDashboardContent = () => (
    <>
      <h1 className="text-2xl font-semibold mt-20">Dashboard</h1>
      <FormStatsCard />
      <Card>
        <Charts />
      </Card>

      <div className="block md:flex justify-center md:gap-4"></div>
      <h1 className="text-2xl font-semibold mt-8">Forms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 ">
        {forms.map((form) => (
          <FormCard
            key={form.id}
            title={form.formName}
            formDescription={form.formDescription}
            createdDate={form.createdAt}
            formId={form.id}
            alias={form.alias}
            onDelete={handleDelete}
            onView={() => navigate(`/form/${form.id}`)} // Navigate to form details
          />
        ))}
      </div>
    </>
  );

  return (
    <Layout>
      <ToastContainer />
      <Routes>
        <Route path="/" element={renderDashboardContent()} />
        <Route path="/profile" element={<UserSettings />} />
        <Route path="/settings" element={<UserSettings userId={userId} />} />
        <Route
          path="/subscriptions"
          element={<UserSettings userId={userId} />}
        />
        {forms.map((form) => (
          <Route
            key={form.id}
            path={`/form/${form.id}`}
            element={
              <div className="mt-20 bg-white p-5 shadow rounded-lg">
                <h1 className="text-2xl font-semibold">{form.formName}</h1>
                <p className="text-gray-500 my-2">
                  {form.formDescription.length > 100
                    ? `${form.formDescription.substring(0, 80)}...`
                    : form.formDescription}
                </p>
                <TabComponent
                  alias={form.alias}
                  formId={form.id}
                  formName={form.formName}
                />
              </div>
            }
          />
        ))}
      </Routes>
      <CreateForm onFormCreated={handleFormCreated} />
    </Layout>
  );
};
