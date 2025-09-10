document.addEventListener("DOMContentLoaded", () => {
    console.log("success.js loaded"); // Debug: Confirm script is loaded
  
    // ✅ Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const tsParam = params.get("ts");
    const refParam = params.get("ref");
    const backParam = params.get("back");
  
    // Debug log
    console.log("URL Parameters:", { tsParam, refParam, backParam });
  
    // ✅ Handle Timestamp
    const now = tsParam ? new Date(decodeURIComponent(tsParam)) : new Date();
    const timestamp = now.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
    const tsElement = document.getElementById("timestamp");
    if (tsElement) tsElement.textContent = timestamp;
  
    // ✅ Handle Reference ID
    const referenceId =
      refParam || "FB-" + Date.now().toString(36).toUpperCase();
    const refElement = document.getElementById("referenceId");
    if (refElement) refElement.textContent = referenceId;
  
    // ✅ Handle Back Button
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (backParam) {
          const decodedBack = decodeURIComponent(backParam);
          console.log("Redirecting to:", decodedBack);
          window.location.href = decodedBack;
        } else {
          console.log("No backParam found, redirecting to home");
          window.location.href = "/";
        }
      });
    }
  });
  