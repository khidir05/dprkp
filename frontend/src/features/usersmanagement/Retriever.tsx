import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  toggleUserStatus,
  deleteUser,
  createRetrieverRegistrationLink,
  Retriever,
} from "@/api/retriever";

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
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Trash2, Link2Icon, Copy, Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RetrieverPage() {
  const queryClient = useQueryClient();

  // STATE
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [filterKategori, setFilterKategori] = useState("all");

  // PAGINATION
  const ITEMS_PER_PAGE = 20;
  const [page, setPage] = useState(1);

  // FETCH LIST
  const { data: retrievers = [], isLoading, isError, error } = useQuery({
    queryKey: ["retrievers"],
    queryFn: fetchUsers,
  });

  // MUTATIONS
  const generateMutation = useMutation({
    mutationFn: createRetrieverRegistrationLink,
    onSuccess: (res) => {
      setGeneratedLink(res.registration_link);
      toast.success("Link berhasil dibuat");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrievers"] });
      toast.success("Akun retriever dinonaktifkan");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrievers"] });
      toast.success("Status diperbarui");
    },
  });

  // FILTERING
  const filtered = retrievers.filter((r) => {
    let ok = true;

    if (filterActive !== "all") {
      ok = ok && r.is_active === (filterActive === "active");
    }

    if (filterKategori !== "all") {
      ok = ok && r.kategori === filterKategori;
    }

    if (search) {
      const q = search.toLowerCase();
      ok =
        ok &&
        (r.nama_lengkap.toLowerCase().includes(q) ||
          (r.username ?? "").toLowerCase().includes(q));
    }

    return ok;
  });

  // RESET page if filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, filterActive, filterKategori]);

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
          <h1 className="text-3xl font-bold">Manajemen Retriever</h1>
          <p className="text-muted-foreground">Kelola pengguna retriever</p>
        </div>

        {/* BUTTON CREATE LINK */}
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
                <div className="p-3 bg-muted rounded break-all">{generatedLink}</div>

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
                        `https://wa.me/?text=${encodeURIComponent(generatedLink)}`,
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
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* STATUS */}
          <div>
            <Label>Status</Label>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KATEGORI */}
          <div>
            <Label>Kategori</Label>
            <Select value={filterKategori} onValueChange={setFilterKategori}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="teknisi">Teknisi</SelectItem>
                <SelectItem value="administrasi">Administrasi</SelectItem>
                <SelectItem value="lapangan">Lapangan</SelectItem>
              </SelectContent>
            </Select>
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
          <CardTitle>Daftar Retriever</CardTitle>
          <CardDescription>Total: {filtered.length}</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && <div>Memuat...</div>}
          {isError && <div className="text-red-600">Error: {String(error)}</div>}

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Rusun</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((r) => (
                  <TableRow key={r.id_retriever}>
                    <TableCell>{r.id_retriever}</TableCell>
                    <TableCell>{r.nama_lengkap}</TableCell>
                    <TableCell>{r.username ?? "-"}</TableCell>
                    <TableCell>{r.email ?? "-"}</TableCell>
                    <TableCell>{r.kategori ?? "-"}</TableCell>
                    <TableCell>{r.rusun ?? "-"}</TableCell>

                    <TableCell>
                      <Badge variant={r.is_active ? "default" : "destructive"}>
                        {r.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleMutation.mutate(r.id_retriever)}
                      >
                        Toggle
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm(`Nonaktifkan ${r.nama_lengkap}?`)) {
                            deleteMutation.mutate(r.id_retriever);
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

          {/* MOBILE CARD VERSION */}
          <div className="md:hidden space-y-4">
            {paginated.map((r) => (
              <Card key={r.id_retriever} className="border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">{r.nama_lengkap}</h2>
                  <Badge variant={r.is_active ? "default" : "destructive"}>
                    {r.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1 text-sm">
                  <p><span className="font-semibold">Username:</span> {r.username ?? "-"}</p>
                  <p><span className="font-semibold">Email:</span> {r.email ?? "-"}</p>
                  <p><span className="font-semibold">Kategori:</span> {r.kategori ?? "-"}</p>
                  <p><span className="font-semibold">Rusun:</span> {r.rusun ?? "-"}</p>
                  <p><span className="font-semibold">ID Retriever:</span> {r.id_retriever}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleMutation.mutate(r.id_retriever)}
                  >
                    Toggle
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm(`Nonaktifkan ${r.nama_lengkap}?`)) {
                        deleteMutation.mutate(r.id_retriever);
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
