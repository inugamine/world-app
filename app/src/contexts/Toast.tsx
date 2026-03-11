import { createContext, useCallback, useContext, useState, ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CssVar } from '../types/Theme'

interface Toast {
    id: string
    content: ReactNode
}

interface ToastContextState {
    show: (content: ReactNode) => void
}

const ToastContext = createContext<ToastContextState>({
    show: () => {}
})

interface Props {
    children: ReactNode
}

export const ToastProvider = ({ children }: Props) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const show = useCallback((content: ReactNode) => {
        const id = Date.now().toString()
        setToasts((prev) => [...prev, { id, content }])

        // 5秒後に自動で消す
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    top: 'calc(env(safe-area-inset-top) + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    width: 'calc(100% - 32px)',
                    maxWidth: '400px',
                    pointerEvents: 'none'
                }}
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                backgroundColor: CssVar.contentBackground,
                                color: CssVar.contentText,
                                padding: '12px 16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                pointerEvents: 'auto',
                                cursor: 'pointer'
                            }}
                            onClick={() => dismiss(toast.id)}
                        >
                            {toast.content}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextState {
    return useContext(ToastContext)
}
