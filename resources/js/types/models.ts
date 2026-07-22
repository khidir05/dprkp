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
    stocks?: Array<{
        id: number;
        warehouse_id: number;
        product_id: number;
        qty: number;
    }>;
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
    created_by?: { id: number; name: string };
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

