import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'default' | 'destructive';
};

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'Apakah Anda yakin?',
    description = 'Tindakan ini tidak dapat dibatalkan.',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    isLoading = false,
    variant = 'default',
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex flex-row justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <Spinner className="mr-2" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
