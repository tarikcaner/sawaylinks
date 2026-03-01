import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

interface DailyCounts {
  [date: string]: number;
}

interface LinkClickData {
  total: number;
  daily: DailyCounts;
}

export interface AnalyticsData {
  pageViews: {
    total: number;
    daily: DailyCounts;
  };
  linkClicks: {
    [linkId: string]: LinkClickData;
  };
}

const DATA_DIR = path.join(process.cwd(), "data");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const MAX_DAILY_DAYS = 30;

const DEFAULT_DATA: AnalyticsData = {
  pageViews: { total: 0, daily: {} },
  linkClicks: {},
};

function pruneDaily(daily: DailyCounts): DailyCounts {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_DAILY_DAYS);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const pruned: DailyCounts = {};
  for (const [date, count] of Object.entries(daily)) {
    if (date >= cutoffStr) {
      pruned[date] = count;
    }
  }
  return pruned;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const raw = await readFile(ANALYTICS_FILE, "utf-8");
    return JSON.parse(raw) as AnalyticsData;
  } catch {
    return { ...DEFAULT_DATA, pageViews: { ...DEFAULT_DATA.pageViews, daily: {} }, linkClicks: {} };
  }
}

export async function saveAnalytics(data: AnalyticsData): Promise<void> {
  data.pageViews.daily = pruneDaily(data.pageViews.daily);
  for (const linkId of Object.keys(data.linkClicks)) {
    data.linkClicks[linkId].daily = pruneDaily(data.linkClicks[linkId].daily);
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function recordPageView(): Promise<void> {
  const data = await getAnalytics();
  const today = new Date().toISOString().split("T")[0];
  data.pageViews.total += 1;
  data.pageViews.daily[today] = (data.pageViews.daily[today] || 0) + 1;
  await saveAnalytics(data);
}

export async function recordLinkClick(linkId: string): Promise<void> {
  const data = await getAnalytics();
  const today = new Date().toISOString().split("T")[0];
  if (!data.linkClicks[linkId]) {
    data.linkClicks[linkId] = { total: 0, daily: {} };
  }
  data.linkClicks[linkId].total += 1;
  data.linkClicks[linkId].daily[today] = (data.linkClicks[linkId].daily[today] || 0) + 1;
  await saveAnalytics(data);
}
