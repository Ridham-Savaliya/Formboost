import { useState, useEffect } from "react";
import {
  Link,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  Settings,
  ExternalLink,
  Webhook,
  Send
} from "lucide-react";
import { FaSlack, FaDiscord, FaTelegram, FaMailchimp, FaTrello } from "react-icons/fa";
import { LuFileSpreadsheet } from "react-icons/lu";
import { SiZapier } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
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
  const [showPayloadInfo, setShowPayloadInfo] = useState(false);
  const [expandedSection, setExpandedSection] = useState('webhook');

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
        console.warn('Failed to fetch form details', e?.message);
      }
    };
    fetchForm();
  }, [formId]);

  const handleDialog = (app) => {
    if (app.name === "Custom Webhook" || app.name === "Slack" || app.name === "Google Sheets") {
      return;
    }
    setSelectedApp(app);
  };

  const handleCloseDialog = () => {
    setSelectedApp(null);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const apps = [
    {
      name: "Custom Webhook",
      icon: Link,
      description: "Send form data to any URL",
      available: true,
      color: "from-[#0080FF] to-blue-600"
    },
    {
      name: "Slack",
      icon: FaSlack,
      description: "Send notifications to Slack channels",
      available: true,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Google Sheets",
      icon: LuFileSpreadsheet,
      description: "Auto-populate spreadsheet rows",
      available: true,
      color: "from-green-500 to-green-600"
    },
    {
      name: "Zapier",
      icon: SiZapier,
      description: "Use webhook URL in Zapier",
      available: true,
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "Discord",
      icon: FaDiscord,
      description: "Coming soon",
      available: false,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      name: "Mailchimp",
      icon: FaMailchimp,
      description: "Coming soon",
      available: false,
      color: "from-yellow-500 to-yellow-600"
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
      toast.success("Webhook settings saved!");
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl  py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Workflow Integrations
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Connect your form with external services to automate your workflow
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Custom Webhook Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                      <Webhook className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        Custom Webhook
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1">
                        Send form submissions to any URL endpoint
                      </p>
                    </div>
                  </div>

                  <div className="sm:ml-auto">
                    <button
                      onClick={() => toggleSection('webhook')}
                      className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors sm:hidden"
                    >
                      <span>{expandedSection === 'webhook' ? 'Hide' : 'Show'}</span>
                      {expandedSection === 'webhook' ?
                        <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> :
                        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Content - Always visible on desktop, toggleable on mobile */}
              <div className={`${expandedSection === 'webhook' || window.innerWidth >= 640 ? 'block' : 'hidden'} sm:block`}>
                {/* Benefits Banner */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 lg:p-6 border-b border-blue-100">
                  <button
                    onClick={() => setShowPayloadInfo(!showPayloadInfo)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-xs sm:text-sm lg:text-base font-semibold text-blue-900">
                        Why use webhooks?
                      </span>
                    </div>
                    {showPayloadInfo ?
                      <ChevronUp className="h-4 w-4 text-blue-600" /> :
                      <ChevronDown className="h-4 w-4 text-blue-600" />
                    }
                  </button>

                  {showPayloadInfo && (
                    <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-blue-800 font-medium">Universal Integration</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                        <span className="text-xs text-blue-800 font-medium">Real-time Delivery</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-blue-800 font-medium">Unlimited Calls</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs text-blue-800 font-medium">Rich Metadata</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                  {/* Enable Toggle */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                            Enable Webhook
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                            Turn on webhook notifications for form submissions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={webhookEnabled}
                            onChange={(e) => setWebhookEnabled(e.target.checked)}
                          />
                          <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0080FF] transition-all duration-300 relative">
                            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-lg"></div>
                          </div>
                          <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-700">
                            {webhookEnabled ? 'On' : 'Off'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm lg:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
                        Webhook URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm lg:text-base pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-[#0080FF]/20 focus:border-[#0080FF] transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://your-app.com/webhook"
                          disabled={!webhookEnabled}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 sm:mt-2">
                        Form submissions will be sent as POST requests to this URL
                      </p>
                    </div>
                  </div>

                  {/* Test Result */}
                  {testResult && (
                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${testResult.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                      }`}>
                      <div className="flex items-start gap-3">
                        {testResult.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className={`font-semibold text-sm sm:text-base ${testResult.success ? 'text-green-900' : 'text-red-900'
                            }`}>
                            {testResult.success
                              ? `Test successful (Status: ${testResult.statusCode})`
                              : `Test failed`
                            }
                          </h4>
                          {!testResult.success && (
                            <p className="text-sm text-red-700 mt-1">
                              {testResult.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={testWebhook}
                      disabled={!webhookUrl.trim() || isTestingWebhook}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                      {isTestingWebhook ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs sm:text-sm">Testing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-xs sm:text-sm">Test Webhook</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={saveWebhookSettings}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#0080FF] to-blue-600 hover:from-[#0070E0] hover:to-blue-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs sm:text-sm">Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-xs sm:text-sm">Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Payload Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={() => setShowPayloadInfo(!showPayloadInfo)}
                      className="flex items-center justify-between w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span className="text-sm sm:text-base font-semibold text-gray-700">
                        View Payload Format
                      </span>
                      {showPayloadInfo ?
                        <ChevronUp className="h-4 w-4 text-gray-400" /> :
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      }
                    </button>

                    {showPayloadInfo && (
                      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
                        <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-3">
                          Webhook Payload Format
                        </h4>
                        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                          <pre className="text-xs sm:text-sm text-green-400 font-mono">
                            {`{
  "event": "form.submission",
  "timestamp": "2024-01-01T12:00:00Z",
  "form": {
    "id": "form-id",
    "name": "Contact Form"
  },
  "submission": {
    "id": "submission-id",
    "submittedAt": "2024-01-01T12:00:00Z"
  },
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}`}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Slack Integration */}
            <SlackSetup formId={formId} form={loadedForm || form} />

            {/* Google Sheets Integration */}
            <GoogleSheetsSetup formId={formId} form={loadedForm || form} />

            {/* Other Integrations */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 sm:p-4 lg:p-6">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  More Integrations
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Connect with popular services and automation platforms
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {apps.slice(3).map((app, index) => (
                  <div
                    key={index}
                    className={`group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200 transition-all duration-300 ${app.available
                      ? 'cursor-pointer hover:shadow-xl hover:border-gray-300 hover:-translate-y-2 hover:from-white hover:to-gray-50'
                      : 'opacity-60 cursor-not-allowed'
                      }`}
                    onClick={() => app.available && handleDialog(app)}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <app.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">
                            {app.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {app.description}
                          </p>
                        </div>
                      </div>

                      {!app.available && (
                        <div className="flex items-center justify-center">
                          <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                      )}

                      {app.available && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          <span>Click to learn more</span>
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Dialog */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl transform transition-all duration-300 shadow-2xl">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 bg-gradient-to-br ${selectedApp.color} rounded-xl flex items-center justify-center`}>
                  <selectedApp.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {selectedApp.name}
                </h2>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {selectedApp.name} integration is coming soon! For now, you can use our Custom Webhook feature to connect with {selectedApp.name}.
                </p>
              </div>

              {selectedApp.name === "Zapier" && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-orange-900 text-sm">Pro tip:</h4>
                      <p className="text-xs sm:text-sm text-orange-800 mt-1">
                        You can already use Formboom with Zapier! Just use the Custom Webhook URL in your Zapier trigger.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCloseDialog}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
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