import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/store";
import {
  Package,
  ClipboardList,
  TrendingUp,
  Warehouse,
  Activity,
} from "lucide-react";

export default function KepalaGudangDashboard() {
  const { user } = useAuthStore();

  const stats = [
    {
      title: "Gudang Dikelola",
      value: "3",
      icon: Warehouse,
      trend: "+1",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Barang",
      value: "456",
      icon: Package,
      trend: "+23",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Permintaan Aktif",
      value: "12",
      icon: ClipboardList,
      trend: "+4",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Mutasi Bulan Ini",
      value: "28",
      icon: Activity,
      trend: "+8",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Kepala Gudang</h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang kembali, {user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.trend} baru minggu ini</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Permintaan baru dari Retriever", time: "10 menit yang lalu" },
              { action: "Barang masuk ke Gudang A", time: "1 jam yang lalu" },
              { action: "Mutasi barang disetujui", time: "2 jam yang lalu" },
              { action: "Stok barang diperbarui", time: "3 jam yang lalu" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
