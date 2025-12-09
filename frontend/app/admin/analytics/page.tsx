"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Eye,
  Users,
  FileText,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout, DashboardSkeleton } from "@/components/admin";
import { useAuthStore } from "@/lib/store";
import { api, AnalyticsOverview, ChartDataPoint, PageAnalytics } from "@/lib/api";

type Period = "7d" | "30d" | "90d";

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30d");
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [pageStats, setPageStats] = useState<PageAnalytics[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }
    loadData();
  }, [user, period]);

  const loadData = async () => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const [overviewData, chartResult, pagesResult] = await Promise.all([
        api.getAnalyticsOverview(token, period),
        api.getAnalyticsChart(token, period),
        api.getAnalyticsPages(token, period),
      ]);

      setOverview(overviewData);
      setChartData(chartResult.chartData);
      setPageStats(pagesResult.pages);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getDeviceLabel = (device: string) => {
    switch (device) {
      case "mobile":
        return "Mobile";
      case "tablet":
        return "Tablet";
      default:
        return "Desktop";
    }
  };

  // Calculate max views for chart scaling
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  // Calculate total views from chart data
  const totalChartViews = chartData.reduce((sum, d) => sum + d.views, 0);

  // Format date for chart labels
  const formatChartDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  if (!user) return null;

  if (loading) {
    return (
      <AdminLayout>
        <DashboardSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-amber-500" />
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Acompanhe as visualizacoes do seu portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border p-1 bg-muted/50">
              {(["7d", "30d", "90d"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    period === p
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "90 dias"}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Views</p>
                  <p className="text-3xl font-bold">{overview?.totalViews || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Eye className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visitantes Unicos</p>
                  <p className="text-3xl font-bold">{overview?.uniqueVisitors || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Views Portfolio</p>
                  <p className="text-3xl font-bold">{overview?.portfolioViews || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Views Paginas</p>
                  <p className="text-3xl font-bold">{overview?.pageViews || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Visualizacoes por Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="space-y-4">
                {/* Simple bar chart */}
                <div className="h-48 flex items-end gap-1">
                  {chartData.map((point, index) => (
                    <div
                      key={point.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t opacity-80 hover:opacity-100 transition-opacity relative group"
                        style={{
                          height: `${(point.views / maxViews) * 100}%`,
                          minHeight: point.views > 0 ? "4px" : "0",
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {point.views} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* X-axis labels (show every 7th label for 30d/90d) */}
                <div className="flex gap-1 text-xs text-muted-foreground">
                  {chartData.map((point, index) => {
                    const showLabel = period === "7d" || index % 7 === 0;
                    return (
                      <div key={point.date} className="flex-1 text-center truncate">
                        {showLabel ? formatChartDate(point.date) : ""}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Nenhum dado disponivel para o periodo selecionado
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Device Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-500" />
                Dispositivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overview?.byDevice && overview.byDevice.length > 0 ? (
                <div className="space-y-4">
                  {overview.byDevice.map((item) => {
                    const total = overview.byDevice?.reduce(
                      (sum, d) => sum + parseInt(d.count),
                      0
                    ) || 1;
                    const percentage = Math.round(
                      (parseInt(item.count) / total) * 100
                    );
                    const Icon = getDeviceIcon(item.device);

                    return (
                      <div key={item.device} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {getDeviceLabel(item.device)}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum dado disponivel
                </p>
              )}
            </CardContent>
          </Card>

          {/* Browser Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Navegadores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overview?.byBrowser && overview.byBrowser.length > 0 ? (
                <div className="space-y-4">
                  {overview.byBrowser.map((item) => {
                    const total = overview.byBrowser?.reduce(
                      (sum, b) => sum + parseInt(b.count),
                      0
                    ) || 1;
                    const percentage = Math.round(
                      (parseInt(item.count) / total) * 100
                    );

                    return (
                      <div key={item.browser} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.browser}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum dado disponivel
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Paginas Mais Visitadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageStats.length > 0 ? (
                <div className="space-y-3">
                  {pageStats.slice(0, 5).map((page, index) => (
                    <div
                      key={page.pageId}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">
                            {page.title || "Sem titulo"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            /{page.slug}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-purple-500">
                        {page.views} views
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma pagina visitada ainda
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-orange-500" />
                Principais Origens
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overview?.topReferrers && overview.topReferrers.length > 0 ? (
                <div className="space-y-3">
                  {overview.topReferrers.slice(0, 5).map((ref, index) => {
                    // Parse referrer URL to show domain
                    let domain = ref.referrer;
                    try {
                      const url = new URL(ref.referrer);
                      domain = url.hostname;
                    } catch {
                      // Keep original if not a valid URL
                    }

                    return (
                      <div
                        key={ref.referrer}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <p className="font-medium text-sm line-clamp-1">
                            {domain}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-orange-500">
                          {ref.count} visitas
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma origem externa ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
