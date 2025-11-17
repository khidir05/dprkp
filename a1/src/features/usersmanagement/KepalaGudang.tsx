import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchKepalaGudangList,
  toggleKepalaGudangStatus,
  deleteKepalaGudang,
  createKepalaGudangRegistrationLink,
  KepalaGudang,
} from "@/api/kepala_gudang";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Trash2, Link2Icon, Copy, Share2 } from "lucide-react";

import toast from "react-hot-toast";

export default function KepalaGudangPage() {
  const queryClient = useQueryClient();

  // STATE
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  // PAGINATION
  const ITEMS_PER_PAGE = 20;
  const [page, setPage] = useState(1);

  // FETCH LIST
  const {
    data: kepala = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["kepala-gudang"],
    queryFn: fetchKepalaGudangList,
  });

  // MUTATIONS
  const generateMutation = useMutation({
    mutationFn: createKepalaGudangRegistrationLink,
    onSuccess: (res) => {
      setGeneratedLink(res?.registration_link || null);
      toast.success("Link berhasil dibuat");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKepalaGudang,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kepala-gudang"] });
      toast.success("Akun kepala gudang dinonaktifkan");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleKepalaGudangStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kepala-gudang"] });
      toast.success("Status diperbarui");
    },
  });

  // FILTERING
  const filtered = kepala.filter((k) => {
    let ok = true;

    if (filterActive !== "all") {
      ok = ok && k.is_active === (filterActive === "active");
    }

    if (search) {
      const q = search.toLowerCase();
      ok =
        ok &&
        (k.nama_lengkap.toLowerCase().includes(q) ||
          (k.username ?? "").toLowerCase().includes(q));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Kepala Gudang</h1>
          <p className="text-muted-foreground">Kelola akun kepala gudang</p>
        </div>

        {/* BUTTON: CREATE LINK */}
        <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
          <DialogTrigger asChild>
            <Button>
              <Link2Icon className="w-4 h-4 mr-2" /> Buat Link Pendaftaran
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Link Pendaftaran</DialogTitle>
            </DialogHeader>

            {generatedLink ? (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded break-all">
                  {generatedLink}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                      toast.success("Disalin");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-1" /> Salin
                  </Button>

                  <Button
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(
                          generatedLink
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    <Share2 className="w-4 h-4 mr-1" /> Share WA
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full"
                disabled={generateMutation.isLoading}
                onClick={() => generateMutation.mutate()}
              >
                {generateMutation.isLoading ? "Membuat..." : "Generate Link"}
              </Button>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedLink(null);
                  setIsLinkOpen(false);
                }}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STATUS */}
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

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kepala Gudang</CardTitle>
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
                  <TableHead>Unit Kerja</TableHead>
                  <TableHead>Rusun</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((k) => (
                  <TableRow key={k.id_kepala_gudang}>
                    <TableCell>{k.id_kepala_gudang}</TableCell>
                    <TableCell>{k.nama_lengkap}</TableCell>
                    <TableCell>{k.username ?? "-"}</TableCell>
                    <TableCell>{k.email ?? "-"}</TableCell>
                    <TableCell>{k.unit_kerja ?? "-"}</TableCell>
                    <TableCell>{k.rusun ?? "-"}</TableCell>

                    <TableCell>
                      <Badge variant={k.is_active ? "default" : "destructive"}>
                        {k.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleMutation.mutate(k.id_kepala_gudang)}
                      >
                        Toggle
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            confirm(`Nonaktifkan ${k.nama_lengkap}?`)
                          ) {
                            deleteMutation.mutate(k.id_kepala_gudang);
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
            {paginated.map((k) => (
              <Card key={k.id_kepala_gudang} className="border rounded-xl p-4">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">
                    {k.nama_lengkap}
                  </h2>
                  <Badge variant={k.is_active ? "default" : "destructive"}>
                    {k.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm mt-3">
                  <p>
                    <b>Username:</b> {k.username ?? "-"}
                  </p>
                  <p>
                    <b>Email:</b> {k.email ?? "-"}
                  </p>
                  <p>
                    <b>Unit Kerja:</b> {k.unit_kerja ?? "-"}
                  </p>
                  <p>
                    <b>Rusun:</b> {k.rusun ?? "-"}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleMutation.mutate(k.id_kepala_gudang)}
                  >
                    Toggle
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (
                        confirm(`Nonaktifkan ${k.nama_lengkap}?`)
                      ) {
                        deleteMutation.mutate(k.id_kepala_gudang);
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
