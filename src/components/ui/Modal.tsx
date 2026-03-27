import { type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

type ModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: ReactNode
}

function Modal({ open, onOpenChange, children }: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content
                    className={cn(
                        'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
                        'rounded-lg border border-gray-200 bg-white shadow-xl',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        'focus:outline-none'
                    )}
                >
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('px-6 pt-6 pb-2', className)} {...props} />
}

function ModalTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <Dialog.Title className={cn('text-lg font-semibold text-gray-900', className)} {...props}>
            {children}
        </Dialog.Title>
    )
}

function ModalDescription({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <Dialog.Description className={cn('text-sm text-gray-500 mt-1', className)} {...props}>
            {children}
        </Dialog.Description>
    )
}

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('px-6 py-4', className)} {...props} />
}

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex items-center justify-end gap-3 px-6 pb-6 pt-2', className)}
            {...props}
        />
    )
}

function ModalClose({ children, ...props }: Dialog.DialogCloseProps) {
    return <Dialog.Close {...props}>{children}</Dialog.Close>
}

Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Description = ModalDescription
Modal.Body = ModalBody
Modal.Footer = ModalFooter
Modal.Close = ModalClose

export { Modal }