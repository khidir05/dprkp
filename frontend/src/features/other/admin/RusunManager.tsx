import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchRusunList,
  createRusun,
  updateRusun,
  deleteRusun,
  Rusun,
} from "@/api/rusun";

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

export default function RusunManager() {
  const queryClient = useQueryClient();

  // Search
  const [search, setSearch] = useState("");

  // Create/Edit State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Rusun | null>(null);

  // Delete popup
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Rusun | null>(null);

  const [formNama, setFormNama] = useState("");
  const [formAlamat, setFormAlamat] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");

  const resetForm = () => {
    setFormNama("");
    setFormAlamat("");
    setFormDeskripsi("");
  };

  ///
  /// Fetch Rusun
  ///
  const {
    data: rusunList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rusun"],
    queryFn: fetchRusunList,
  });

  ///
  /// Mutations
  ///
  const createMutation = useMutation({
    mutationFn: createRusun,
    onSuccess: () => {
      toast.success("Rusun berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["rusun"] });
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (v: { id: string; payload: Partial<Rusun> }) =>
      updateRusun(v.id, v.payload),
    onSuccess: () => {
      toast.success("Rusun diperbarui");
      queryClient.invalidateQueries({ queryKey: ["rusun"] });
      setIsEditOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRusun,
    onSuccess: () => {
      toast.success("Rusun dihapus");
      queryClient.invalidateQueries({ queryKey: ["rusun"] });
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    },
  });

  ///
  /// Filtering
  ///
  const filtered = rusunList.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();

    return (
      r.nama_rusun.toLowerCase().includes(q) ||
      r.alamat.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Rusun</h1>
          <p className="text-muted-foreground">Kelola data rusun</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Tambah Rusun
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Rusun</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 pt-3">
              <div>
                <Label>Nama Rusun</Label>
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
                    nama_rusun: formNama,
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
              placeholder="Cari nama rusun / alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Rusun</CardTitle>
          <CardDescription>
            Total: {filtered.length} rusun ditemukan
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && <div>Memuat...</div>}
          {isError && (
            <div className="text-red-600">Gagal memuat data rusun</div>
          )}

          {/* TABEL DESKTOP */}
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
                {filtered.map((r) => (
                  <TableRow key={r.id_rusun}>
                    <TableCell>{r.id_rusun}</TableCell>
                    <TableCell>{r.nama_rusun}</TableCell>
                    <TableCell>{r.alamat}</TableCell>
                    <TableCell>{r.deskripsi ?? "-"}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTarget(r);
                          setFormNama(r.nama_rusun);
                          setFormAlamat(r.alamat);
                          setFormDeskripsi(r.deskripsi ?? "");
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeleteTarget(r);
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

          {/* MOBILE VERSION */}
          <div className="md:hidden space-y-4">
            {filtered.map((r) => (
              <Card key={r.id_rusun} className="p-4 shadow-sm">
                <h2 className="text-lg font-semibold">{r.nama_rusun}</h2>

                <div className="mt-2 text-sm">
                  <p>
                    <b>Alamat:</b> {r.alamat}
                  </p>
                  <p>
                    <b>Deskripsi:</b> {r.deskripsi ?? "-"}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditTarget(r);
                      setFormNama(r.nama_rusun);
                      setFormAlamat(r.alamat);
                      setFormDeskripsi(r.deskripsi ?? "");
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDeleteTarget(r);
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
            <DialogTitle>Edit Rusun</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Nama Rusun</Label>
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
                  id: editTarget!.id_rusun,
                  payload: {
                    nama_rusun: formNama,
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

      {/* DELETE CONFIRMATION */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Rusun</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            Apakah Anda yakin ingin menghapus{" "}
            <b>{deleteTarget?.nama_rusun}</b>?
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.id_rusun);
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
