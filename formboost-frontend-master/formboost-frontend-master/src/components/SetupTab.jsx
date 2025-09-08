import { useState } from "react";
import DemoFormPreview from "./DemoFormPreview";

import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import SyntaxHighlighter from "react-syntax-highlighter";

const SetupTab = ({ alias }) => {
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

  const formCode = `<form action="${formEndpoint}" method="POST" >

    <div class="block">
      <label for="name">Full Name</label>
      <input type="text" name="name" id="name" placeholder="Your first and last name" />
    </div>
    
    <div class="block">
      <label for="email">Your Email Address</label>
      <input type="email" name="email" id="email" placeholder="john@doe.com" />
    </div>
    
    <div class="block">
      <label for="message">Your message</label>
      <textarea name="message" id="message" placeholder="Enter your message..."></textarea>
    </div>
    
    <div class="block">  
      <button type="submit">Send</button>
    </div>
    
  </form>`;

  return (
    <div className="space-y-8">
      {/* Form Endpoint Section */}
      <div className="bg-white ">
        <h2 className="text-xl font-semibold mb-2">Your Form Endpoint</h2>
        <p className="text-sm text-gray-600 mb-4">
          This is the unique API URL for your form, you will be sending your
          form data to this URL.
        </p>
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
          <span className="text-sm text-gray-800 mr-2 overflow-hidden overflow-ellipsis">
            {formEndpoint}
          </span>
          <button
            onClick={() => handleCopy(formEndpoint)}
            className="bg-white text-gray-700 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {isCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Demo Form Section */}
      <div className="bg-white">
        <h2 className="text-xl font-semibold mb-2">Demo Form</h2>
        <p className="text-sm text-gray-600 mb-4">
          Try the demo form down below, submit and see how FormBoost works copy
          the code and use it on your website if you want to have working form
          fast.
        </p>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded ${
              activeTab === "preview"
                ? "bg-[#0080FF] text-white"
                : "bg-gray-200"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded ${
              activeTab === "code" ? "bg-[#0080FF] text-white" : "bg-gray-200"
            }`}
          >
            Code
          </button>
        </div>
        {activeTab === "preview" && <DemoFormPreview />}

        {activeTab === "code" && (
          <div className="relative">
            <SyntaxHighlighter language="htmlbars" style={atomOneDark}>
              {formCode}
            </SyntaxHighlighter>
            <button
              onClick={() => handleCopy(formCode)}
              className="absolute top-2 right-2 bg-white text-gray-700 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupTab;
