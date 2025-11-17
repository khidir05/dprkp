import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">Halaman Tidak Ditemukan</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Maaf, halaman yang Anda cari tidak tersedia.
          </p>
        </div>
        <Button onClick={() => navigate(-1)} variant="default">
          Kembali
        </Button>
      </div>
    </div>
  );
}
