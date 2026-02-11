import { useState } from 'react';

export type FileModalType = 'BULK_DELETE' | 'CREATE_FILE';

export const useFileModal = () => {
  const [activeModal, setActiveModal] = useState<FileModalType | null>(null);

  const openModal = (type: FileModalType) => {
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
  };

  return {
    activeModal,
    closeModal,
    openModal,
  };
};
