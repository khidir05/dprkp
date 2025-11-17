import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">403</h1>
          <p className="text-xl text-muted-foreground">Akses Ditolak</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
        <Button onClick={() => navigate(-1)} variant="default">
          Kembali
        </Button>
      </div>
    </div>
  );
}
