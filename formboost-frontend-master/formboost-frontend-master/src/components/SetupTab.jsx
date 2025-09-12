import { useState } from "react";
import { Copy, Check, Eye, Code2, Link, FileText, Monitor, Smartphone } from "lucide-react";
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
  border-color: #0080FF;
  box-shadow: 0 0 0 3px rgba(0, 128, 255, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #0080FF, #0066CC);
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
  box-shadow: 0 8px 25px rgba(0, 128, 255, 0.3);
}
</style>`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Setup Your Form
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Copy the code and integrate your form, or test it with our interactive preview
          </p>
        </div>

        {/* Form Endpoint Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Link className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  Form Endpoint
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  Your unique API URL for form submissions
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Endpoint URL
                </label>
                <div className="bg-white rounded-md sm:rounded-lg border border-gray-300 p-2 sm:p-3 lg:p-4 shadow-sm">
                  <code className="text-xs sm:text-sm text-[#0080FF] font-mono break-all">
                    {formEndpoint}
                  </code>
                </div>
              </div>
              <button
                onClick={() => handleCopy(formEndpoint)}
                className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-[#0080FF] to-blue-600 hover:from-[#0070E0] hover:to-blue-700 text-white font-semibold py-2 px-3 sm:py-3 sm:px-4 lg:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm min-w-0 sm:min-w-[120px]"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-[#0080FF] to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    Interactive Demo
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Test your form and get the production-ready code
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === "preview"
                    ? "bg-white text-[#0080FF] border-[#0080FF] shadow-sm"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Preview</span>
                <Monitor className="h-3 w-3 opacity-60 hidden sm:block" />
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === "code" 
                    ? "bg-white text-[#0080FF] border-[#0080FF] shadow-sm" 
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Code2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Get Code</span>
                <Smartphone className="h-3 w-3 opacity-60 hidden sm:block" />
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="">
            {activeTab === "preview" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                  {/* Preview Container */}
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200">
                      <DemoFormPreview alias={alias} template={template} />
                    </div>
                  </div>
                  
                  {/* Info Panel */}
                  <div className="lg:w-80">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-blue-200">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                        Form Features
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Mobile-first responsive design</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Real-time form validation</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Anti-spam protection</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Production-ready styling</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-700">Cross-browser compatible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Code Editor */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  <div className="bg-gray-800 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-xs sm:text-sm font-mono">form.html</span>
                    </div>
                    <div className="flex-1"></div>
                    <button
                      onClick={() => handleCopy(formCode)}
                      className="flex items-center gap-1 sm:gap-2 bg-[#0080FF] hover:bg-blue-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-md sm:rounded-lg transition-all duration-200 text-xs sm:text-sm"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="hidden sm:inline">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="sm:inline">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <SyntaxHighlighter 
                      language="htmlbars" 
                      style={atomOneDark} 
                      customStyle={{ 
                        margin: 0, 
                        borderRadius: 0, 
                        fontSize: window.innerWidth < 640 ? '12px' : '14px',
                        padding: window.innerWidth < 640 ? '1rem' : '1.5rem'
                      }}
                    >
                      {formCode}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Integration Instructions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-green-200">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Quick Integration
                    </h3>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
                      <div className="flex gap-2 sm:gap-3">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
                        <span>Copy the HTML code above</span>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
                        <span>Paste it into your website</span>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
                        <span>Start receiving form submissions!</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-blue-200">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Customization Tips
                    </h3>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
                      <div className="flex gap-2 sm:gap-3">
                        <span className="text-[#0080FF]">•</span>
                        <span>Modify CSS styles to match your brand</span>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <span className="text-[#0080FF]">•</span>
                        <span>Add or remove form fields as needed</span>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <span className="text-[#0080FF]">•</span>
                        <span>The form works with any HTML framework</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupTab;