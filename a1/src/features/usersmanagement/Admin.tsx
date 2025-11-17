import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchAdminList,
  toggleAdminStatus,
  deleteAdmin,
  AdminUser,
} from "@/api/admin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPage() {
  const queryClient = useQueryClient();

  // STATE
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  // PAGINATION
  const ITEMS_PER_PAGE = 20;
  const [page, setPage] = useState(1);

  // FETCH LIST
  const {
    data: admins = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-manager"],
    queryFn: fetchAdminList,
  });

  // MUTATIONS
  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-manager"] });
      toast.success("Akun admin dinonaktifkan");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleAdminStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-manager"] });
      toast.success("Status admin diperbarui");
    },
  });

  // FILTERING
  const filtered = admins.filter((a) => {
    let ok = true;

    if (filterActive !== "all") {
      ok = ok && a.is_active === (filterActive === "active");
    }

    if (search) {
      const q = search.toLowerCase();
      ok =
        ok &&
        (a.nama_lengkap.toLowerCase().includes(q) ||
          (a.username ?? "").toLowerCase().includes(q));
    }

    return ok;
  });

  // RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setPage(1);
  }, [search, filterActive]);

  // PAGINATION
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Manajemen Admin</h1>
        <p className="text-muted-foreground">Kelola akun administrator sistem</p>
      </div>

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STATUS FILTER */}
          <div>
            <Label>Status</Label>
            <select
              className="border rounded p-2 w-full"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
            >
              <option value="all">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {/* SEARCH */}
          <div>
            <Label>Cari</Label>
            <Input
              placeholder="Cari nama / username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* LIST DATA */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Admin</CardTitle>
          <CardDescription>Total: {filtered.length}</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && <div>Memuat...</div>}
          {isError && (
            <div className="text-red-600">Error: {String(error)}</div>
          )}

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((a) => (
                  <TableRow key={a.id_admin}>
                    <TableCell>{a.id_admin}</TableCell>
                    <TableCell>{a.nama_lengkap}</TableCell>
                    <TableCell>{a.username ?? "-"}</TableCell>
                    <TableCell>{a.email ?? "-"}</TableCell>

                    <TableCell>
                      <Badge variant={a.is_active ? "default" : "destructive"}>
                        {a.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleMutation.mutate(a.id_admin)}
                      >
                        Toggle
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Nonaktifkan ${a.nama_lengkap}?`)) {
                            deleteMutation.mutate(a.id_admin);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE VERSION */}
          <div className="md:hidden space-y-4">
            {paginated.map((a) => (
              <Card key={a.id_admin} className="border rounded-xl p-4">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">{a.nama_lengkap}</h2>

                  <Badge variant={a.is_active ? "default" : "destructive"}>
                    {a.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm mt-3">
                  <p>
                    <b>Username:</b> {a.username ?? "-"}
                  </p>
                  <p>
                    <b>Email:</b> {a.email ?? "-"}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleMutation.mutate(a.id_admin)}
                  >
                    Toggle
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm(`Nonaktifkan ${a.nama_lengkap}?`)) {
                        deleteMutation.mutate(a.id_admin);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan{" "}
              {totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(page * ITEMS_PER_PAGE, totalItems)} dari {totalItems}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </Button>

              <Button
                variant="outline"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
