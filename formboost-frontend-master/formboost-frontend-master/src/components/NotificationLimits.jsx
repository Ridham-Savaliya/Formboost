import { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationLimits = ({ userId }) => {
  const [limits, setLimits] = useState({
    emailUsed: 0,
    emailLimit: 50,
    telegramUsed: 'unlimited',
    telegramLimit: 'unlimited'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchLimits = async () => {
      try {
        setLoading(true);
        // This would be a new endpoint to get notification limits
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${userId}/notification-limits`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.data.success) {
          setLimits(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch notification limits:', error);
        // Set default values if API fails
        setLimits({
          emailUsed: 0,
          emailLimit: 50,
          telegramUsed: 'unlimited',
          telegramLimit: 'unlimited'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Limits</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  const emailPercentage = (limits.emailUsed / limits.emailLimit) * 100;
  const isEmailNearLimit = emailPercentage >= 80;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">Notification Limits</h3>
      
      {/* Email Notifications */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Email Notifications</span>
          <span className={`text-xs sm:text-sm font-semibold ${isEmailNearLimit ? 'text-red-600' : 'text-gray-600'}`}>
            {limits.emailUsed} / {limits.emailLimit} per month
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              isEmailNearLimit ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(emailPercentage, 100)}%` }}
          ></div>
        </div>
        
        {isEmailNearLimit && (
          <p className="text-xs text-red-600 mt-1">
            ⚠️ You're approaching your monthly email limit
          </p>
        )}
        
        <p className="text-xs text-gray-500 mt-1">
          Email notifications are limited to {limits.emailLimit} per month
        </p>
      </div>

      {/* Telegram Notifications */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Telegram Notifications</span>
          <span className="text-xs sm:text-sm font-semibold text-green-600">
            {limits.telegramUsed}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div className="h-2 sm:h-2.5 rounded-full bg-green-500 w-full"></div>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          Telegram notifications are unlimited
        </p>
      </div>

      {/* Reset Info */}
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          📅 Limits reset on the 1st of each month
        </p>
      </div>
    </div>
  );
};

export default NotificationLimits;
