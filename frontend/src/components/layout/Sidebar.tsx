import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/app/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  Warehouse,
  FileText,
  ClipboardList,
  Building2,
  Tags,
  BarChart3,
  ChevronRight,
  ChevronDown,
  User,
  X,
  SquareArrowRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path?: string;
  icon: React.ElementType;
  label: string;
  children?: MenuItem[];
}

const menuItems: Record<string, MenuItem[]> = {
  admin: [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { icon: Users,
      label: "Pengguna",
      children : [
        { path: "/admin/admin", icon: User, label: "Admin" },
        { path: "/admin/kepala-gudang", icon: User, label: "Kepala Gudang" },
        { path: "/admin/retriever", icon: User, label: "Retriever" },
      ]

    },
    {
      icon: Package,
      label: "Barang",
      children: [
        { path: "/admin/barang", icon: Package, label: "Data Barang" },
        { path: "/admin/barang/tambah", icon: FileText, label: "Tambah Barang" },
        { path: "/admin/kategori", icon: Tags, label: "Kategori Barang" },
      ],
    },
    { path: "/admin/rusun", icon: Building2, label: "Rusun" },
    { path: "/admin/gudang", icon: Warehouse, label: "Gudang" },
    { path: "/admin/mutasi", icon: ClipboardList, label: "Mutasi" },
    { path: "/admin/laporan", icon: BarChart3, label: "Laporan" },
  ],
  kepala_gudang: [
    { path: "/kepala/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/kepala/permintaan", icon: ClipboardList, label: "Permintaan" },
    { path: "/kepala/barang", icon: Package, label: "Barang" },
    { path: "/kepala/mutasi", icon: FileText, label: "Mutasi" },
    { path: "/kepala/transaksi", icon: BarChart3, label: "Log Transaksi" },
    {
      icon: SquareArrowRight,
      label: "Lainnya",
      children: [
        { path: "/kepala/gudang", icon: Warehouse, label: "Info Gudang" },
      ]
    },
  ],
  retriever: [
    { path: "/retriever/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/retriever/permintaan/create", icon: FileText, label: "Buat Permintaan" },
    { path: "/retriever/gudang", icon: Warehouse, label: "Lihat Gudang" },
    { path: "/retriever/permintaan", icon: ClipboardList, label: "Permintaan Saya" },
  ],
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const userRole = user?.role || "admin";
  const menus = menuItems[userRole] || [];

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Auto open parent if child is active
  useEffect(() => {
    menus.forEach((item) => {
      if (item.children?.some((child) => location.pathname === child.path)) {
        setOpenMenus((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [location.pathname, menus]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center p-1">
              <img
                src="/dki-jakarta-logo.png"
                alt="Logo DKI Jakarta"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">DPRKP DKI</h1>
              <p className="text-xs text-sidebar-foreground/70">Inventaris</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menus.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpenMenu = openMenus[item.label];
            const isParentActive =
              item.children?.some((child) => location.pathname === child.path) ?? false;

            return (
              <div key={item.label} className="space-y-1">
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl transition-colors",
                      isParentActive
                        ? "bg-sidebar-accent/60 text-sidebar-foreground font-semibold"
                        : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isOpenMenu ? (
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-70" />
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.path!}
                    end
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                )}

                {/* Submenu */}
                {hasChildren && (
                  <div
                    className={cn(
                      "pl-8 mt-1 overflow-hidden transition-all duration-300 ease-in-out",
                      isOpenMenu ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path!}
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-primary/90 text-primary-foreground font-medium shadow-sm"
                              : "hover:bg-sidebar-accent/70 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                          )
                        }
                      >
                        <child.icon className="h-4 w-4 flex-shrink-0" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-4 py-3 rounded-xl bg-sidebar-accent/50">
            <p className="text-xs text-sidebar-foreground/60 text-center">
              © 2025 DPRKP DKI Jakarta
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
