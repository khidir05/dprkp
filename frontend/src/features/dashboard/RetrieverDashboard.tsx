import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ClipboardList,
  Package,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RetrieverDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Permintaan Aktif",
      value: "5",
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Permintaan Disetujui",
      value: "18",
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Permintaan",
      value: "23",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Retriever</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali, {user?.name}
          </p>
          {user?.rusun && (
            <p className="text-sm text-primary font-medium mt-1">
              Rusun: {user.rusun.nama}
            </p>
          )}
        </div>
        <Button onClick={() => navigate("/retriever/permintaan/create")} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Buat Permintaan
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Permintaan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { item: "Kursi Kantor", qty: "5 unit", status: "Disetujui", statusColor: "bg-green-100 text-green-700" },
              { item: "Meja Rapat", qty: "2 unit", status: "Menunggu", statusColor: "bg-yellow-100 text-yellow-700" },
              { item: "Komputer", qty: "3 unit", status: "Diproses", statusColor: "bg-blue-100 text-blue-700" },
              { item: "Printer", qty: "1 unit", status: "Disetujui", statusColor: "bg-green-100 text-green-700" },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{req.item}</p>
                    <p className="text-sm text-muted-foreground">{req.qty}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.statusColor}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
