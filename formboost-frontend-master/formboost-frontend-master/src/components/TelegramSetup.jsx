import React, { useState, useEffect } from 'react';
import { IoChatbubble, IoRocket, IoCheckmarkCircle, IoOpenOutline, IoFlash, IoTime, IoWarning } from 'react-icons/io5';
import { FaHashtag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const TelegramSetup = ({ 
  formId, 
  telegramNotification, 
  setTelegramNotification,
  telegramBotToken,
  setTelegramBotToken,
  telegramChatId,
  setTelegramChatId,
  onUpdate 
}) => {
  const [step, setStep] = useState(1);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [resolvingChat, setResolvingChat] = useState(false);
  const [botInfo, setBotInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle, connecting, success, error

  // Auto-advance steps based on filled fields
  useEffect(() => {
    if (telegramBotToken && step === 1) {
      setStep(2);
      validateBotToken();
    }
    if (telegramChatId && step === 2) {
      setStep(3);
    }
  }, [telegramBotToken, telegramChatId, step]);

  // Re-validate when bot token changes
  useEffect(() => {
    if (telegramBotToken && telegramBotToken.length > 10) {
      validateBotToken();
    }
  }, [telegramBotToken]);

  const validateBotToken = async () => {
    if (!telegramBotToken) return;
    
    setConnectionStatus('connecting');
    try {
      // This would be a new endpoint to validate bot token
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/telegram/validate-bot`,
        {
          params: { botToken: telegramBotToken },
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      
      if (response.data.success) {
        setBotInfo(response.data.data);
        setConnectionStatus('success');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Bot validation failed:', error);
    }
  };

  const handleResolveChatId = async () => {
    try {
      setResolvingChat(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/telegram/resolve-chat`,
        {
          params: { botToken: telegramBotToken },
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const chatId = res?.data?.data?.chatId;
      if (chatId) {
        setTelegramChatId(chatId);
        toast.success("Chat ID detected and filled automatically!");
        setStep(3);
      } else {
        toast.warn("No recent chat found. Please start a conversation with your bot first.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to resolve chat ID");
    } finally {
      setResolvingChat(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setIsTestingConnection(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/form/${formId}/test-notifications`,
        { testTelegramOnly: true },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      
      if (res?.data?.data?.telegramSent) {
        toast.success("🎉 Test notification sent successfully!");
        setStep(4);
      } else {
        toast.error("Test failed. Please check your configuration.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send test notification");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <React.Fragment key={stepNum}>
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
            ${stepNum <= currentStep 
              ? 'bg-[#0080FF] border-[#0080FF] text-white' 
              : 'bg-white border-gray-300 text-gray-400'
            }
          `}>
            {stepNum < currentStep ? (
              <IoCheckmarkCircle className="w-5 h-5" />
            ) : (
              <span className="text-sm font-semibold">{stepNum}</span>
            )}
          </div>
          {stepNum < totalSteps && (
            <div className={`
              w-12 h-0.5 mx-2 transition-all duration-300
              ${stepNum < currentStep ? 'bg-[#0080FF]' : 'bg-gray-300'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div id="telegram-setup" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-[#0080FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <IoChatbubble className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Telegram Notifications</h3>
        <p className="text-gray-600">Get instant notifications when someone submits your form</p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <IoTime className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-gray-600">Email: 5-10 min delay</span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-3">
            <IoFlash className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Telegram: Instant</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3">
          <IoChatbubble className="w-5 h-5 text-[#0080FF]" />
          <span className="font-medium text-gray-900">Enable Telegram Notifications</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={telegramNotification}
            onChange={(e) => setTelegramNotification(e.target.checked)}
          />
          <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0080FF] transition-all duration-300" />
          <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-7 shadow-sm" />
        </label>
      </div>

      {telegramNotification && (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
          <StepIndicator currentStep={step} totalSteps={4} />

          {/* Step 1: Bot Token */}
          <div className={`transition-all duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#0080FF] text-white' : 'bg-gray-200 text-gray-400'}`}>
                <IoRocket className="w-4 h-4" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Create Your Bot</h4>
            </div>
            
            <div className="ml-11 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <IoWarning className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Quick Setup:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                      <li>Open Telegram and search for <strong>@BotFather</strong></li>
                      <li>Send <code className="bg-blue-100 px-1 rounded">/newbot</code> and follow instructions</li>
                      <li>Copy the bot token and paste it below</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-[#0080FF] transition-colors"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
                  />
                </div>
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-[#0080FF] text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <IoOpenOutline className="w-4 h-4" />
                  <span>Open BotFather</span>
                </a>
              </div>

              {connectionStatus === 'connecting' && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Validating bot token...</span>
                </div>
              )}

              {connectionStatus === 'success' && botInfo && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-green-800">
                    <IoCheckmarkCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Bot connected: @{botInfo.username}</span>
                  </div>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2 text-red-800">
                    <IoWarning className="w-4 h-4" />
                    <span className="text-sm">Invalid bot token. Please check and try again.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Chat ID */}
          {step >= 2 && (
            <div className={`transition-all duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#0080FF] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <FaHashtag className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Connect Your Chat</h4>
              </div>
              
              <div className="ml-11 space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <IoChatbubble className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Start a conversation with your bot:</p>
                      <p>Open your bot in Telegram and send <code className="bg-amber-100 px-1 rounded">/start</code></p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:border-[#0080FF] transition-colors"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="Chat ID will be auto-detected"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    onClick={handleResolveChatId}
                    disabled={!telegramBotToken || resolvingChat}
                  >
                    {resolvingChat ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <IoFlash className="w-4 h-4" />
                        <span>Auto-detect</span>
                      </>
                    )}
                  </button>
                </div>

                {botInfo && (
                  <a
                    href={`https://t.me/${botInfo.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-[#0080FF] hover:text-blue-600 text-sm"
                  >
                    <IoOpenOutline className="w-4 h-4" />
                    <span>Open @{botInfo.username}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Test Connection */}
          {step >= 3 && (
            <div className={`transition-all duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#0080FF] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <IoFlash className="w-4 h-4" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Test Your Setup</h4>
              </div>
              
              <div className="ml-11">
                <button
                  type="button"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  onClick={handleTestNotification}
                  disabled={!telegramBotToken || !telegramChatId || isTestingConnection}
                >
                  {isTestingConnection ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending test...</span>
                    </>
                  ) : (
                    <>
                      <IoChatbubble className="w-4 h-4" />
                      <span>Send Test Notification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step >= 4 && (
            <div className="transition-all duration-300 opacity-100">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <IoCheckmarkCircle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-800">Setup Complete!</h4>
                </div>
                <p className="text-green-700 ml-11">
                  Your Telegram notifications are now active. You'll receive instant alerts for new form submissions.
                </p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onUpdate}
              className="px-6 py-3 bg-[#0080FF] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Save Telegram Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramSetup;
