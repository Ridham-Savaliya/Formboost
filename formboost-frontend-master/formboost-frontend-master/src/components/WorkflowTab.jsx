import { useState, useEffect } from "react";
import {
  FaSlack,
  FaDiscord,
  FaTelegram,
  FaMailchimp,
  FaTrello,
  FaLink,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { LuFileSpreadsheet } from "react-icons/lu";
import { SiZapier } from "react-icons/si";
import { IoRocket, IoCheckmarkCircle, IoWarning, IoFlash } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { SlackSetup } from "./SlackSetup";
import { GoogleSheetsSetup } from "./GoogleSheetsSetup";

export const WorkflowTab = ({ formId, form }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [loadedForm, setLoadedForm] = useState(form || null);
  const [webhookUrl, setWebhookUrl] = useState(form?.webhookUrl || "");
  const [webhookEnabled, setWebhookEnabled] = useState(form?.webhookEnabled || false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (form) {
      setLoadedForm(form);
      setWebhookUrl(form.webhookUrl || "");
      setWebhookEnabled(form.webhookEnabled || false);
    }
  }, [form]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        if (!formId) return;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        if (res?.data?.data) {
          const f = res.data.data;
          setLoadedForm(f);
          setWebhookUrl(f.webhookUrl || "");
          setWebhookEnabled(Boolean(f.webhookEnabled));
        }
      } catch (e) {
        // silent fail; keep UI usable
        console.warn('Failed to fetch form details', e?.message);
      }
    };
    fetchForm();
  }, [formId]);

  const handleDialog = (app) => {
    if (app.name === "Custom Webhook" || app.name === "Slack" || app.name === "Google Sheets") {
      // These are handled inline with dedicated components
      return;
    }
    setSelectedApp(app);
  };

  const handleCloseDialog = () => {
    setSelectedApp(null);
  };

  const apps = [
    { 
      name: "Custom Webhook", 
      icon: FaLink, 
      description: "Send form data to any URL",
      available: true,
      color: "bg-blue-500"
    },
    { 
      name: "Slack", 
      icon: FaSlack, 
      description: "Send notifications to Slack channels",
      available: true,
      color: "bg-purple-500"
    },
    { 
      name: "Google Sheets", 
      icon: LuFileSpreadsheet, 
      description: "Auto-populate spreadsheet rows",
      available: true,
      color: "bg-green-500"
    },
    { 
      name: "Zapier", 
      icon: SiZapier, 
      description: "Use webhook URL in Zapier",
      available: true,
      color: "bg-orange-500"
    },
    { 
      name: "Discord", 
      icon: FaDiscord, 
      description: "Coming soon",
      available: false,
      color: "bg-indigo-500"
    },
    { 
      name: "Mailchimp", 
      icon: FaMailchimp, 
      description: "Coming soon",
      available: false,
      color: "bg-yellow-500"
    },
  ];

  const saveWebhookSettings = async () => {
    if (!formId) {
      toast.error("Form ID is required");
      return;
    }

    setIsSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_webhook`,
        {
          webhookUrl: webhookUrl.trim() || null,
          webhookEnabled: Boolean(webhookEnabled && webhookUrl.trim()),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      toast.success("Webhook settings saved successfully!");
    } catch (error) {
      console.error("Error saving webhook:", error);
      toast.error("Failed to save webhook settings");
    } finally {
      setIsSaving(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast.error("Please enter a webhook URL first");
      return;
    }

    setIsTestingWebhook(true);
    setTestResult(null);
    
    try {
      // Ensure latest settings are saved before testing
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_webhook`,
        {
          webhookUrl: webhookUrl.trim() || null,
          webhookEnabled: Boolean(webhookEnabled && webhookUrl.trim()),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/test-webhook`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      
      const result = response.data.data;
      setTestResult(result);
      
      if (result.success) {
        toast.success(`✅ Webhook test successful! Status: ${result.statusCode}`);
      } else {
        toast.error(`❌ Webhook test failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Webhook test error:", error);
      const errorMsg = error.response?.data?.message || "Failed to test webhook";
      toast.error(`❌ ${errorMsg}`);
      setTestResult({ success: false, error: errorMsg });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflow Integrations</h1>
          <p className="text-gray-600">Connect your form with external services to automate your workflow</p>
        </div>

        {/* Custom Webhook Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaLink className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Custom Webhook</h3>
              <p className="text-gray-600">Send form submissions to any URL in real-time</p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <IoWarning className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">🚀 Why use Custom Webhooks?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Universal Integration</strong> - Connect to ANY service (Zapier, Make, custom APIs)</li>
                  <li>• <strong>Real-time Delivery</strong> - Instant data transfer with retry mechanism</li>
                  <li>• <strong>No Limits</strong> - Unlimited webhook calls, completely free</li>
                  <li>• <strong>Rich Data</strong> - Full form data + metadata in JSON format</li>
                  <li>• <strong>Production Ready</strong> - Enterprise-grade reliability</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaLink className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Custom Webhook</h3>
              <p className="text-gray-600">Send form submissions to any URL in real-time</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <IoRocket className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Enable Webhook</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={webhookEnabled}
                  onChange={(e) => setWebhookEnabled(e.target.checked)}
                />
                <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300" />
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-sm" />
              </label>
            </div>

            {/* Webhook URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                disabled={!webhookEnabled}
              />
              <p className="text-sm text-gray-500 mt-1">
                Form submissions will be sent as POST requests to this URL
              </p>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`p-4 rounded-lg border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {testResult.success ? (
                    <FaCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <FaTimes className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success 
                      ? `Test successful (${testResult.statusCode})` 
                      : `Test failed: ${testResult.error}`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={testWebhook}
                disabled={!webhookUrl.trim() || isTestingWebhook}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isTestingWebhook ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <IoFlash className="w-4 h-4" />
                    <span>Test Webhook</span>
                  </>
                )}
              </button>
              
              <button
                onClick={saveWebhookSettings}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircle className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>

            {/* Webhook Payload Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Webhook Payload Format</h4>
              <pre className="text-xs text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
{`{
  "event": "form.submission",
  "timestamp": "2024-01-01T12:00:00Z",
  "form": {
    "id": "form-id",
    "name": "Contact Form",
    "alias": "contact"
  },
  "submission": {
    "id": "submission-id",
    "submittedAt": "2024-01-01T12:00:00Z",
    "isSpam": false,
    "ipAddress": "192.168.1.1"
  },
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello world!"
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Slack Integration */}
        <SlackSetup formId={formId} form={loadedForm || form} />

        {/* Google Sheets Integration */}
        <GoogleSheetsSetup formId={formId} form={loadedForm || form} />

        {/* Other Integrations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.slice(3).map((app, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 ${
                  app.available 
                    ? 'cursor-pointer hover:shadow-lg hover:border-blue-200' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => app.available && handleDialog(app)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center`}>
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{app.name}</h4>
                    <p className="text-sm text-gray-600">{app.description}</p>
                  </div>
                  {!app.available && (
                    <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Soon
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog for other apps */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedApp.name}</h2>
              <button 
                onClick={handleCloseDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                {selectedApp.name} integration is coming soon! For now, you can use the Custom Webhook feature to connect with {selectedApp.name}.
              </p>
              {selectedApp.name === "Zapier" && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Pro tip:</strong> You can already use FormBoost with Zapier! Just use the Custom Webhook URL in your Zapier trigger.
                  </p>
                </div>
              )}
              <button 
                onClick={handleCloseDialog}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
