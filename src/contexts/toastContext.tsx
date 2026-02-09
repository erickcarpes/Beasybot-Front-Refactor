import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import Toast, { ToastContainer, type ToastType } from '../components/ui/Toast';

interface ToastContextData {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

interface ToastMessage {
  id: string;
  message: string;
  title: string;
  type: ToastType;
}

const defaultTitles: Record<ToastType, string> = {
  error: 'Erro',
  success: 'Sucesso',
};

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success', title?: string) => {
    const id = crypto.randomUUID();
    const toastTitle = title ?? defaultTitles[type];
    setMessages((previous) => [...previous, { id, message, title: toastTitle, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const portal = (
    <ToastContainer>
      {messages.map((toastMessage) => (
        <Toast key={toastMessage.id} {...toastMessage} onClose={removeToast} />
      ))}
    </ToastContainer>
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(portal, document.body)}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
