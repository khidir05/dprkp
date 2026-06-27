import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface DataTableProps<T> {
    headers: string[];
    items: T[];
    renderRow: (item: T, index: number) => React.ReactNode;
    searchQuery?: string;
    onSearchChange?: (val: string) => void;
    searchPlaceholder?: string;
    onAddClick?: () => void;
    addText?: string;
    emptyText?: string;
    paginationLinks?: any; // Inertia pagination links
}

export default function DataTable<T>({
    headers,
    items,
    renderRow,
    searchQuery,
    onSearchChange,
    searchPlaceholder = 'Cari...',
    onAddClick,
    addText = 'Tambah Baru',
    emptyText = 'Tidak ada data ditemukan.',
    paginationLinks,
}: DataTableProps<T>) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {onSearchChange !== undefined ? (
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery || ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                ) : (
                    <div />
                )}

                {onAddClick && (
                    <Button onClick={onAddClick} size="sm" className="h-9 gap-1.5">
                        <Plus className="h-4 w-4" />
                        <span>{addText}</span>
                    </Button>
                )}
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {headers.map((header, idx) => (
                                <TableHead key={idx} className="font-semibold text-muted-foreground">
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length > 0 ? (
                            items.map((item, index) => renderRow(item, index))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={headers.length} className="h-24 text-center text-muted-foreground">
                                    {emptyText}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {paginationLinks && paginationLinks.length > 3 && (
                <div className="flex items-center justify-center space-x-1 py-4">
                    {paginationLinks.map((link: any, idx: number) => {
                        const isPrevOrNext = link.label.includes('Previous') || link.label.includes('Next');
                        let label = link.label;
                        if (link.label.includes('Previous')) {
                            label = 'Sebelumnya';
                        } else if (link.label.includes('Next')) {
                            label = 'Berikutnya';
                        }

                        return (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        window.location.href = link.url;
                                    }
                                }}
                                className="h-9 px-3"
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
