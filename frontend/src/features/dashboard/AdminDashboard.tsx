import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/store";
import {
  Users,
  Package,
  Warehouse,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const stats = [
    {
      title: "Total Pengguna",
      value: "45",
      icon: Users,
      trend: "+12%",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Gudang",
      value: "12",
      icon: Warehouse,
      trend: "+5%",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Barang",
      value: "1,234",
      icon: Package,
      trend: "+18%",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Stok Menipis",
      value: "8",
      icon: AlertCircle,
      trend: "-3",
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
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
                <span>{stat.trend} dari bulan lalu</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Barang baru ditambahkan</p>
                    <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Notifikasi Penting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Stok barang menipis</p>
                    <p className="text-xs text-muted-foreground">Gudang Rusun A - Item #{i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
