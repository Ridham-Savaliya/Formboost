import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HiOutlineMail,
  HiOutlineLightningBolt,
  HiOutlineCalendar,
  HiOutlineSparkles
} from 'react-icons/hi';
import { FaTelegram } from 'react-icons/fa';

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const emailPercentage = (limits.emailUsed / limits.emailLimit) * 100;
  const isEmailNearLimit = emailPercentage >= 80;
  const isEmailCritical = emailPercentage >= 95;

  const getProgressColor = () => {
    if (isEmailCritical) return 'from-red-500 to-red-600';
    if (isEmailNearLimit) return 'from-amber-500 to-orange-500';
    return 'from-[#0080FF] to-blue-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl">
            <HiOutlineLightningBolt className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notification Limits</h3>
            <p className="text-xs text-gray-500">Monthly usage overview</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 space-y-5">
        {/* Email Notifications */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isEmailCritical ? 'bg-red-100' : isEmailNearLimit ? 'bg-amber-100' : 'bg-blue-100'}`}>
                <HiOutlineMail className={`w-4 h-4 ${isEmailCritical ? 'text-red-600' : isEmailNearLimit ? 'text-amber-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Email Notifications</p>
                <p className="text-xs text-gray-500">Monthly limit</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${isEmailCritical ? 'text-red-600' : isEmailNearLimit ? 'text-amber-600' : 'text-gray-900'}`}>
                {limits.emailUsed}
                <span className="text-gray-400 font-normal">/{limits.emailLimit}</span>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
                style={{ width: `${Math.min(emailPercentage, 100)}%` }}
              />
            </div>
            {/* Percentage Indicator */}
            <div className="absolute -top-1 right-0 transform translate-x-1/2"
              style={{ left: `${Math.min(emailPercentage, 100)}%` }}>
            </div>
          </div>

          {/* Warning Message */}
          {isEmailNearLimit && (
            <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${isEmailCritical ? 'text-red-600' : 'text-amber-600'}`}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {isEmailCritical ? 'Critical: Almost at limit!' : 'Approaching monthly limit'}
            </div>
          )}
        </div>

        {/* Telegram Notifications */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <FaTelegram className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Telegram Notifications</p>
                <p className="text-xs text-gray-500">No limits</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Unlimited</span>
            </div>
          </div>

          {/* Full Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 w-full" />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Send unlimited notifications via Telegram
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-b-2xl">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <HiOutlineCalendar className="w-4 h-4 text-blue-500" />
          <span>Limits reset on the <strong>1st of each month</strong></span>
        </div>
      </div>
    </div>
  );
};

export default NotificationLimits;
