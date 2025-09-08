import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarChart, PieChart, LineChart } from "@mui/x-charts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Card from "../components/Card";
import Layout from "../components/Layout";
import { TbPremiumRights } from "react-icons/tb";
import "../../src/assets/styles/style.css";
import { FaRegUserCircle } from "react-icons/fa";
import { BsFillGrid3X3GapFill, BsFillBellFill } from "react-icons/bs";
import Forms from "../components/Forms";
import User from "../components/User";
import ManageAdmin from "../components/ManageAdmin";
import Transaction from "../components/Transaction";
import Subscription from "../components/Subscription";
import Account from "../components/Account";
import AccountSettings from "../components/AccountSettings";
import Plans from "../components/Plans";
import GlobalSettings from "../components/GlobalSettings";
import { BACKEND_URL } from "../../src/utils/constants";
import { Charts } from "../components/Charts";

export const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [formCount, setFormCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [subscriptionsCount, setScriptionsCount] = useState(0);
  const [submissionsData, setSubmissionsData] = useState([]); // Track submissions data
  const location = useLocation();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BACKEND_URL}/admin/alluser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUserCount(response.data.data.count);
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    fetchUserCount();
  }, []);

  useEffect(() => {
    const fetchFormCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BACKEND_URL}/admin/allform`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setFormCount(response.data.data.count);

          // Extract total submissions from the response data
          const submissions = response.data.data.rows.map(
            (form) => form.totalSubmissions
          );
          setSubmissionsData(submissions); // Set the submissions data for the LineChart
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchFormCount();
  }, []);

  useEffect(() => {
    const fetchSubmisssionCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BACKEND_URL}/formsubmission`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setSubmissionCount(response.data.data.count);
        }
      } catch (error) {
        console.error("Error fetching submission count:", error);
      }
    };
    fetchSubmisssionCount();
  }, []);

  useEffect(() => {
    const fetchsubscriptionsCount = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BACKEND_URL}/userplan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setScriptionsCount(response.data.data.count);
        }
      } catch (error) {
        console.error("Error fetching subscriptions count:", error);
      }
    };
    fetchsubscriptionsCount();
  }, []);

  const currentPath = location.pathname;

  return (
    <Layout>
    
      {currentPath === "/" && (
        <>
          <main className="main-container mt-10">
            <div className="main-title text-xl font-bold text-black">
              <h3>Dashboard</h3>
            </div>

            <div className="main-cards">
              <div className="card">
                <div className="card-inner">
                  <h3>USERS</h3>
                  <FaRegUserCircle className="card_icon" />
                </div>
                <h1>{userCount}</h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3>FORMS</h3>
                  <BsFillGrid3X3GapFill className="card_icon" />
                </div>
                <h1>{formCount}</h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3>SUBSCRIPTIONS</h3>
                  <TbPremiumRights className="card_icon3 text-xl" />
                </div>
                <h1>{subscriptionsCount}</h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  <h3>SUBMISSIONS</h3>
                  <BsFillBellFill className="card_icon" />
                </div>
                <h1>{submissionCount}</h1>
              </div>
            </div>

            {/* Graphs Section */}
            <div className="text-black graphs md:mt-[0vh] mt-[33vh]">
              {/* <Card title="Total Submissions">

              </Card> */}
              <Charts/>

              <Card className="text-[#0080ff]" title={<span style={{ color: '#0080ff' }}>Total Users / Forms / Subscriptions</span>}>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: userCount, label: "Users" }, // Dynamic user count
                        { id: 1, value: formCount, label: "Forms" }, // Dynamic form count
                        {
                          id: 2,
                          value: subscriptionsCount,
                          label: "Subscriptions",
                        }, // Dynamic subscriptions count
                      ],
                    },
                  ]}
                  width={400}
                  height={200}
                  colors={["#3246D3", "#7A83FE", "#02B2AF"]}
                />

                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: ["Users", "Forms", "Subscriptions"], // Labels for the dynamic data
                    },
                  ]}
                  series={[
                    { data: [userCount, formCount, subscriptionsCount] }, // Dynamic data for the bar chart
                  ]}
                  width={500}
                  height={300}
                  barLabel="value"
                  colors={["#3246D3", "#7A83FE", "#02B2AF"]}
                />
              </Card>
            </div>
          </main>
        </>
      )}

      {currentPath === "/users/" && <User />}
      {currentPath === "/forms/" && <Forms />}
      {currentPath === "/manage-admin/" && <ManageAdmin />}
      {currentPath === "/transactions/" && <Transaction />}
      {currentPath === "/subscriptions/" && <Subscription />}
      {currentPath === "/GlobalSettings/" && <GlobalSettings />}
      {currentPath === "/profile/" && <Account />}
      {currentPath === "/account-settings/" && <AccountSettings />}
      {currentPath === "/plans/" && <Plans />}
    </Layout>
  );
};

export default AdminDashboard;
