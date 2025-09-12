import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProfileInfo } from "./ProfileInfo";
import { ManageSubscription } from "./ManageSubscription";
import { AccountSettings } from "./AccountSettings";

const UserSettings = ({ userId }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Extract the tab ID from the URL, default to 'profile'
  const pathParts = pathname.split("/");
  const initialTab = pathParts[pathParts.length - 1] || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    // Update the active tab based on the URL
    const pathParts = pathname.split("/");
    const tabFromPath = pathParts[pathParts.length - 1] || "profile";
    setActiveTab(tabFromPath);
  }, [pathname]);

  const handleTabClick = (tabId) => {
    // Navigate to the selected tab and update the active tab state
    navigate(`/dashboard/${tabId}`);
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "profile", title: "Profile" },
    { id: "settings", title: "Usage" },
    { id: "subscriptions", title: "Manage Subscription" },
  ];

  return (
    <div className="mt-20 bg-white p-2 sm:p-5 shadow rounded-lg">
      <div className="mb-4 border-b">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          {tabs.map((tab) => (
            <li key={tab.id} className="me-2" role="presentation">
              <button
                className={`inline-block p-2 sm:p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? "border-[#0080FF] text-[#0080FF] font-bold"
                    : "hover:text-[#0080FF]"
                }`}
                onClick={() => handleTabClick(tab.id)}
                type="button"
                role="tab"
                aria-controls={tab.id}
                aria-selected={activeTab === tab.id}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {activeTab === "profile" && (
          <div
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
            className="p-2 sm:p-4 rounded-lg"
          >
            <ProfileInfo />
          </div>
        )}
        {activeTab === "settings" && (
          <div
            id="settings"
            role="tabpanel"
            aria-labelledby="settings-tab"
            className="p-2 sm:p-4 rounded-lg"
          >
            <AccountSettings userId={userId} />
          </div>
        )}
        {activeTab === "subscriptions" && (
          <div
            id="subscriptions"
            role="tabpanel"
            aria-labelledby="subscriptions-tab"
            className="p-2 sm:p-4 rounded-lg"
          >
            <ManageSubscription userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
