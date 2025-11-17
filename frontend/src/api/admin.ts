import { apiRequest } from "./client";

export interface AdminUser {
  id_admin: string;
  id_user: string;
  nama_lengkap: string;
  username: string | null;
  email: string | null;
  is_active: boolean;
  created_at: Date;
}

//
// GET ALL ADMIN
//
export const fetchAdminList = async (): Promise<AdminUser[]> => {
  try {
    const res = await apiRequest("/admin-manager");

    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

    return items.map((item: any) => ({
      id_admin: item.id_admin,
      id_user: item.id_user,
      nama_lengkap: item.nama_lengkap,
      username: item.user?.username ?? null,
      email: item.user?.email ?? null,
      is_active: item.user?.is_active ?? false,
      created_at: new Date(item.user?.created_at),
    }));
  } catch {
    return [];
  }
};

//
// GET ADMIN BY ID
//
export const fetchAdminById = async (id: string): Promise<AdminUser | null> => {
  try {
    const item = await apiRequest(`/admin-manager/${id}`);
    const a = item?.data ?? item;

    return {
      id_admin: a.id_admin,
      id_user: a.id_user,
      nama_lengkap: a.nama_lengkap,
      username: a.user?.username ?? null,
      email: a.user?.email ?? null,
      is_active: a.user?.is_active ?? false,
      created_at: new Date(a.user?.created_at),
    };
  } catch {
    return null;
  }
};

//
// UPDATE ADMIN (PUT)
//
export const updateAdmin = async (
  id: string,
  payload: Partial<AdminUser>
): Promise<AdminUser | null> => {
  try {
    const item = await apiRequest(`/admin-manager/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const a = item?.data ?? item;

    return {
      id_admin: a.id_admin,
      id_user: a.id_user,
      nama_lengkap: a.nama_lengkap,
      username: a.user?.username ?? null,
      email: a.user?.email ?? null,
      is_active: a.user?.is_active ?? false,
      created_at: new Date(a.user?.created_at),
    };
  } catch {
    return null;
  }
};

//
// TOGGLE ACTIVE / INACTIVE
//
export const toggleAdminStatus = async (
  id: string
): Promise<{ status: string } | null> => {
  try {
    const res = await apiRequest(`/admin-manager/${id}/toggle-status`, {
      method: "PATCH",
    });

    return { status: res.status };
  } catch {
    return null;
  }
};

//
// DELETE ADMIN
//
export const deleteAdmin = async (id: string): Promise<boolean> => {
  try {
    await apiRequest(`/admin-manager/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
};
