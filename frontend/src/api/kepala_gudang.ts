import { apiRequest } from "./client";

export interface KepalaGudang {
  id_kepala_gudang: string;
  id_user: string;
  nama_lengkap: string;
  username: string | null;
  email: string | null;
  unit_kerja: string | null;
  rusun: string | null;
  id_rusun: string | null;
  is_active: boolean;
  created_at: Date;
}

//
// FETCH ALL
//
export const fetchKepalaGudangList = async (): Promise<KepalaGudang[]> => {
  try {
    const res = await apiRequest("/kepala-gudang");

    const items = Array.isArray(res?.data) ? res.data : [];

    return items.map((item: any) => ({
      id_kepala_gudang: item.id_kepala_gudang,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      unit_kerja: item.unit_kerja ?? null,
      rusun: item.rusun?.nama_rusun ?? null,
      id_rusun: item.id_rusun ?? null,
      is_active: item.user?.is_active ?? false,
      created_at: new Date(item.user?.created_at),
    }));
  } catch (e) {
    return [];
  }
};

//
// FETCH BY ID
//
export const fetchKepalaGudangById = async (
  id: string
): Promise<KepalaGudang | null> => {
  try {
    const item = await apiRequest(`/kepala-gudang/${id}`);

    return {
      id_kepala_gudang: item.id_kepala_gudang,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      unit_kerja: item.unit_kerja ?? null,
      rusun: item.rusun?.nama_rusun ?? null,
      id_rusun: item.id_rusun ?? null,
      is_active: item.user?.is_active ?? false,
      created_at: new Date(item.created_at),
    };
  } catch {
    return null;
  }
};

//
// UPDATE (PUT)
//
export const updateKepalaGudang = async (
  id: string,
  payload: any
): Promise<KepalaGudang | null> => {
  try {
    const item = await apiRequest(`/kepala-gudang/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return {
      id_kepala_gudang: item.id_kepala_gudang,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      unit_kerja: item.unit_kerja ?? null,
      rusun: item.rusun?.nama_rusun ?? null,
      id_rusun: item.id_rusun ?? null,
      is_active: item.user?.is_active ?? false,
      created_at: new Date(item.created_at),
    };
  } catch {
    return null;
  }
};

//
// TOGGLE ACTIVE/INACTIVE
//
export const toggleKepalaGudangStatus = async (
  id: string
): Promise<{ status: string } | null> => {
  try {
    const res = await apiRequest(`/kepala-gudang/${id}/toggle-status`, {
      method: "PATCH",
    });
    return { status: res.status };
  } catch {
    return null;
  }
};

//
// DELETE
//
export const deleteKepalaGudang = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/kepala-gudang/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
};

//
// CREATE REGISTRATION LINK
//
export const createKepalaGudangRegistrationLink = async (): Promise<{
  message: string;
  registration_link: string;
} | null> => {
  try {
    const res = await apiRequest("/registration-links", {
      method: "POST",
      body: JSON.stringify({ role: "kepala_gudang" }),
    });

    return {
      message: res.message,
      registration_link: res.registration_link,
    };
  } catch {
    return null;
  }
};
