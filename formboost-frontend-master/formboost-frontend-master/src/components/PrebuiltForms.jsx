import { useState, useEffect } from 'react';
import axios from "axios";
import { decodeTokenUserId } from "../utils/constants";
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { authState } from '../recoil/auth';

const PrebuiltForms = ({ onFormCreated }) => {
  const [isCreating, setIsCreating] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const auth = useRecoilValue(authState);

  const prebuiltForms = [
    {
      id: 'contact',
      name: 'Contact Form',
      description: 'A simple contact form for general inquiries',
      icon: '📞',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
        { name: 'subject', label: 'Subject', type: 'text', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true }
      ],
      color: 'bg-primary'
    },
    {
      id: 'inquiry',
      name: 'Inquiry Form',
      description: 'Detailed inquiry form for business inquiries',
      icon: '💼',
      fields: [
        { name: 'company', label: 'Company Name', type: 'text', required: true },
        { name: 'contact_person', label: 'Contact Person', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'inquiry_type', label: 'Inquiry Type', type: 'select', required: true, options: ['General', 'Sales', 'Support', 'Partnership'] },
        { name: 'budget', label: 'Budget Range', type: 'select', required: false, options: ['Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000', 'Over $10,000'] },
        { name: 'timeline', label: 'Project Timeline', type: 'select', required: false, options: ['ASAP', '1-3 months', '3-6 months', '6+ months'] },
        { name: 'description', label: 'Project Description', type: 'textarea', required: true }
      ],
      color: 'bg-green-500'
    },
    {
      id: 'appointment',
      name: 'Appointment Form',
      description: 'Book appointments and schedule meetings',
      icon: '📅',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'service', label: 'Service Type', type: 'select', required: true, options: ['Consultation', 'Meeting', 'Demo', 'Support', 'Other'] },
        { name: 'preferred_date', label: 'Preferred Date', type: 'date', required: true },
        { name: 'preferred_time', label: 'Preferred Time', type: 'select', required: true, options: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
        { name: 'duration', label: 'Duration', type: 'select', required: true, options: ['30 minutes', '1 hour', '1.5 hours', '2 hours'] },
        { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
      ],
      color: 'bg-purple-500'
    },
    {
      id: 'feedback',
      name: 'Feedback Form',
      description: 'Collect customer feedback and reviews',
      icon: '⭐',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'rating', label: 'Rating', type: 'select', required: true, options: ['1 - Poor', '2 - Fair', '3 - Good', '4 - Very Good', '5 - Excellent'] },
        { name: 'category', label: 'Feedback Category', type: 'select', required: true, options: ['Product', 'Service', 'Support', 'Website', 'Other'] },
        { name: 'experience', label: 'Overall Experience', type: 'select', required: true, options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] },
        { name: 'recommend', label: 'Would you recommend us?', type: 'select', required: true, options: ['Yes', 'No', 'Maybe'] },
        { name: 'comments', label: 'Comments', type: 'textarea', required: true }
      ],
      color: 'bg-yellow-500'
    },
    {
      id: 'registration',
      name: 'Registration Form',
      description: 'Event or course registration form',
      icon: '📝',
      fields: [
        { name: 'first_name', label: 'First Name', type: 'text', required: true },
        { name: 'last_name', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'organization', label: 'Organization', type: 'text', required: false },
        { name: 'job_title', label: 'Job Title', type: 'text', required: false },
        { name: 'dietary_requirements', label: 'Dietary Requirements', type: 'textarea', required: false },
        { name: 'special_requests', label: 'Special Requests', type: 'textarea', required: false }
      ],
      color: 'bg-primary'
    },
    {
      id: 'survey',
      name: 'Survey Form',
      description: 'Comprehensive survey and questionnaire',
      icon: '📊',
      fields: [
        { name: 'age_group', label: 'Age Group', type: 'select', required: true, options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'occupation', label: 'Occupation', type: 'text', required: true },
        { name: 'question1', label: 'How did you hear about us?', type: 'select', required: true, options: ['Social Media', 'Search Engine', 'Friend/Family', 'Advertisement', 'Other'] },
        { name: 'question2', label: 'How often do you use our service?', type: 'select', required: true, options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First time'] },
        { name: 'satisfaction', label: 'Overall Satisfaction', type: 'select', required: true, options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] },
        { name: 'suggestions', label: 'Suggestions for Improvement', type: 'textarea', required: false }
      ],
      color: 'bg-pink-500'
    }
  ];

  // Fetch user email on component mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (auth.token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`,
            {
              headers: {
                Authorization: auth.token,
              },
            }
          );
          if (response.data.success && response.data.data.email) {
            setUserEmail(response.data.data.email);
          }
        } catch (error) {
          console.error('Error fetching user email:', error);
        }
      }
    };

    fetchUserEmail();
  }, [auth.token]);

  const createPrebuiltForm = async (template) => {
    setIsCreating(template.id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form`,
        {
          formName: template.name,
          formDescription: template.description,
          targetEmail: userEmail || 'noreply@formboost.site', // Use user's email as default
          emailNotification: true,
          filterSpam: true,
          isPrebuilt: true,
          // Persist full template for demo persistence (DB column is TEXT)
          prebuiltTemplate: JSON.stringify(template)
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        toast.success(`${template.name} created successfully!`);
        // Pass template data along with form data for dynamic demo
        onFormCreated({ ...response.data.data, template });
      }
    } catch (error) {
      console.error("Error creating prebuilt form:", error);
      const backendMsg = error?.response?.data?.message;
      if (backendMsg && /reached your form submission limit/i.test(backendMsg)) {
        // Try to reuse an existing prebuilt form for this template
        try {
          const token = localStorage.getItem("token");
          const userId = token ? decodeTokenUserId(token) : null;
          if (userId) {
            const formsRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${userId}/forms`,
              { headers: { Authorization: token } }
            );
            const existing = (formsRes?.data?.data || []).find((f) => {
              if (!f.isPrebuilt || !f.prebuiltTemplate) return false;
              try {
                const t = JSON.parse(f.prebuiltTemplate);
                return (t?.id ?? t) === template.id;
              } catch {
                return false;
              }
            });
            if (existing) {
              toast.info("Plan limit reached. Reusing your existing template form.");
              onFormCreated({ ...existing, template });
              return;
            }
          }
        } catch (e) {
          console.warn("Failed to reuse existing prebuilt form:", e);
        }
        toast.error(backendMsg + ' Visit Pricing to upgrade.');
      } else if (backendMsg && /Data too long/i.test(backendMsg)) {
        toast.error("Template payload too large. Please try again.");
      } else {
        toast.error("Failed to create form");
      }
    } finally {
      setIsCreating(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 p-[8px] sm:p-4 lg:p-6">
      <div className="mb-2 sm:mb-4 lg:mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-12 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Premium Templates</h3>
            <p className="text-gray-600 mt-1">Professional form templates to get you started instantly</p>
          </div>
        </div>
        {userEmail && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-3 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-800">Forms will be sent to: {userEmail}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prebuiltForms.map((template) => (
          <div
            key={template.id}
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-3xl opacity-50"></div>
            
            <div className="flex items-center mb-4 relative z-10">
              <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center text-white text-2xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {template.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{template.name}</h4>
                <p className="text-sm text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {template.fields.length} fields
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-5 leading-relaxed">{template.description}</p>
            
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Included Fields:
              </h5>
              <div className="flex flex-wrap gap-2">
                {template.fields.slice(0, 4).map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/30 font-medium"
                  >
                    {field.label}
                  </span>
                ))}
                {template.fields.length > 4 && (
                  <span className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full border border-gray-200 font-medium">
                    +{template.fields.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => createPrebuiltForm(template)}
              disabled={isCreating === template.id}
              className="w-full bg-primary hover:bg-primary-700 text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isCreating === template.id ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Form</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">💡 Pro Tips</h3>
            <div className="mt-2 text-gray-700 space-y-2">
              <p className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Customize forms after creation by editing settings, fields, and notifications</span>
              </p>
              <p className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Enable Telegram notifications for instant form submission alerts</span>
              </p>
              <p className="flex items-start">
                <span className="text-pink-600 mr-2">•</span>
                <span>All forms include built-in spam filtering and email notifications</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrebuiltForms;
