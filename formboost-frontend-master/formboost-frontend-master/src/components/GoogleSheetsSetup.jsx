import { useState, useEffect } from "react";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaCheck, FaTimes, FaExternalLinkAlt, FaInfoCircle, FaCopy } from "react-icons/fa";
import { IoRocket, IoCheckmarkCircle, IoFlash } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";

export const GoogleSheetsSetup = ({ formId, form }) => {
  const [googleSheetsId, setGoogleSheetsId] = useState(form?.googleSheetsId || "");
  const [googleSheetsEnabled, setGoogleSheetsEnabled] = useState(form?.googleSheetsEnabled || false);
  const [isTestingSheets, setIsTestingSheets] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    if (form) {
      setGoogleSheetsId(form.googleSheetsId || "");
      setGoogleSheetsEnabled(form.googleSheetsEnabled || false);
    }
  }, [form]);

  const saveSheetsSettings = async () => {
    if (!formId) {
      toast.error("Form ID is required");
      return;
    }

    setIsSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_googlesheets`,
        {
          googleSheetsId: googleSheetsId.trim() || null,
          googleSheetsEnabled: Boolean(googleSheetsEnabled && googleSheetsId.trim()),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      toast.success("Google Sheets settings saved successfully!");
    } catch (error) {
      console.error("Error saving Google Sheets settings:", error);
      toast.error("Failed to save Google Sheets settings");
    } finally {
      setIsSaving(false);
    }
  };

  const testSheets = async () => {
    if (!googleSheetsId.trim()) {
      toast.error("Please enter a Google Sheets ID first");
      return;
    }

    setIsTestingSheets(true);
    setTestResult(null);
    
    try {
      // Save latest settings before testing
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/update_googlesheets`,
        {
          googleSheetsId: googleSheetsId.trim() || null,
          googleSheetsEnabled: Boolean(googleSheetsEnabled && googleSheetsId.trim()),
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/test-googlesheets`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      
      const result = response.data.data;
      setTestResult(result);
      
      if (result.success) {
        toast.success(`✅ Google Sheets test successful! Check your spreadsheet.`);
      } else {
        toast.error(`❌ Google Sheets test failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Google Sheets test error:", error);
      const errorMsg = error.response?.data?.message || "Failed to test Google Sheets integration";
      toast.error(`❌ ${errorMsg}`);
      setTestResult({ success: false, error: errorMsg });
    } finally {
      setIsTestingSheets(false);
    }
  };

  const extractSheetId = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleUrlPaste = (e) => {
    const pastedText = e.target.value;
    const extractedId = extractSheetId(pastedText);
    setGoogleSheetsId(extractedId);
  };

  const copyExampleId = () => {
    const exampleId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
    navigator.clipboard.writeText(exampleId);
    toast.success("Example ID copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <LuFileSpreadsheet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Google Sheets Integration</h3>
          <p className="text-gray-600">Automatically populate spreadsheet rows with form data</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 mb-2">Why use Google Sheets integration?</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Automatic data entry</strong> - No manual copy-pasting needed</li>
              <li>• <strong>Real-time updates</strong> - New rows added instantly</li>
              <li>• <strong>Easy analysis</strong> - Use charts, filters, and formulas</li>
              <li>• <strong>Team collaboration</strong> - Share data with your team</li>
              <li>• <strong>Data backup</strong> - Never lose form submissions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <IoRocket className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Enable Google Sheets</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={googleSheetsEnabled}
              onChange={(e) => setGoogleSheetsEnabled(e.target.checked)}
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all duration-300" />
            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-sm" />
          </label>
        </div>

        {/* Setup Instructions */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">📋 Setup Instructions</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p><strong>Create a Google Sheet</strong></p>
                <p className="text-blue-700">Go to sheets.google.com and create a new spreadsheet</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p><strong>Make it publicly accessible</strong></p>
                <p className="text-blue-700">Share → Anyone with the link can edit</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p><strong>Copy the Sheet ID</strong></p>
                <p className="text-blue-700">From the URL: /spreadsheets/d/<strong>SHEET_ID</strong>/edit</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p><strong>Paste the ID below</strong></p>
                <p className="text-blue-700">FormBoost will auto-create headers and add rows</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-3">
            <a 
              href="https://sheets.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <span>Open Google Sheets</span>
              <FaExternalLinkAlt className="w-3 h-3" />
            </a>
            <button
              onClick={copyExampleId}
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 font-medium"
            >
              <FaCopy className="w-3 h-3" />
              <span>Copy Example ID</span>
            </button>
          </div>
        </div>

        {/* Sheet ID Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Sheets ID
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors font-mono text-sm"
            value={googleSheetsId}
            onChange={handleUrlPaste}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            disabled={!googleSheetsEnabled}
          />
          <p className="text-sm text-gray-500 mt-1">
            You can paste the full URL - we'll extract the ID automatically
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
                  ? 'Test row added successfully! Check your Google Sheet.' 
                  : `Test failed: ${testResult.error}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={testSheets}
            disabled={!googleSheetsId.trim() || isTestingSheets}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isTestingSheets ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <IoFlash className="w-4 h-4" />
                <span>Add Test Row</span>
              </>
            )}
          </button>
          
          <button
            onClick={saveSheetsSettings}
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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

        {/* Data Format Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">📊 Data Format</h4>
          <p className="text-sm text-gray-600 mb-3">
            FormBoost will automatically create these columns in your sheet:
          </p>
          <div className="bg-white border rounded p-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-1 font-semibold">Timestamp</th>
                  <th className="text-left p-1 font-semibold">Form Name</th>
                  <th className="text-left p-1 font-semibold">Form ID</th>
                  <th className="text-left p-1 font-semibold">IP Address</th>
                  <th className="text-left p-1 font-semibold">Name</th>
                  <th className="text-left p-1 font-semibold">Email</th>
                  <th className="text-left p-1 font-semibold">Message</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-600">
                  <td className="p-1">{new Date().toISOString()}</td>
                  <td className="p-1">Contact Form</td>
                  <td className="p-1">form-123</td>
                  <td className="p-1">192.168.1.1</td>
                  <td className="p-1">John Doe</td>
                  <td className="p-1">john@example.com</td>
                  <td className="p-1">Hello world!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
