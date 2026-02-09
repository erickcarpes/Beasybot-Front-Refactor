import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, X, XCircle } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

export interface ToastProps {
  readonly id: string;
  readonly message: string;
  readonly onClose: (id: string) => void;
  readonly title: string;
  readonly type: ToastType;
}

export type ToastType = 'error' | 'success';

interface ToastConfig {
  borderColor: string;
  icon: typeof CheckCircle;
  iconColor: string;
}

const toastConfig: Record<ToastType, ToastConfig> = {
  error: {
    borderColor: 'border-l-error',
    icon: XCircle,
    iconColor: 'text-error',
  },
  success: {
    borderColor: 'border-l-brand',
    icon: CheckCircle,
    iconColor: 'text-brand',
  },
};

interface ToastContainerProps {
  readonly children: ReactNode;
}

export default function Toast({ id, message, onClose, title, type }: Readonly<ToastProps>) {
  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [id, onClose]);

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={`pointer-events-auto flex h-[72px] w-[336px] items-center gap-3 rounded-lg border-l-6 bg-[#1a1a1a] px-4 shadow-xl ${config.borderColor}`}
      exit={{ opacity: 0, x: 100 }}
      initial={{ opacity: 0, x: 100 }}
      layout
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Icon className={`h-5 w-5 shrink-0 ${config.iconColor}`} />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-text-white text-sm font-medium">{title}</span>
        <span className="text-text-muted truncate text-xs">{message}</span>
      </div>

      <button
        className="text-text-muted hover:text-text-white shrink-0 cursor-pointer p-1 transition-colors"
        onClick={() => {
          onClose(id);
        }}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-0 bottom-0 z-50 flex flex-col gap-3 p-6">
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
}
