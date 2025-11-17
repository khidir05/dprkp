import { apiRequest } from "./client";

export interface Rusun {
  id_rusun: string;
  nama_rusun: string;
  alamat: string;
  deskripsi: string | null;
  created_at: Date;
  updated_at: Date;
}

export const fetchRusunList = async (): Promise<Rusun[]> => {
  try {
    const res = await apiRequest("/rusun");

    // compatible: res = [] OR { data: [] }
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

    return items.map((item: any) => ({
      id_rusun: item.id_rusun,
      nama_rusun: item.nama_rusun,
      alamat: item.alamat,
      deskripsi: item.deskripsi,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    }));
  } catch {
    return [];
  }
};

export const fetchRusunById = async (id: string): Promise<Rusun | null> => {
  try {
    const item = await apiRequest(`/rusun/${id}`);

    const r = item?.data ?? item; // compatible
    return {
      id_rusun: r.id_rusun,
      nama_rusun: r.nama_rusun,
      alamat: r.alamat,
      deskripsi: r.deskripsi,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    };
  } catch {
    return null;
  }
};

export const createRusun = async (payload: {
  nama_rusun: string;
  alamat: string;
  deskripsi?: string | null;
}): Promise<Rusun | null> => {
  try {
    const item = await apiRequest("/rusun", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const r = item?.data ?? item;
    return {
      id_rusun: r.id_rusun,
      nama_rusun: r.nama_rusun,
      alamat: r.alamat,
      deskripsi: r.deskripsi,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    };
  } catch {
    return null;
  }
};

export const updateRusun = async (
  id: string,
  payload: Partial<Rusun>
): Promise<Rusun | null> => {
  try {
    const item = await apiRequest(`/rusun/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const r = item?.data ?? item;
    return {
      id_rusun: r.id_rusun,
      nama_rusun: r.nama_rusun,
      alamat: r.alamat,
      deskripsi: r.deskripsi,
      created_at: new Date(r.created_at),
      updated_at: new Date(r.updated_at),
    };
  } catch {
    return null;
  }
};

export const deleteRusun = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/rusun/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
};
