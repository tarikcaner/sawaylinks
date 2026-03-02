"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Eye,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Trophy,
  ChevronDown,
  Percent,
  BarChart3,
} from "lucide-react";
import { useT, useLang } from "@/contexts/LanguageContext";

// --- Types ---

interface AnalyticsResponse {
  pageViews: {
    total: number;
    daily: Record<string, number>;
  };
  linkClicks: Record<string, { total: number; daily: Record<string, number> }>;
  linkTitles: Record<string, string>;
}

type Period = "7" | "14" | "30";

// --- Helpers ---

function getLastNDays(n: number, offset = 0): string[] {
  const days: string[] = [];
  for (let i = n - 1 + offset; i >= offset; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDay(dateStr: string, locale: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric" });
}

function formatDayLong(dateStr: string, locale: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function sumDays(daily: Record<string, number>, days: string[]): number {
  return days.reduce((sum, d) => sum + (daily[d] || 0), 0);
}

// --- Inline Components ---

function TrendBadge({ current, previous, newLabel }: { current: number; previous: number; newLabel: string }) {
  if (previous === 0 && current === 0) return null;
  if (previous === 0)
    return (
      <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-[10px] gap-0.5">
        <TrendingUp className="size-3" /> {newLabel}
      </Badge>
    );
  const pct = ((current - previous) / previous) * 100;
  const isUp = pct >= 0;
  return (
    <Badge
      variant="secondary"
      className={`${isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"} text-[10px] gap-0.5`}
    >
      {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {isUp ? "+" : ""}{pct.toFixed(0)}%
    </Badge>
  );
}

function Sparkline({ data, labels }: { data: number[]; labels?: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (data.length === 0) return null;

  const w = 200;
  const h = 48;
  const padX = 4;
  const padY = 6;
  const max = Math.max(...data, 1);

  if (data.length === 1) {
    return (
      <svg width={w} height={h} className="shrink-0">
        <circle cx={w / 2} cy={h / 2} r={3} fill="rgb(59,130,246)" />
      </svg>
    );
  }

  const getX = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const getY = (v: number) => padY + (1 - v / max) * (h - padY * 2);

  const points = data.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");
  const areaPath = [
    `M ${getX(0)},${getY(data[0])}`,
    ...data.slice(1).map((v, i) => `L ${getX(i + 1)},${getY(v)}`),
    `L ${getX(data.length - 1)},${h - padY}`,
    `L ${getX(0)},${h - padY}`,
    "Z",
  ].join(" ");

  const handleInteraction = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (x - padX) / (w - padX * 2)));
    const idx = Math.round(ratio * (data.length - 1));
    setHoverIdx(idx);
  };

  return (
    <div className="relative" ref={containerRef}>
      <svg
        width={w}
        height={h}
        className="shrink-0 touch-none"
        onMouseMove={(e) => handleInteraction(e.clientX)}
        onTouchMove={(e) => handleInteraction(e.touches[0].clientX)}
        onTouchStart={(e) => handleInteraction(e.touches[0].clientX)}
        onMouseLeave={() => setHoverIdx(null)}
        onTouchEnd={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sparkGrad)" />
        <polyline
          points={points}
          fill="none"
          stroke="rgb(59,130,246)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {hoverIdx !== null && (
          <>
            <line
              x1={getX(hoverIdx)}
              y1={padY}
              x2={getX(hoverIdx)}
              y2={h - padY}
              stroke="rgb(59,130,246)"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.4}
            />
            <circle
              cx={getX(hoverIdx)}
              cy={getY(data[hoverIdx])}
              r={4}
              fill="rgb(59,130,246)"
              stroke="white"
              strokeWidth={2}
            />
          </>
        )}
      </svg>
      {hoverIdx !== null && (
        <div
          className="absolute -top-8 pointer-events-none bg-popover text-popover-foreground border shadow-md rounded-md px-2 py-1 text-[10px] font-medium whitespace-nowrap z-10"
          style={{
            left: `${Math.min(Math.max(getX(hoverIdx), 30), w - 30)}px`,
            transform: "translateX(-50%)",
          }}
        >
          {labels?.[hoverIdx] ? `${labels[hoverIdx]}: ` : ""}{data[hoverIdx]}
        </div>
      )}
    </div>
  );
}

// --- Line Chart ---

interface ChartDay {
  date: string;
  views: number;
  clicks: number;
}

function LineChart({ days, chartMax, locale, viewsLabel, clicksLabel }: { days: ChartDay[]; chartMax: number; locale: string; viewsLabel: string; clicksLabel: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [containerW, setContainerW] = useState(0);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerW(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const obs = new ResizeObserver(updateWidth);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [updateWidth]);

  const w = containerW || 300;
  const h = 200;
  const padL = 32;
  const padR = 8;
  const padT = 16;
  const padB = 32;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const getX = (i: number) =>
    days.length <= 1 ? padL + chartW / 2 : padL + (i / (days.length - 1)) * chartW;
  const getY = (v: number) => padT + (1 - v / chartMax) * chartH;

  const viewPoints = days.map((d, i) => `${getX(i)},${getY(d.views)}`).join(" ");
  const clickPoints = days.map((d, i) => `${getX(i)},${getY(d.clicks)}`).join(" ");

  const makeArea = (vals: number[]) => {
    if (vals.length === 0) return "";
    return [
      `M ${getX(0)},${getY(vals[0])}`,
      ...vals.slice(1).map((v, i) => `L ${getX(i + 1)},${getY(v)}`),
      `L ${getX(vals.length - 1)},${padT + chartH}`,
      `L ${getX(0)},${padT + chartH}`,
      "Z",
    ].join(" ");
  };

  // Y-axis: 4 gridlines
  const gridCount = 4;
  const yTicks = Array.from({ length: gridCount + 1 }, (_, i) =>
    Math.round((chartMax / gridCount) * i)
  );

  // X-axis labels: adaptive count
  const labelCount = w < 400 ? 4 : days.length <= 7 ? days.length : w < 600 ? 5 : 7;
  const labelInterval = Math.max(1, Math.floor((days.length - 1) / (labelCount - 1)));

  const handleInteraction = (clientX: number) => {
    if (!containerRef.current || days.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (x - padL) / chartW));
    const idx = Math.round(ratio * (days.length - 1));
    setHoverIdx(idx);
  };

  // Tooltip position clamping
  const tooltipLeft = hoverIdx !== null
    ? Math.min(Math.max(getX(hoverIdx), 70), w - 70)
    : 0;

  return (
    <div ref={containerRef} className="relative w-full select-none">
      {containerW > 0 && (
        <>
          <svg
            width={w}
            height={h}
            className="w-full touch-none"
            onMouseMove={(e) => handleInteraction(e.clientX)}
            onTouchMove={(e) => handleInteraction(e.touches[0].clientX)}
            onTouchStart={(e) => handleInteraction(e.touches[0].clientX)}
            onMouseLeave={() => setHoverIdx(null)}
            onTouchEnd={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(34,197,94)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="rgb(34,197,94)" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={padL}
                  y1={getY(tick)}
                  x2={w - padR}
                  y2={getY(tick)}
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth={1}
                />
                <text
                  x={padL - 4}
                  y={getY(tick) + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize={9}
                >
                  {tick}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {days.map((d, i) => {
              // Show first, last, and evenly spaced labels
              const isFirst = i === 0;
              const isLast = i === days.length - 1;
              const isInterval = i % labelInterval === 0;
              if (!isFirst && !isLast && !isInterval) return null;
              return (
                <text
                  key={d.date}
                  x={getX(i)}
                  y={h - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize={9}
                >
                  {formatDay(d.date, locale)}
                </text>
              );
            })}

            {/* Area fills */}
            <path d={makeArea(days.map((d) => d.views))} fill="url(#viewsGrad)" />
            <path d={makeArea(days.map((d) => d.clicks))} fill="url(#clicksGrad)" />

            {/* Lines */}
            <polyline
              points={viewPoints}
              fill="none"
              stroke="rgb(59,130,246)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={clickPoints}
              fill="none"
              stroke="rgb(34,197,94)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover indicator */}
            {hoverIdx !== null && (
              <>
                <line
                  x1={getX(hoverIdx)}
                  y1={padT}
                  x2={getX(hoverIdx)}
                  y2={padT + chartH}
                  stroke="currentColor"
                  className="text-muted-foreground/30"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <circle
                  cx={getX(hoverIdx)}
                  cy={getY(days[hoverIdx].views)}
                  r={5}
                  fill="rgb(59,130,246)"
                  stroke="white"
                  strokeWidth={2}
                />
                <circle
                  cx={getX(hoverIdx)}
                  cy={getY(days[hoverIdx].clicks)}
                  r={5}
                  fill="rgb(34,197,94)"
                  stroke="white"
                  strokeWidth={2}
                />
              </>
            )}
          </svg>

          {/* Tooltip */}
          {hoverIdx !== null && (
            <div
              className="absolute pointer-events-none bg-popover text-popover-foreground border shadow-lg rounded-lg px-3 py-2 z-10"
              style={{ top: "4px", left: `${tooltipLeft}px`, transform: "translateX(-50%)" }}
            >
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                {formatDayLong(days[hoverIdx].date, locale)}
              </p>
              <div className="flex flex-col gap-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500" />
                  <span className="font-semibold tabular-nums">{days[hoverIdx].views}</span>
                  <span className="text-muted-foreground">{viewsLabel}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="font-semibold tabular-nums">{days[hoverIdx].clicks}</span>
                  <span className="text-muted-foreground">{clicksLabel}</span>
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Main Page ---

export default function AnalyticsPage() {
  const { authFetch } = useAdmin();
  const t = useT();
  const { lang } = useLang();
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("7");
  const [expandedLink, setExpandedLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await authFetch("/api/analytics");
        if (res.ok) {
          setData(await res.json());
        } else {
          toast.error(t("toast.analytics.loadFailed"));
        }
      } catch {
        toast.error(t("toast.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [authFetch, t]);

  const stats = useMemo(() => {
    if (!data) return null;

    const n = Number(period);
    const currentDays = getLastNDays(n);
    const previousDays = getLastNDays(n, n);

    const periodViews = sumDays(data.pageViews.daily, currentDays);
    const prevViews = sumDays(data.pageViews.daily, previousDays);

    const linkStats = Object.entries(data.linkClicks)
      .map(([id, info]) => {
        const title = data.linkTitles[id] || id;
        const periodTotal = sumDays(info.daily, currentDays);
        const prevTotal = sumDays(info.daily, previousDays);
        const dailyData = currentDays.map((d) => info.daily[d] || 0);
        const dailyLabels = currentDays.map((d) => formatDay(d, locale));
        const today = dailyData[dailyData.length - 1];
        const avg = dailyData.length > 0 ? periodTotal / dailyData.length : 0;
        const peak = Math.max(...dailyData, 0);
        return { id, title, periodTotal, prevTotal, dailyData, dailyLabels, today, avg, peak };
      })
      .filter((l) => l.periodTotal > 0 || l.prevTotal > 0)
      .sort((a, b) => b.periodTotal - a.periodTotal);

    const periodClicks = linkStats.reduce((s, l) => s + l.periodTotal, 0);
    const prevClicks = linkStats.reduce((s, l) => s + l.prevTotal, 0);
    const ctr = periodViews > 0 ? (periodClicks / periodViews) * 100 : 0;
    const topLink = linkStats.length > 0 ? linkStats[0] : null;

    const chartDays = currentDays.map((d) => ({
      date: d,
      views: data.pageViews.daily[d] || 0,
      clicks: Object.values(data.linkClicks).reduce((s, l) => s + (l.daily[d] || 0), 0),
    }));
    const chartMax = Math.max(...chartDays.map((d) => Math.max(d.views, d.clicks)), 1);

    const canShowTrend = n <= 14;
    const avgViews = n > 0 ? periodViews / n : 0;
    const avgClicks = n > 0 ? periodClicks / n : 0;

    return {
      periodViews, prevViews, periodClicks, prevClicks,
      ctr, topLink, linkStats, chartDays, chartMax,
      canShowTrend, avgViews, avgClicks, n,
    };
  }, [data, period, locale]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || !stats) return null;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">{t("analytics.heading")}</h1>

      {/* Period Selector - full width on mobile */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="7" className="flex-1 sm:flex-initial">{t("analytics.7days")}</TabsTrigger>
          <TabsTrigger value="14" className="flex-1 sm:flex-initial">{t("analytics.14days")}</TabsTrigger>
          <TabsTrigger value="30" className="flex-1 sm:flex-initial">{t("analytics.30days")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 px-3 sm:px-6 sm:pt-5 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-1.5 sm:p-2">
                <Eye className="size-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold tabular-nums">
                  {stats.periodViews.toLocaleString(locale)}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">{t("analytics.views")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {stats.canShowTrend && (
                <TrendBadge current={stats.periodViews} previous={stats.prevViews} newLabel={t("analytics.new")} />
              )}
              <span className="text-[10px] text-muted-foreground">
                {t("analytics.avgPerDay", { n: stats.avgViews.toFixed(1) })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 px-3 sm:px-6 sm:pt-5 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-500/10 p-1.5 sm:p-2">
                <MousePointerClick className="size-4 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold tabular-nums">
                  {stats.periodClicks.toLocaleString(locale)}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">{t("analytics.clicks")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {stats.canShowTrend && (
                <TrendBadge current={stats.periodClicks} previous={stats.prevClicks} newLabel={t("analytics.new")} />
              )}
              <span className="text-[10px] text-muted-foreground">
                {t("analytics.avgPerDay", { n: stats.avgClicks.toFixed(1) })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-4 pb-3 px-3 sm:px-6 sm:pt-5 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-purple-500/10 p-1.5 sm:p-2">
                <Percent className="size-4 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold tabular-nums">{stats.ctr.toFixed(1)}%</p>
                <p className="text-[10px] text-muted-foreground leading-tight">CTR</p>
              </div>
            </div>
            <div className="mt-1.5">
              <span className="text-[10px] text-muted-foreground">
                {stats.periodClicks} / {stats.periodViews}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Link Banner */}
      {stats.topLink && stats.topLink.periodTotal > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-3 px-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Trophy className="size-5 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground">{t("analytics.topClicked")}</p>
                <p className="text-sm font-semibold truncate">{stats.topLink.title}</p>
              </div>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 shrink-0 text-[10px]">
                {t("analytics.clickCount", { n: stats.topLink.periodTotal })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Line Chart */}
      <Card>
        <CardHeader className="pb-2 px-3 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-1.5">
              <BarChart3 className="size-4 text-muted-foreground" />
              {t("analytics.lastNDays", { n: stats.n })}
            </CardTitle>
            <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-blue-500" />
                {t("analytics.chartViews")}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-500" />
                {t("analytics.chartClicks")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-4">
          <LineChart
            days={stats.chartDays}
            chartMax={stats.chartMax}
            locale={locale}
            viewsLabel={t("analytics.tooltipViews")}
            clicksLabel={t("analytics.tooltipClicks")}
          />
        </CardContent>
      </Card>

      {/* Link Performance */}
      <Card>
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-sm sm:text-base">{t("analytics.linkPerformance")}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {stats.linkStats.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t("analytics.noClicks")}
            </p>
          ) : (
            <div className="divide-y">
              {stats.linkStats.map((link) => {
                const isOpen = expandedLink === link.id;
                return (
                  <div key={link.id}>
                    <button
                      onClick={() => setExpandedLink(isOpen ? null : link.id)}
                      className="flex items-center w-full gap-1.5 sm:gap-2 py-3 text-left hover:bg-muted/50 active:bg-muted/70 rounded-md px-1 -mx-1 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-medium truncate flex-1 min-w-0">
                        {link.title}
                      </span>
                      {stats.canShowTrend && (
                        <TrendBadge current={link.periodTotal} previous={link.prevTotal} newLabel={t("analytics.new")} />
                      )}
                      <span className="text-xs sm:text-sm font-semibold tabular-nums shrink-0">
                        {link.periodTotal.toLocaleString(locale)}
                      </span>
                      <ChevronDown
                        className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-3 px-1 space-y-3">
                        <Sparkline data={link.dailyData} labels={link.dailyLabels} />
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                          <span>
                            {t("analytics.today")}: <span className="font-medium text-foreground">{link.today}</span>
                          </span>
                          <span>
                            {t("analytics.average")}: <span className="font-medium text-foreground">{link.avg.toFixed(1)}</span>
                          </span>
                          <span>
                            {t("analytics.peak")}: <span className="font-medium text-foreground">{link.peak}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
