import { apiRequest } from "./client";

export interface Kategori {
  id_kategori: string;
  nama_kategori: string;
  created_at: Date;
}

//
// GET ALL
//
export const fetchKategoriList = async (): Promise<Kategori[]> => {
  try {
    const res = await apiRequest("/kategori");

    // support array langsung atau { data: [...] }
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

    return items.map((item: any) => ({
      id_kategori: item.id_kategori,
      nama_kategori: item.nama_kategori,
      created_at: new Date(item.created_at),
    }));
  } catch {
    return [];
  }
};

//
// GET BY ID
//
export const fetchKategoriById = async (id: string): Promise<Kategori | null> => {
  try {
    const item = await apiRequest(`/kategori/${id}`);

    const k = item?.data ?? item;

    return {
      id_kategori: k.id_kategori,
      nama_kategori: k.nama_kategori,
      created_at: new Date(k.created_at),
    };
  } catch {
    return null;
  }
};

//
// CREATE
//
export const createKategori = async (payload: {
  nama_kategori: string;
}): Promise<Kategori | null> => {
  try {
    const item = await apiRequest("/kategori", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const k = item?.data ?? item;

    return {
      id_kategori: k.id_kategori,
      nama_kategori: k.nama_kategori,
      created_at: new Date(k.created_at),
    };
  } catch {
    return null;
  }
};

//
// UPDATE
//
export const updateKategori = async (
  id: string,
  payload: Partial<Kategori>
): Promise<Kategori | null> => {
  try {
    const item = await apiRequest(`/kategori/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const k = item?.data ?? item;

    return {
      id_kategori: k.id_kategori,
      nama_kategori: k.nama_kategori,
      created_at: new Date(k.created_at),
    };
  } catch {
    return null;
  }
};

//
// DELETE
//
export const deleteKategori = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/kategori/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
};
