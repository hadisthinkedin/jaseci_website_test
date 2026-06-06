// gtag.js utility for Google Analytics event tracking
// Usage: import { pageview, event } from './gtag';

export const GA_MEASUREMENT_ID = "G-V1KRXTNCWJ";

// Track pageviews
export const pageview = (url) => {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
// Supports extra GA params via rest (e.g., { transport_type: 'beacon' })
export const event = ({ action, category, label, value, ...rest }) => {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  }
};
