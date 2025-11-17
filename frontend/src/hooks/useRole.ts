import { useAuthStore } from "@/app/store";

export type UserRole = "admin" | "kepala_gudang" | "retriever";

export function useRole() {
  const { user } = useAuthStore();
  
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = user?.role === "admin";
  const isKepalaGudang = user?.role === "kepala_gudang";
  const isRetriever = user?.role === "retriever";

  return {
    role: user?.role,
    hasRole,
    isAdmin,
    isKepalaGudang,
    isRetriever,
  };
}
