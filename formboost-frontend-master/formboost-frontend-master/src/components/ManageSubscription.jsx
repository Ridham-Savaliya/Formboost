import axios from "axios";
import { useState, useEffect } from "react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};

// Custom check icon component
const CheckIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Custom crown icon component
const CrownIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.5 4.5l3.8 4.8L12 4.5l5.7 4.8 3.8-4.8v11c0 .8-.7 1.5-1.5 1.5h-16c-.8 0-1.5-.7-1.5-1.5v-11zm19.5 13.5H2v2c0 .8.7 1.5 1.5 1.5h17c.8 0 1.5-.7 1.5-1.5v-2z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
  </div>
);

const PlanCard = ({
  plan,
  onSelect,
  isCurrentPlan,
  startDate,
  endDate,
  isPopular,
}) => (
  <div
    className={`relative transform transition-all duration-300 ${
      isCurrentPlan ? "ring-4 ring-blue-200 scale-105 rounded-2xl" : ""
    }`}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          Most Popular
        </span>
      </div>
    )}
    <div
      className={`h-full rounded-2xl overflow-hidden shadow-xl ${
        plan.name === "Premium"
          ? "bg-gradient-to-br from-indigo-600 to-purple-700"
          : "bg-gradient-to-br from-blue-500 to-blue-600"
      } text-white transition-transform duration-300`}
    >
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          {plan.name === "Premium" && <CrownIcon />}
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-lg text-white/80">/month</span>
        </div>

        <div className="h-px bg-white/20 my-6"></div>

        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center text-white/90 hover:text-white transition-colors"
            >
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            isCurrentPlan
              ? "bg-white/10 text-white/50 cursor-not-allowed"
              : "bg-white text-blue-600 hover:bg-opacity-90 hover:shadow-lg active:scale-95"
          }`}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </button>

        {isCurrentPlan && (
          <div className="mt-6 bg-black/10 rounded-xl backdrop-blur-sm">
            <div className="p-4">
              <p className="text-sm mb-2 text-white/90">
                <span className="font-semibold">Start Date:</span>{" "}
                {formatDate(startDate)}
              </p>
              <p className="text-sm text-white/90">
                <span className="font-semibold">End Date:</span>{" "}
                {plan.price === 0 ? "Forever" : formatDate(endDate)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ManageSubscription = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/plan`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        if (data.success) {
          setPlans(
            data.data.rows.map((plan) => ({
              id: plan.id,
              name: plan.name,
              price: plan.price,
              features: [
                `${plan.formLimit} Forms`,
                `${plan.submissionLimit} Submissions`,
              ],
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setError("Failed to fetch plans. Please try again later.");
      }
    };

    const fetchCurrentPlan = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/userplan/plan`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        if (data.success) {
          setCurrentPlan({
            planId: data.data.planId,
            name: data.data.Plan.name,
            price: data.data.Plan.price,
            startDate: data.data.startDate,
            endDate: data.data.endDate,
          });
        }
      } catch (error) {
        console.error("Failed to fetch current plan:", error);
      }
    };

    fetchPlans();
    fetchCurrentPlan();
  }, []);

  const handleSelectPlan = async (plan) => {
    setLoading(true);
    setError(null);

    try {
      const startDate = new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");
      const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userplan`,
        {
          planId: plan.id,
          startDate,
          endDate,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      if (response.data.success) {
        setCurrentPlan({
          planId: plan.id,
          name: plan.name,
          price: plan.price,
          startDate,
          endDate,
        });
        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className =
          "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500";
        successMessage.textContent = "Subscription updated successfully!";
        document.body.appendChild(successMessage);
        setTimeout(() => {
          successMessage.style.opacity = "0";
          setTimeout(() => document.body.removeChild(successMessage), 500);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to update subscription:", error);
      setError("Failed to update subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Manage Your Subscription
      </h1>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelectPlan}
            isCurrentPlan={currentPlan?.planId === plan.id}
            startDate={currentPlan?.startDate}
            endDate={currentPlan?.endDate}
            isPopular={index === 1} // Makes the middle plan "popular"
          />
        ))}
      </div>
    </div>
  );
};
