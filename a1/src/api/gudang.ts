import { apiRequest } from "./client";

export interface Gudang {
  id_gudang: string;
  nama_gudang: string;
  alamat: string;
  deskripsi: string | null;
  created_at: Date;
  updated_at: Date;
}

//
// GET ALL
//
export const fetchGudangList = async (): Promise<Gudang[]> => {
  try {
    const res = await apiRequest("/gudang");

    // support array langsung atau { data: [] }
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

    return items.map((item: any) => ({
      id_gudang: item.id_gudang,
      nama_gudang: item.nama_gudang,
      alamat: item.alamat,
      deskripsi: item.deskripsi,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    }));
  } catch {
    return [];
  }
};

//
// GET BY ID
//
export const fetchGudangById = async (id: string): Promise<Gudang | null> => {
  try {
    const item = await apiRequest(`/gudang/${id}`);

    const g = item?.data ?? item; // compatible

    return {
      id_gudang: g.id_gudang,
      nama_gudang: g.nama_gudang,
      alamat: g.alamat,
      deskripsi: g.deskripsi,
      created_at: new Date(g.created_at),
      updated_at: new Date(g.updated_at),
    };
  } catch {
    return null;
  }
};

//
// CREATE
//
export const createGudang = async (payload: {
  nama_gudang: string;
  alamat: string;
  deskripsi?: string | null;
}): Promise<Gudang | null> => {
  try {
    const item = await apiRequest("/gudang", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const g = item?.data ?? item;

    return {
      id_gudang: g.id_gudang,
      nama_gudang: g.nama_gudang,
      alamat: g.alamat,
      deskripsi: g.deskripsi,
      created_at: new Date(g.created_at),
      updated_at: new Date(g.updated_at),
    };
  } catch {
    return null;
  }
};

//
// UPDATE
//
export const updateGudang = async (
  id: string,
  payload: Partial<Gudang>
): Promise<Gudang | null> => {
  try {
    const item = await apiRequest(`/gudang/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const g = item?.data ?? item;

    return {
      id_gudang: g.id_gudang,
      nama_gudang: g.nama_gudang,
      alamat: g.alamat,
      deskripsi: g.deskripsi,
      created_at: new Date(g.created_at),
      updated_at: new Date(g.updated_at),
    };
  } catch {
    return null;
  }
};

export const deleteGudang = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/gudang/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
};
