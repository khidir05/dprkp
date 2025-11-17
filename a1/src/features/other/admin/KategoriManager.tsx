import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchKategoriList,
  createKategori,
  updateKategori,
  deleteKategori,
  Kategori,
} from "@/api/kategori";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Trash2, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function KategoriManager() {
  const queryClient = useQueryClient();

  // Search
  const [search, setSearch] = useState("");

  // Create / Edit dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Kategori | null>(null);

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Kategori | null>(null);

  // Form
  const [formNama, setFormNama] = useState("");

  const resetForm = () => setFormNama("");

  ///
  /// FETCH DATA
  ///
  const { data: kategoriList = [], isLoading, isError } = useQuery({
    queryKey: ["kategori"],
    queryFn: fetchKategoriList,
  });

  ///
  /// MUTATIONS
  ///
  const createMutation = useMutation({
    mutationFn: createKategori,
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (v: { id: string; payload: Partial<Kategori> }) =>
      updateKategori(v.id, v.payload),
    onSuccess: () => {
      toast.success("Kategori diperbarui");
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
      setIsEditOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKategori,
    onSuccess: () => {
      toast.success("Kategori dihapus");
      queryClient.invalidateQueries({ queryKey: ["kategori"] });
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    },
  });

  ///
  /// FILTERING
  ///
  const filtered = kategoriList.filter((k) => {
    if (!search) return true;
    return k.nama_kategori.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Kategori</h1>
          <p className="text-muted-foreground">Kelola daftar kategori</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 pt-3">
              <div>
                <Label>Nama Kategori</Label>
                <Input
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() =>
                  createMutation.mutate({
                    nama_kategori: formNama,
                  })
                }
              >
                Simpan
              </Button>

              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <Label>Cari</Label>
            <Input
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>Total: {filtered.length} kategori ditemukan</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && <div>Memuat...</div>}
          {isError && (
            <div className="text-red-600">Gagal memuat data kategori</div>
          )}

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((k) => (
                  <TableRow key={k.id_kategori}>
                    <TableCell>{k.id_kategori}</TableCell>
                    <TableCell>{k.nama_kategori}</TableCell>
                    <TableCell>
                      {new Date(k.created_at).toLocaleDateString("id-ID")}
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTarget(k);
                          setFormNama(k.nama_kategori);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteTarget(k);
                          setIsDeleteOpen(true);
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

          {/* MOBILE CARD LIST */}
          <div className="md:hidden space-y-4">
            {filtered.map((k) => (
              <Card key={k.id_kategori} className="p-4 shadow-sm">
                <h2 className="text-lg font-semibold">{k.nama_kategori}</h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Dibuat: {new Date(k.created_at).toLocaleDateString("id-ID")}
                </p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditTarget(k);
                      setFormNama(k.nama_kategori);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDeleteTarget(k);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Nama Kategori</Label>
              <Input
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() =>
                updateMutation.mutate({
                  id: editTarget!.id_kategori,
                  payload: {
                    nama_kategori: formNama,
                  },
                })
              }
            >
              Simpan
            </Button>

            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            Apakah Anda yakin ingin menghapus{" "}
            <b>{deleteTarget?.nama_kategori}</b>? <br />
            Tindakan ini tidak dapat dibatalkan.
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id_kategori);
              }}
            >
              Hapus
            </Button>

            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
