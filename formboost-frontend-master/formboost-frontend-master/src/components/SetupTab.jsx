import { useState } from "react";
import DemoFormPreview from "./DemoFormPreview";

import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import SyntaxHighlighter from "react-syntax-highlighter";

const SetupTab = ({ alias, template }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const formEndpoint = `${import.meta.env.VITE_FORM_ENDPOINT}/${alias}`;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Default contact form template if none provided
  const defaultTemplate = {
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your first and last name' },
      { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@doe.com' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter your message...' }
    ]
  };
  
  const currentTemplate = template || defaultTemplate;
  
  const generateFieldHTML = (field) => {
    const requiredAttr = field.required ? ' required' : '';
    const placeholder = field.placeholder ? ` placeholder="${field.placeholder}"` : '';
    
    switch (field.type) {
      case 'textarea':
        return `    <div class="form-group">
      <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
      <textarea name="${field.name}" id="${field.name}"${placeholder}${requiredAttr}></textarea>
    </div>`;
      case 'select':
        const options = field.options?.map(option => `        <option value="${option}">${option}</option>`).join('\n') || '';
        return `    <div class="form-group">
      <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
      <select name="${field.name}" id="${field.name}"${requiredAttr}>
        <option value="">Select ${field.label}</option>
${options}
      </select>
    </div>`;
      default:
        return `    <div class="form-group">
      <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
      <input type="${field.type}" name="${field.name}" id="${field.name}"${placeholder}${requiredAttr} />
    </div>`;
    }
  };
  
  const formCode = `<form action="${formEndpoint}" method="POST" class="formboost-form">
  <input type="hidden" name="_fb_back" id="_fb_back" value="">
  ${currentTemplate.fields.map(generateFieldHTML).join('\n\n')}

  <div class="form-group">
    <button type="submit" class="submit-btn">Submit Form</button>
  </div>
</form>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    const backField = document.getElementById("_fb_back");
    if (backField) {
      backField.value = encodeURIComponent(window.location.href);
    }
  });
</script>

<style>
.formboost-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}
</style>`;


  return (
    <div className="space-y-8">
      {/* Form Endpoint Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Form Endpoint</h2>
            <p className="text-sm text-gray-600">
              This is your unique API URL for form submissions
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <code className="text-sm text-blue-600 font-mono bg-blue-50 px-3 py-2 rounded-lg flex-1 mr-3 overflow-hidden">
              {formEndpoint}
            </code>
            <button
              onClick={() => handleCopy(formEndpoint)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center space-x-2"
            >
              {isCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Form Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Interactive Demo</h2>
            <p className="text-sm text-gray-600">
              Test your form and copy the code to use on your website
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-0.5"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === "code" 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-0.5" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Code</span>
            </div>
          </button>
        </div>
        {activeTab === "preview" && <DemoFormPreview alias={alias} template={template} />}

        {activeTab === "code" && (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-300 text-sm font-medium ml-3">form.html</span>
              </div>
              <button
                onClick={() => handleCopy(formCode)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center space-x-2"
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <SyntaxHighlighter language="htmlbars" style={atomOneDark} customStyle={{ margin: 0, borderRadius: 0 }}>
              {formCode}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupTab;
