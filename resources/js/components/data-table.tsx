import * as React from 'react';
import { router } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, X } from 'lucide-react';

interface DataTableProps<T> {
    headers: string[];
    items: T[];
    renderRow: (item: T, index: number) => React.ReactNode;
    searchQuery?: string;
    onSearchChange?: (val: string) => void;
    searchPlaceholder?: string;
    onAddClick?: () => void;
    addText?: string;
    extraActions?: React.ReactNode;
    emptyText?: string;
    paginationLinks?: any; // Inertia pagination links
}

export default function DataTable<T>({
    headers,
    items,
    renderRow,
    searchQuery = '',
    onSearchChange,
    searchPlaceholder = 'Cari...',
    onAddClick,
    addText = 'Tambah Baru',
    extraActions,
    emptyText = 'Tidak ada data ditemukan.',
    paginationLinks,
}: DataTableProps<T>) {
    const [localSearch, setLocalSearch] = React.useState(searchQuery);
    const isFirstRender = React.useRef(true);

    // Synchronize local search state when prop changes from outside (e.g., reset or URL change)
    React.useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    // Debounce triggering onSearchChange
    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (onSearchChange === undefined) return;

        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                onSearchChange(localSearch);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange, searchQuery]);

    const handleClearSearch = () => {
        setLocalSearch('');
        if (onSearchChange) {
            onSearchChange('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (onSearchChange && localSearch !== searchQuery) {
                onSearchChange(localSearch);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {onSearchChange !== undefined ? (
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-9 pr-8 h-9"
                        />
                        {localSearch && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-2">
                    {extraActions}
                    {onAddClick && (
                        <Button onClick={onAddClick} size="sm" className="h-9 gap-1.5">
                            <Plus className="h-4 w-4" />
                            <span>{addText}</span>
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {headers.map((header, idx) => {
                                const isAction = header.toLowerCase() === 'aksi' || header.toLowerCase() === 'tindakan';
                                return (
                                    <TableHead key={idx} className={`font-semibold text-muted-foreground ${isAction ? 'print:hidden' : ''}`}>
                                        {header}
                                    </TableHead>
                                );
                            })}
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
                                        router.visit(link.url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
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
