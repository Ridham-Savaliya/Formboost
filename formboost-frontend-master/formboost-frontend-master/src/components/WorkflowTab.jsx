import { useState } from "react";
import {
  FaSlack,
  FaDiscord,
  FaTelegram,
  FaMailchimp,
  FaTrello,
} from "react-icons/fa";
import { LuFileSpreadsheet } from "react-icons/lu";
import { SiZapier } from "react-icons/si";

export const WorkflowTab = () => {
  const [selectedApp, setSelectedApp] = useState(null);

  const handleDialog = (app) => {
    setSelectedApp(app);
  };

  const handleCloseDialog = () => {
    setSelectedApp(null);
  };

  const apps = [
    { name: "Slack", icon: FaSlack },
    { name: "Discord", icon: FaDiscord },
    { name: "Telegram", icon: FaTelegram },
    { name: "Mailchimp", icon: FaMailchimp },
    { name: "Trello", icon: FaTrello },
    { name: "Zapier", icon: SiZapier },
    { name: "Google Sheets", icon: LuFileSpreadsheet },
  ];

  return (
    <>
      <h1 className="text-xl font-semibold">Workflow</h1>
      <p className="text-gray-500 mb-2"> Connect your form with other apps</p>
      <div className="flex flex-wrap justify-center items-center gap-8 ">
        {apps.map((app, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-gray-100 w-40 border border-[#abd5ff]"
            onClick={() => handleDialog(app)}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex justify-center items-center">
                <app.icon className="text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">{app.name}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{selectedApp.name}</h2>
              <button onClick={handleCloseDialog}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {selectedApp.name} is a proprietary business communication
              platform developed by American software company Slack
              Technologies.
            </p>
            <button className="bg-[#0080FF] text-white px-4 py-2 rounded">
              Connect
            </button>
          </div>
        </div>
      )}
    </>
  );
};
