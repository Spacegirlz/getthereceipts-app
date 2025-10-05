export function usePerfTimer() {
  const enabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('perf') === '1';
  const marks = new Map();

  const mark = (name) => {
    if (!enabled) return;
    const t = performance.now();
    marks.set(name, t);
  };

  const end = (name) => {
    if (!enabled) return 0;
    const start = marks.get(name);
    const duration = start != null ? performance.now() - start : 0;
    marks.set(name, duration);
    return duration;
  };

  const measure = async (name, fn) => {
    mark(name);
    try {
      const result = await fn();
      end(name);
      return result;
    } catch (e) {
      end(name);
      throw e;
    }
  };

  const report = (label = 'Perf') => {
    if (!enabled) return;
    const rows = Array.from(marks.entries()).map(([k, v]) => ({ step: k, ms: Math.round(v) }));
    // eslint-disable-next-line no-console
    console.table({ label, ...Object.fromEntries(rows.map(r => [r.step, r.ms + 'ms'])) });
  };

  return { enabled, mark, end, measure, report };
}


