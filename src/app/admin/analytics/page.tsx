"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, MousePointerClick } from "lucide-react";

interface AnalyticsResponse {
  pageViews: {
    total: number;
    daily: Record<string, number>;
  };
  linkClicks: Record<string, { total: number; daily: Record<string, number> }>;
  linkTitles: Record<string, string>;
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("tr-TR", { weekday: "short", day: "numeric" });
}

export default function AnalyticsPage() {
  const { authFetch } = useAdmin();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await authFetch("/api/analytics");
        if (res.ok) {
          setData(await res.json());
        } else {
          toast.error("Analitik verileri yuklenemedi.");
        }
      } catch {
        toast.error("Bir hata olustu.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [authFetch]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const last7 = getLast7Days();
  const dailyViews = last7.map((d) => data.pageViews.daily[d] || 0);
  const maxViews = Math.max(...dailyViews, 1);

  // Sort links by total clicks descending
  const sortedLinks = Object.entries(data.linkClicks)
    .map(([id, stats]) => ({
      id,
      title: data.linkTitles[id] || id,
      total: stats.total,
      today: stats.daily[last7[6]] || 0,
    }))
    .sort((a, b) => b.total - a.total);

  const totalClicks = sortedLinks.reduce((sum, l) => sum + l.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analitik</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Eye className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.pageViews.total.toLocaleString("tr-TR")}</p>
                <p className="text-xs text-muted-foreground">Sayfa Goruntulenme</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <MousePointerClick className="size-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString("tr-TR")}</p>
                <p className="text-xs text-muted-foreground">Toplam Tiklama</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Son 7 Gun - Sayfa Goruntulenme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {last7.map((day, i) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {dailyViews[i]}
                </span>
                <div className="w-full flex items-end" style={{ height: "120px" }}>
                  <div
                    className="w-full rounded-t bg-blue-500 transition-all"
                    style={{
                      height: `${Math.max((dailyViews[i] / maxViews) * 100, 2)}%`,
                      minHeight: "4px",
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{formatDay(day)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Link clicks table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Link Tiklamalari</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Henuz tiklama verisi yok.
            </p>
          ) : (
            <div className="space-y-3">
              {sortedLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate mr-4">{link.title}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      bugun: {link.today}
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {link.total.toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
