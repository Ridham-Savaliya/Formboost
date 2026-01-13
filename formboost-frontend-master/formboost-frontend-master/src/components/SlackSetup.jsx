import { useState, useEffect } from "react";
import { FaSlack, FaCheck, FaTimes, FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";
import { IoRocket, IoCheckmarkCircle, IoFlash } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";

export const SlackSetup = ({ formId, form }) => {
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(form?.slackWebhookUrl || "");
  const [slackEnabled, setSlackEnabled] = useState(form?.slackEnabled || false);
  const [isTestingSlack, setIsTestingSlack] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (form) {
      setSlackWebhookUrl(form.slackWebhookUrl || "");
      setSlackEnabled(form.slackEnabled || false);
    }
  }, [form]);

  const saveSlackSettings = async () => {
    if (!formId) {
      toast.error("Form ID is required");
      return;
    }

    setIsSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_slack`,
        {
          slackWebhookUrl: slackWebhookUrl.trim() || null,
          slackEnabled: Boolean(slackEnabled && slackWebhookUrl.trim()),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      toast.success("Slack settings saved successfully!");
    } catch (error) {
      console.error("Error saving Slack settings:", error);
      toast.error("Failed to save Slack settings");
    } finally {
      setIsSaving(false);
    }
  };

  const testSlack = async () => {
    if (!slackWebhookUrl.trim()) {
      toast.error("Please enter a Slack webhook URL first");
      return;
    }

    setIsTestingSlack(true);
    setTestResult(null);

    try {
      // Save latest settings before testing
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_slack`,
        {
          slackWebhookUrl: slackWebhookUrl.trim() || null,
          slackEnabled: Boolean(slackEnabled && slackWebhookUrl.trim()),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/test-slack`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const result = response.data.data;
      setTestResult(result);

      if (result.success) {
        toast.success(`✅ Slack test successful! Message sent to your channel.`);
      } else {
        toast.error(`❌ Slack test failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Slack test error:", error);
      const errorMsg = error.response?.data?.message || "Failed to test Slack integration";
      toast.error(`❌ ${errorMsg}`);
      setTestResult({ success: false, error: errorMsg });
    } finally {
      setIsTestingSlack(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <FaSlack className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Slack Integration</h3>
          <p className="text-sm sm:text-base text-gray-600">Get instant notifications in your Slack channels</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <FaInfoCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-purple-900 mb-2">Why use Slack integration?</h4>
            <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
              <li>• <strong>Instant team notifications</strong> - Never miss a lead or inquiry</li>
              <li>• <strong>Rich formatting</strong> - See all form fields in a beautiful layout</li>
              <li>• <strong>Team collaboration</strong> - Discuss submissions directly in Slack</li>
              <li>• <strong>Mobile alerts</strong> - Get notified on your phone instantly</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <IoRocket className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-sm sm:text-base font-medium text-gray-900">Enable Slack Notifications</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={slackEnabled}
              onChange={(e) => setSlackEnabled(e.target.checked)}
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300" />
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-sm" />
          </label>
        </div>

        {/* Setup Instructions */}
        <div className="p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3">📋 Setup Instructions</h4>
          <div className="text-xs sm:text-sm text-blue-800 space-y-2">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-semibold">Go to your Slack workspace</p>
                <p className="text-blue-700">Open Slack in your browser or desktop app</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-semibold">Create an Incoming Webhook</p>
                <p className="text-blue-700">Go to Apps → Incoming Webhooks → Add to Slack</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-semibold">Choose your channel</p>
                <p className="text-blue-700">Select where you want form notifications to appear</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <div>
                <p className="font-semibold">Copy the webhook URL</p>
                <p className="text-blue-700">Paste it in the field below</p>
              </div>
            </div>
          </div>
          <a
            href="https://slack.com/apps/A0F7XDUAZ-incoming-webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 mt-2 sm:mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            <span>Open Slack Webhooks</span>
            <FaExternalLinkAlt className="w-3 h-3" />
          </a>
        </div>

        {/* Webhook URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slack Webhook URL
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
            value={slackWebhookUrl}
            onChange={(e) => setSlackWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            disabled={!slackEnabled}
          />
          <p className="text-sm text-gray-500 mt-1">
            Form submissions will be sent as rich messages to your Slack channel
          </p>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-4 rounded-lg border ${testResult.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
            }`}>
            <div className="flex items-center space-x-2">
              {testResult.success ? (
                <FaCheck className="w-4 h-4 text-green-600" />
              ) : (
                <FaTimes className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                {testResult.success
                  ? 'Test message sent successfully! Check your Slack channel.'
                  : `Test failed: ${testResult.error}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={testSlack}
            disabled={!slackWebhookUrl.trim() || isTestingSlack}
            className="w-full sm:w-auto px-3 py-2.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm font-medium"
          >
            {isTestingSlack ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <IoFlash className="w-4 h-4" />
                <span>Send Test Message</span>
              </>
            )}
          </button>

          <button
            onClick={saveSlackSettings}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm font-medium"
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

        {/* Example Message Preview */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">📱 Message Preview</h4>
          <div className="bg-white border-l-4 border-purple-500 p-2.5 sm:p-3 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">FB</span>
              </div>
              <span className="text-sm sm:text-base font-semibold text-gray-900">Formboom</span>
              <span className="text-xs text-gray-500">now</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-900 mb-2">📝 New form submission received!</p>
            <div className="text-xs sm:text-sm text-gray-700 space-y-1">
              <p><strong>Contact Form</strong></p>
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john@example.com</p>
              <p><strong>Message:</strong> Hello, I'm interested in your services!</p>
              <p><strong>IP Address:</strong> 192.168.1.1</p>
              <p><strong>Submitted At:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
