import { useEffect, useRef } from 'react';

const DemoFormPreview = ({ alias, template }) => {
  const formEndpoint = `${import.meta.env.VITE_FORM_ENDPOINT || 'http://localhost:3000'}/${alias || 'demo'}`;
  const backRef = useRef(null);
  const tsRef = useRef(null);
  const hpRef = useRef(null);

  useEffect(() => {
    // Set the exact current URL for back navigation
    const currentUrl = window.location.href;
    console.log('Setting _fb_back to:', currentUrl);
    if (backRef.current) backRef.current.value = currentUrl;
    if (tsRef.current) tsRef.current.value = Date.now().toString();
    if (hpRef.current) hpRef.current.value = '';
  }, []);

  const defaultTemplate = {
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your first and last name' },
      { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@doe.com' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter your message...' }
    ]
  };

  const currentTemplate = template || defaultTemplate;

  const renderField = (field, index) => {
    const baseClasses = "mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 text-sm sm:text-base";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={index}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            className={`${baseClasses} resize-none min-h-[100px]`}
            rows="4"
            required={field.required}
          ></textarea>
        );
      case 'select':
        return (
          <select
            key={index}
            name={field.name}
            id={field.name}
            className={baseClasses}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, optIndex) => (
              <option key={optIndex} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            key={index}
            type="date"
            name={field.name}
            id={field.name}
            className={baseClasses}
            required={field.required}
          />
        );
      default:
        return (
          <input
            key={index}
            type={field.type}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            className={baseClasses}
            required={field.required}
          />
        );
    }
  };

  return (
    <section className="formboom-container w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">Preview Form</h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                How your form appears to users
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          action={formEndpoint}
          method="POST"
          encType="application/x-www-form-urlencoded"
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <input type="hidden" name="_fb_back" id="_fb_back" ref={backRef} defaultValue="" />
          <input type="text" name="_fb_hp" id="_fb_hp" ref={hpRef} defaultValue="" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <input type="hidden" name="_fb_ts" id="_fb_ts" ref={tsRef} defaultValue="" />
          {currentTemplate.fields.map((field, index) => (
            <div key={index} className="formcarry-block">
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-gray-800 mb-1"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1 text-xs">*</span>
                )}
              </label>
              {renderField(field, index)}
            </div>
          ))}

          {/* Submit Button */}
          <div className="formcarry-block pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Submit Form</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Powered by <span className="font-semibold text-primary">FormBoom</span>
            </p>
          </div>
        </form>
      </div>

      {/* Mobile optimization hint */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-blue-800">
              <span className="font-semibold">Mobile-First Design:</span> This form automatically adapts to any screen size for the best user experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoFormPreview;