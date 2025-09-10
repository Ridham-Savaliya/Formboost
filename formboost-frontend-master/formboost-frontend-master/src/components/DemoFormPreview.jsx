const DemoFormPreview = ({ alias, template }) => {
  const formEndpoint = `${import.meta.env.VITE_FORM_ENDPOINT || 'http://localhost:3000'}/${alias || 'demo'}`;
  
  // Default contact form template if none provided
  const defaultTemplate = {
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your first and last name' },
      { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@doe.com' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Enter your message...' }
    ]
  };
  
  const currentTemplate = template || defaultTemplate;
  
  const renderField = (field, index) => {
    const baseClasses = "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={index}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            className={`${baseClasses} resize-none`}
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
    <section className="formboost-container max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h3 className="text-white font-semibold text-lg">Preview Form</h3>
          <p className="text-blue-100 text-sm mt-1">This is how your form will appear to users</p>
        </div>
        
        <form
          action={formEndpoint}
          method="POST"
          encType="application/x-www-form-urlencoded"
          className="p-6 space-y-6"
        >
          {currentTemplate.fields.map((field, index) => (
            <div key={index} className="formcarry-block">
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field, index)}
            </div>
          ))}

          <div className="formcarry-block pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-30"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DemoFormPreview;
