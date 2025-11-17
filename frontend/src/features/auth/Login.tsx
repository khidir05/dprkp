import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore.getState().setAuth;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/lovable-uploads/bg1.jpg",
      title: "Sistem Inventaris DPRKP",
      subtitle: "Kelola data inventaris dengan mudah dan efisien",
    },
    {
      image: "/lovable-uploads/bg2.jpg",
      title: "Manajemen Gudang Modern",
      subtitle: "Pantauan stok dan kelola barang secara real-time",
    },
    {
      image: "/lovable-uploads/bg.jpg",
      title: "Laporan Komprehensif",
      subtitle: "Dapatkan insight mendalam untuk pengambilan keputusan",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success("Login berhasil!");

      switch (data.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "kepala_gudang":
          navigate("/kepala/dashboard");
          break;
        case "retriever":
          navigate("/retriever/dashboard");
          break;
        default:
          navigate("/");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Login gagal. Periksa kembali username/email dan password Anda."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Username/email dan password wajib diisi");
      return;
    }
    loginMutation.mutate({ identifier, password });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-primary/10 via-background to-accent/10 lg:bg-none">
      {/* Mobile Header */}
      <div className="lg:hidden relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary-hover/80 p-6 pb-8 text-center text-white shadow-xl">
        {/* Overlay agar teks lebih kontras */}
        <div className="absolute inset-0 bg-black/25 z-0" />
        <div className="relative z-10">
          <div className="flex justify-center gap-4 items-center mb-4">
            <img src="/lovable-uploads/dki_logo.png" className="w-12 h-12" />
            <img src="/lovable-uploads/dprkp_logo.png" className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
            DPRKP DKI Jakarta
          </h2>
          <p className="text-white/85 text-sm drop-shadow-md">
            Sistem Inventaris
          </p>
        </div>
      </div>

      {/* Slideshow Desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent z-10" />
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.image} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="relative z-20 flex flex-col justify-center items-start p-12 text-white">
          <div className="flex items-center gap-4 mb-8 drop-shadow-lg">
            <img src="/lovable-uploads/dki_logo.png" className="w-12 h-12" />
            <img src="/lovable-uploads/dprkp_logo.png" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold">DPRKP</h1>
              <p className="text-white/80">Provinsi DKI Jakarta</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-3 drop-shadow-md">{slides[currentSlide].title}</h2>
          <p className="text-lg text-white/90 mb-8 drop-shadow-md">{slides[currentSlide].subtitle}</p>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-accent scale-125" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-primary/5 blur-2xl opacity-70" />
        <div className="w-full max-w-md relative">
          <Card className="shadow-[0_10px_30px_rgba(0,0,0,0.25)] border-border/50 backdrop-blur-lg bg-background/80 transition-transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] duration-500 rounded-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-inner shadow-primary/40">
                    <LogIn className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
                  Selamat Datang
                </h2>
                <p className="text-muted-foreground text-sm">
                  Masuk ke sistem inventaris DPRKP
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Username atau Email</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Masukkan username atau email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={loginMutation.isPending}
                    className="h-12 rounded-xl border-border focus:ring-2 focus:ring-primary focus:border-primary shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loginMutation.isPending}
                      className="h-12 rounded-xl pr-10 border-border focus:ring-2 focus:ring-primary focus:border-primary shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary active:scale-95 active:brightness-110 text-accent-foreground font-semibold text-base rounded-xl transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
