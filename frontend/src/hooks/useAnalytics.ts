import { useCallback } from 'react';

// Simple localStorage-based analytics and feedback store
// No backend required. Provides utilities to track events and export data.

type AnalyticsEvent = {
  id: string;
  type: string;
  payload?: Record<string, any>;
  ts: number;
};

type Feedback = {
  id: string;
  rating: number;
  message: string;
  language?: string;
  includeUsage?: boolean;
  ts: number;
};

const EVENTS_KEY = 'cc_analytics_events';
const FEEDBACK_KEY = 'cc_feedbacks';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function useAnalytics() {
  const trackEvent = useCallback((type: string, payload?: Record<string, any>) => {
    const events = read<AnalyticsEvent[]>(EVENTS_KEY, []);
    const evt: AnalyticsEvent = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      type,
      payload,
      ts: Date.now(),
    };
    events.push(evt);
    write(EVENTS_KEY, events);
  }, []);

  const getEvents = useCallback(() => read<AnalyticsEvent[]>(EVENTS_KEY, []), []);
  const clearEvents = useCallback(() => write(EVENTS_KEY, [] as AnalyticsEvent[]), []);

  const saveFeedback = useCallback((fb: Omit<Feedback, 'id' | 'ts'>) => {
    const feedbacks = read<Feedback[]>(FEEDBACK_KEY, []);
    const entry: Feedback = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      ts: Date.now(),
      ...fb,
    };
    feedbacks.push(entry);
    write(FEEDBACK_KEY, feedbacks);

    // Optionally also store a feedback event
    trackEvent('feedback_submitted', { rating: fb.rating, language: fb.language });

    return entry;
  }, [trackEvent]);

  const getFeedbacks = useCallback(() => read<Feedback[]>(FEEDBACK_KEY, []), []);
  const clearFeedbacks = useCallback(() => write(FEEDBACK_KEY, [] as Feedback[]), []);

  const exportAll = useCallback(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      events: read<AnalyticsEvent[]>(EVENTS_KEY, []),
      feedbacks: read<Feedback[]>(FEEDBACK_KEY, []),
      app: 'CropCast',
      version: 'demo-local'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cropcast-analytics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return { trackEvent, getEvents, clearEvents, saveFeedback, getFeedbacks, clearFeedbacks, exportAll };
}
