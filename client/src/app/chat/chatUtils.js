import { valueOrNA } from '../../lib/format';

export const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createMessage = (role, content, extra = {}) => ({
  id: createId(),
  role,
  content,
  timestamp: new Date(),
  ...extra,
});

/** Derived from live data on every render, so it never shows a stale or invented AQI. */
export function buildGreeting(airData, city) {
  const intro = "Hello! I'm your AirAware Environmental Assistant.";
  if (airData?.aqi === null || airData?.aqi === undefined) {
    return `${intro} I'm loading live air quality for ${city}. Ask me about your health or how to reduce your emissions.`;
  }
  return `${intro} Live AQI in ${city} is ${airData.aqi} (${airData.severity ?? 'status unavailable'}). How can I help protect your health or reduce your emissions today?`;
}

export function formatContextSummary(airData, city) {
  const aqi = valueOrNA(airData?.aqi);
  const severity = airData?.severity ?? 'Loading';
  const temp = valueOrNA(airData?.weather?.temperature, '°C');
  return `${city} • AQI ${aqi} (${severity}) • Temp ${temp}`;
}

export function buildErrorText(city, guidance) {
  return guidance
    ? `I couldn't reach the AI model just now. In the meantime, here is the latest guidance for ${city}: ${guidance}`
    : "I couldn't reach the AI model just now. Please try again in a moment.";
}

/** AI output is untrusted: only accept arrays of non-empty strings / non-empty strings. */
export const toStringList = (value) =>
  Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()) : [];

export const toText = (value) => (typeof value === 'string' && value.trim() ? value : null);
