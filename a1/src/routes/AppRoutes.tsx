import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import Login from "@/features/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import AdminDashboard from "@/features/dashboard/AdminDashboard";
import KepalaGudangDashboard from "@/features/dashboard/KepalaGudangDashboard";
import RetrieverDashboard from "@/features/dashboard/RetrieverDashboard";
import Retriever from "@/features/usersmanagement/Retriever";
import RusunManager from "@/features/other/admin/RusunManager";
import GudangManager from "@/features/other/admin/GudangManager";
import KategoriManager from "@/features/other/admin/KategoriManager";
import GudangViewer from "@/features/other/kepala/GudangViewer";
import KepalaGudang from "@/features/usersmanagement/KepalaGudang";
import Admin from "@/features/usersmanagement/Admin";
import Profile from "@/features/profile/Profile";
import Forbidden from "@/pages/Forbidden";
import NotFound from "@/pages/NotFound";

function AppRoutes() {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to appropriate dashboard based on role
  const getDefaultRedirect = () => {
    if (!user) return "/login";
    
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "kepala_gudang":
        return "/kepala/dashboard";
      case "retriever":
        return "/retriever/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <Login />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AppShell>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="retriever" element={<Retriever />} />
                <Route path="admin" element={<Admin />} />
                <Route path="kepala-gudang" element={<KepalaGudang />} />
                <Route path="kategori" element={<KategoriManager />} />
                <Route path="rusun" element={<RusunManager />} />
                <Route path="gudang" element={<GudangManager />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Kepala Gudang Routes */}
      <Route
        path="/kepala/*"
        element={
          <ProtectedRoute roles={["kepala_gudang"]}>
            <AppShell>
              <Routes>
                <Route path="dashboard" element={<KepalaGudangDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="gudang" element={<GudangViewer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Retriever Routes */}
      <Route
        path="/retriever/*"
        element={
          <ProtectedRoute roles={["retriever"]}>
            <AppShell>
              <Routes>
                <Route path="dashboard" element={<RetrieverDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
