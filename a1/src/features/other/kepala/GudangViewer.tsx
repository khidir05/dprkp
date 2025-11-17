import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchGudangList, Gudang } from "@/api/gudang";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function GudangManager() {
  // Search
  const [search, setSearch] = useState("");

  /// FETCH
  const { data: gudangList = [], isLoading, isError } = useQuery({
    queryKey: ["gudang"],
    queryFn: fetchGudangList,
  });

  /// FILTER
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
      <div>
        <h1 className="text-3xl font-bold">Data Gudang</h1>
        <p className="text-muted-foreground">
          Lihat daftar gudang dan gunakan filter untuk pencarian
        </p>
      </div>

      {/* SEARCH */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Cari</Label>
          <Input
            placeholder="Cari nama gudang / alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama Gudang</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id_gudang}>
                    <TableCell>{g.id_gudang}</TableCell>
                    <TableCell>{g.nama_gudang}</TableCell>
                    <TableCell>{g.alamat}</TableCell>
                    <TableCell>{g.deskripsi ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* MOBILE CARD LIST */}
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
                  <p>
                    <b>ID:</b> {g.id_gudang}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
