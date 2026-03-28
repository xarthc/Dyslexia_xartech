// Mock Analytics and A/B Testing Utility

const ANALYTICS_STORAGE_KEY = "dyslexis_analytics";

export const trackEvent = (eventName, data = {}) => {
  const event = {
    eventName,
    data,
    timestamp: new Date().toISOString(),
    sessionId: sessionStorage.getItem("session_id") || "unknown"
  };
  
  console.log(`[Analytics] ${eventName}`, data);
  
  // Save to localStorage for demo purposes
  const logs = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || "[]");
  logs.push(event);
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(logs.slice(-100))); // Keep last 100
};

export const getAbTestGroup = (testName) => {
  const key = `ab_test_${testName}`;
  let group = localStorage.getItem(key);
  
  if (!group) {
    group = Math.random() > 0.5 ? "A" : "B";
    localStorage.setItem(key, group);
  }
  
  return group;
};

// Initialize session ID
if (!sessionStorage.getItem("session_id")) {
  sessionStorage.setItem("session_id", Math.random().toString(36).substring(7));
}
