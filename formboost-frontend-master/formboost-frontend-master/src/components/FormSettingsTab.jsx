import { useState, useEffect } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import TelegramSetup from "./TelegramSetup";

const FormSettingsTab = ({ formId, onDelete }) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fromSendEmail, setFormSendEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterSpam, setFilterSpam] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [telegramNotification, setTelegramNotification] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [showTelegramHelp, setShowTelegramHelp] = useState(false);
  const [resolvingChat, setResolvingChat] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setFormName(response.data.data.formName);
        setFormDescription(response.data.data.formDescription);
        setFormSendEmail(response.data.data.targetEmail);
        setFilterSpam(response.data.data.filterSpam);
        setEmailNotification(response.data.data.emailNotification);
        setTelegramNotification(response.data.data.telegramNotification || false);
        setTelegramChatId(response.data.data.telegramChatId || "");
        setTelegramBotToken(response.data.data.telegramBotToken || "");
      } catch (error) {
        console.error("Error fetching form details:", error);
        toast.error("Failed to fetch form details");
      }
    };

    fetchFormDetails();
  }, [formId]);

  const openDeleteConfirm = () => setIsDeleteConfirmOpen(true);
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  const handleDelete = () => {
    onDelete(formId);
    toast.success("Form deleted successfully!");
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formResponse = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}`,
        {
          formName,
          formDescription,
          targetEmail: fromSendEmail,
          filterSpam,
          emailNotification,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      
      // Update Telegram settings (always persist token/chat even if toggle is off)
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_telegram`,
        {
          telegramNotification,
          telegramChatId,
          telegramBotToken,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (formResponse.data.success) {
        toast.success("Form updated successfully!");
      }
    } catch (error) {
      console.error("Error updating form or email:", error);
      toast.error("Failed to update form or email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async () => {
    try {
      setIsTesting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/test-notifications`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      const emailSent = res?.data?.data?.emailSent;
      const telegramSent = res?.data?.data?.telegramSent;
      if (emailSent || telegramSent) {
        const parts = [];
        if (emailSent) parts.push('Email');
        if (telegramSent) parts.push('Telegram');
        toast.success(`Test sent via ${parts.join(' & ')}`);
      } else {
        toast.warn("Test dispatched, but delivery not confirmed. Check configuration and try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send test notifications");
    } finally {
      setIsTesting(false);
    }
  };

  const handleResolveChatId = async () => {
    try {
      setResolvingChat(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/telegram/resolve-chat`,
        {
          params: { botToken: telegramBotToken },
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const chatId = res?.data?.data?.chatId;
      if (chatId) {
        setTelegramChatId(chatId);
        toast.success("Chat ID detected and filled.");
      } else {
        toast.warn("No recent chat found. Open Telegram and /start the bot.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to resolve chat ID");
    } finally {
      setResolvingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      {/* Form Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Form name
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-[#0080FF]"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>
      </div>
      {/* Form Description */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Description
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <textarea
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-[#0080FF]"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* Filter Spam */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Filter Spam
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filterSpam}
              onChange={(e) => setFilterSpam(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#0080FF] transition-colors duration-300" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
            <span className="ml-3 text-sm text-gray-600">
              {filterSpam ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      {/* Email Notification */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Email Notification
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailNotification}
              onChange={(e) => setEmailNotification(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#0080FF] transition-colors duration-300" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
            <span className="ml-3 text-sm text-gray-600">
              {emailNotification ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
      </div>

      {/* Send Email */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <label className="w-full sm:w-1/4 font-medium text-gray-700">
          Send Email to
        </label>
        <div className="w-full sm:w-3/4 mt-2 sm:mt-0">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-[#0080FF]"
            value={fromSendEmail}
            onChange={(e) => setFormSendEmail(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            This email will receive form submissions.
          </p>
        </div>
      </div>
      
      {/* Warning Banner */}
      <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-yellow-800">
        Heads up: Due to occasional technical issues, email or Telegram delivery may be delayed or
        fail. Please always check your dashboard for submissions.
      </div>

      {/* Enhanced Telegram Setup */}
      <TelegramSetup
        formId={formId}
        telegramNotification={telegramNotification}
        setTelegramNotification={setTelegramNotification}
        telegramBotToken={telegramBotToken}
        setTelegramBotToken={setTelegramBotToken}
        telegramChatId={telegramChatId}
        setTelegramChatId={setTelegramChatId}
        onUpdate={handleUpdate}
      />

      {/* Save and Cancel Buttons */}
      <div className="flex justify-between items-center mt-8">
        <div>
          <button
            onClick={openDeleteConfirm}
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <FiTrash2 className="text-lg" />
            <span>Delete form</span>
          </button>
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50"
            onClick={handleSendTest}
            disabled={isTesting}
            title="Send a sample submission to your Email/Telegram"
          >
            {isTesting ? "Sending..." : "Send test notification"}
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={() => {
              setFormName("");
              setFormDescription("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#0080FF] text-white rounded-md hover:bg-blue-800"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Confirm Delete Popover */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Delete
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeDeleteConfirm}
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this form? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
                onClick={handleDelete}
              >
                <FiTrash2 className="text-lg" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telegram Help Modal */}
      {showTelegramHelp && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Connect Telegram Notifications</h3>
              <button className="text-gray-500" onClick={() => setShowTelegramHelp(false)}>
                <FiX className="text-2xl" />
              </button>
            </div>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-gray-700">
              <li>
                Open Telegram and search for <span className="font-semibold">@BotFather</span>.
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >Open</a>
              </li>
              <li>Tap Start and send /newbot to create a bot. Copy the bot token.</li>
              <li>
                Paste the token here in <span className="font-semibold">Telegram Bot Token</span> and
                click <span className="font-semibold">Update</span>.
              </li>
              <li>
                Open your new bot in Telegram, tap Start (/start), then click
                <span className="font-semibold"> Fetch Chat ID</span> here to auto-fill your chat id.
                {telegramBotToken && (
                  <a
                    href={`https://t.me/${''}`}
                    className="ml-2 text-blue-600 hover:underline hidden"
                    target="_blank"
                    rel="noreferrer"
                  >Open my bot</a>
                )}
              </li>
              <li>
                Click <span className="font-semibold">Send test notification</span> to verify.
              </li>
            </ol>
            <div className="mt-4 text-xs text-gray-500">
              Tip: For channels, add your bot as an admin, then use channel username (e.g.
              @mychannel) or chat ID (-100...).
            </div>
            <div className="mt-5 text-right">
              <button
                className="px-4 py-2 rounded-md bg-[#0080FF] text-white hover:bg-blue-600"
                onClick={() => setShowTelegramHelp(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSettingsTab;
