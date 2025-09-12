import React, { useState } from 'react';
import { IoClose, IoMail, IoChatbubble, IoTime, IoFlash } from 'react-icons/io5';

const EmailDelayBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

      <div className="flex items-start gap-3 relative z-10">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <IoTime className="w-4 h-4 text-amber-600" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-amber-800">
              Email Delivery Notice
            </h3>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-700 text-xs font-medium rounded-full">
              Important
            </span>
          </div>

          <p className="text-sm text-amber-700 mb-3 leading-relaxed">
            Email notifications may be delayed by 5–10 minutes or occasionally fail due to domain-related issues.
            For faster and more reliable alerts, we recommend connecting via <strong>Telegram</strong>, <strong>Slack</strong>, or <strong>Google Sheets</strong> integrations.
          </p>


          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-600">
              <IoMail className="w-3 h-3" />
              <span>Email: 5-10 min delay</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <IoFlash className="w-3 h-3" />
              <span>Telegram | Slack | Google Sheets: Instant</span>
            </div>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0080FF] text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors duration-200"
              onClick={() => {
                // This could navigate to telegram setup or scroll to it
                const telegramSection = document.getElementById('telegram-setup');
                if (telegramSection) {
                  telegramSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <IoChatbubble className="w-3 h-3" />
              Setup Your Integration
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1 text-amber-400 hover:text-amber-600 transition-colors duration-200"
          aria-label="Dismiss notification"
        >
          <IoClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmailDelayBanner;
