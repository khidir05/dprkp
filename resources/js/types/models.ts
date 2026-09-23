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
    brand?: string | null;
    packaging?: string | null;
    stocks?: Stock[];
}

export interface Stock {
    id: number;
    warehouse_id: number;
    product_id: number;
    qty: number;
    created_at?: string;
    updated_at?: string;
    warehouse?: Warehouse;
    product?: Product;
}

export interface InboundTransaction {
    id: number;
    supplier_id: number;
    warehouse_id: number;
    transaction_number: string;
    reference_document: string | null;
    transaction_date: string;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    supplier?: Supplier;
    warehouse?: Warehouse;
    created_by_user?: { id: number; name: string };
    inbound_items?: InboundItem[];
}

export interface InboundItem {
    id: number;
    inbound_id: number;
    product_id: number;
    bast_number: string | null;
    qty: number;
    created_at: string;
    product?: Product & {
        category?: Category;
        unit?: Unit;
    };
}

export interface StockMutation {
    id: number;
    product_id: number;
    from_warehouse_id: number;
    to_warehouse_id: number;
    mutation_number: string;
    qty: number;
    status: string;
    notes: string | null;
    reason?: string | null;
    rejection_reason?: string | null;
    created_by: number | { id: number; name: string; email?: string };
    approved_by?: number | { id: number; name: string; email?: string } | null;
    approved_at?: string | null;
    created_at: string;
    updated_at: string;
    product?: Product;
    from_warehouse?: Warehouse;
    to_warehouse?: Warehouse;
    fromWarehouse?: Warehouse;
    toWarehouse?: Warehouse;
    created_by_user?: { id: number; name: string; email?: string };
    createdBy?: { id: number; name: string; email?: string };
    approved_by_user?: { id: number; name: string; email?: string };
    approvedBy?: { id: number; name: string; email?: string };
}

export interface RequestItem {
    id: number;
    request_id: number;
    product_id: number;
    qty_requested: number;
    qty_approved: number | null;
    available_stock?: number;
    created_at: string;
    product?: Product;
}

export interface ItemRequest {
    id: number;
    requester_id: number | null;
    warehouse_id: number;
    request_number: string;
    request_date: string;
    status: string;
    notes: string | null;
    rejection_reason?: string | null;
    requester_name: string | null;
    requester_dept: string | null;
    nip: string | null;
    nama_atasan: string | null;
    jabatan_atasan: string | null;
    nama_penatausahaan: string | null;
    jabatan_penatausahaan: string | null;
    nip_penatausahaan: string | null;
    nama_pengurus_barang: string | null;
    jabatan_pengurus_barang: string | null;
    nip_pengurus_barang: string | null;
    created_at: string;
    updated_at: string;
    requester?: { id: number; name: string; email: string };
    approved_by_user?: { id: number; name: string; email?: string };
    warehouse?: Warehouse;
    request_items?: RequestItem[];
}

