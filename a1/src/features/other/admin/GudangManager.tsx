import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchGudangList,
  createGudang,
  updateGudang,
  deleteGudang,
  Gudang,
} from "@/api/gudang";

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

export default function GudangManager() {
  const queryClient = useQueryClient();

  // Search
  const [search, setSearch] = useState("");

  // Create/Edit
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Gudang | null>(null);

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Gudang | null>(null);

  // Form fields
  const [formNama, setFormNama] = useState("");
  const [formAlamat, setFormAlamat] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");

  const resetForm = () => {
    setFormNama("");
    setFormAlamat("");
    setFormDeskripsi("");
  };

  ///
  /// FETCH GUDANG
  ///
  const { data: gudangList = [], isLoading, isError } = useQuery({
    queryKey: ["gudang"],
    queryFn: fetchGudangList,
  });

  ///
  /// MUTATIONS
  ///
  const createMutation = useMutation({
    mutationFn: createGudang,
    onSuccess: () => {
      toast.success("Gudang berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["gudang"] });
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (v: { id: string; payload: Partial<Gudang> }) =>
      updateGudang(v.id, v.payload),
    onSuccess: () => {
      toast.success("Gudang diperbarui");
      queryClient.invalidateQueries({ queryKey: ["gudang"] });
      setIsEditOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGudang,
    onSuccess: () => {
      toast.success("Gudang dihapus");
      queryClient.invalidateQueries({ queryKey: ["gudang"] });
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    },
  });

  ///
  /// FILTERING
  ///
  const filtered = gudangList.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();

    return (
      g.nama_gudang.toLowerCase().includes(q) ||
      g.alamat.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Gudang</h1>
          <p className="text-muted-foreground">Kelola data gudang</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Tambah Gudang
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Gudang</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 pt-3">
              <div>
                <Label>Nama Gudang</Label>
                <Input
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                />
              </div>

              <div>
                <Label>Alamat</Label>
                <Input
                  value={formAlamat}
                  onChange={(e) => setFormAlamat(e.target.value)}
                />
              </div>

              <div>
                <Label>Deskripsi</Label>
                <Input
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() =>
                  createMutation.mutate({
                    nama_gudang: formNama,
                    alamat: formAlamat,
                    deskripsi: formDeskripsi || null,
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
              placeholder="Cari nama gudang / alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Gudang</CardTitle>
          <CardDescription>
            Total: {filtered.length} gudang ditemukan
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && <div>Memuat...</div>}
          {isError && (
            <div className="text-red-600">Gagal memuat data gudang</div>
          )}

          {/* DESKTOP */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id_gudang}>
                    <TableCell>{g.id_gudang}</TableCell>
                    <TableCell>{g.nama_gudang}</TableCell>
                    <TableCell>{g.alamat}</TableCell>
                    <TableCell>{g.deskripsi ?? "-"}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTarget(g);
                          setFormNama(g.nama_gudang);
                          setFormAlamat(g.alamat);
                          setFormDeskripsi(g.deskripsi ?? "");
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteTarget(g);
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

          {/* MOBILE */}
          <div className="md:hidden space-y-4">
            {filtered.map((g) => (
              <Card key={g.id_gudang} className="p-4 shadow-sm">
                <h2 className="text-lg font-semibold">{g.nama_gudang}</h2>

                <div className="mt-2 text-sm">
                  <p>
                    <b>Alamat:</b> {g.alamat}
                  </p>
                  <p>
                    <b>Deskripsi:</b> {g.deskripsi ?? "-"}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditTarget(g);
                      setFormNama(g.nama_gudang);
                      setFormAlamat(g.alamat);
                      setFormDeskripsi(g.deskripsi ?? "");
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDeleteTarget(g);
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
            <DialogTitle>Edit Gudang</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Nama Gudang</Label>
              <Input
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
              />
            </div>

            <div>
              <Label>Alamat</Label>
              <Input
                value={formAlamat}
                onChange={(e) => setFormAlamat(e.target.value)}
              />
            </div>

            <div>
              <Label>Deskripsi</Label>
              <Input
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() =>
                updateMutation.mutate({
                  id: editTarget!.id_gudang,
                  payload: {
                    nama_gudang: formNama,
                    alamat: formAlamat,
                    deskripsi: formDeskripsi || null,
                  },
                })
              }
            >
              Simpan
            </Button>

            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Gudang</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            Apakah Anda yakin ingin menghapus{" "}
            <b>{deleteTarget?.nama_gudang}</b>? <br />
            Tindakan ini tidak dapat dibatalkan.
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id_gudang);
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
