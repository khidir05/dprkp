import { apiRequest } from "./client";

export interface Retriever {
  id_retriever: string;
  id_user: string;
  nama_lengkap: string;
  username: string | null;
  email: string | null;
  rusun: string | null;
  id_rusun: string | null;
  kategori: string | null;
  deskripsi: string | null;
  is_active: boolean;
  created_at: Date;
}

export const fetchUsers = async (): Promise<Retriever[]> => {
  try {
    const res = await apiRequest("/retriever");

    const items = Array.isArray(res?.data) ? res.data : [];

    return items.map((item: any) => ({
      id_retriever: item.id_retriever,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      is_active: item.user?.is_active ?? false,
      kategori: item.kategori ?? null,
      deskripsi: item.deskripsi ?? null,
      rusun: item.rusun?.nama_rusun ?? null,
      id_rusun: item.id_rusun ?? null,
      created_at: new Date(item.user?.created_at),
    }));
  } catch (e) {
    return [];
  }
};

export const fetchUserById = async (id: string): Promise<Retriever | null> => {
  try {
    const item = await apiRequest(`/retriever/${id}`);

    return {
      id_retriever: item.id_retriever,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      is_active: item.user?.is_active ?? false,
      kategori: item.kategori ?? null,
      deskripsi: item.deskripsi ?? null,
      rusun: item.rusun?.nama_rusun ?? null,
      id_rusun: item.id_rusun ?? null,
      created_at: new Date(item.created_at),
    };
  } catch {
    return null;
  }
};

//
// UPDATE (PUT)
//
export const updateUser = async (
  id: string,
  payload: any
): Promise<Retriever | null> => {
  try {
    const item = await apiRequest(`/retriever/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return {
      id_retriever: item.id_retriever,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      is_active: item.user?.is_active ?? false,
      kategori: item.kategori ?? null,
      deskripsi: item.deskripsi ?? null,
      rusun: item.rusun?.nama_rusun ?? null,
      id_rusun: item.id_rusun ?? null,
      created_at: new Date(item.created_at),
    };
  } catch {
    return null;
  }
};

//
// TOGGLE ACTIVE/INACTIVE
//
export const toggleUserStatus = async (
  id: string
): Promise<{ status: string } | null> => {
  try {
    const res = await apiRequest(`/retriever/${id}/toggle-status`, {
      method: "PATCH",
    });
    return { status: res.status };
  } catch {
    return null;
  }
};

//
// DELETE RETRIEVER
//
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/retriever/${id}`, {
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
export const createRetrieverRegistrationLink = async (): Promise<{
  message: string;
  registration_link: string;
} | null> => {
  try {
    const res = await apiRequest("/registration-links", {
      method: "POST",
      body: JSON.stringify({ role: "retriever" }),
    });

    return {
      message: res.message,
      registration_link: res.registration_link,
    };
  } catch {
    return null;
  }
};
