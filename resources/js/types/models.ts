export interface Role {
    id: number;
    code: string;
    nama: string;
    label: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Unit {
    id: number;
    name: string;
    symbol: string;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Warehouse {
    id: number;
    code: string;
    name: string;
    address: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    users?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
}

export interface Product {
    id: number;
    category_id: number;
    unit_id: number;
    sku: string;
    code: string;
    name: string;
    description: string | null;
    minimum_stock: number;
    is_active: boolean;
    is_hold: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
    unit?: Unit;
}
