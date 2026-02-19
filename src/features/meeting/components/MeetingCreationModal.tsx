import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

import Modal from '@/components/ui/Modal';
import TabSwitcher from '@/components/ui/TabSwitcher';

import type { MeetingRequest } from '../services/meeting';

import ImportTab from './ImportTab';
import RecordTab from './RecordTab';

// ============================================================================
// Types
// ============================================================================

interface MeetingCreationModalProps {
  readonly initialTab?: ModalTab;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (data: Omit<MeetingRequest, 'userId'>) => void;
  readonly onImport?: (files: File[]) => void;
}

type ModalTab = 'IMPORT' | 'RECORD';

// ============================================================================
// Constants
// ============================================================================

const TAB_ITEMS = [
  { label: 'Gravar', value: 'RECORD' as const },
  { label: 'Importar', value: 'IMPORT' as const },
];

// ============================================================================
// Component
// ============================================================================

export default function MeetingCreationModal({
  initialTab,
  isOpen,
  onClose,
  onConfirm,
  onImport,
}: MeetingCreationModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab ?? 'RECORD');

  if (!isOpen) return null;

  const handleConfirm = (data: Omit<MeetingRequest, 'userId'>) => {
    onConfirm(data);
    onClose();
  };

  const handleImport = (files: File[]) => {
    onImport?.(files);
    onClose();
  };

  return (
    <Modal.Root className="w-full max-w-lg gap-6">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h2 className="text-heading-s text-text-white font-bold">Salvar reunião</h2>

        <TabSwitcher items={TAB_ITEMS} onChange={setActiveTab} value={activeTab} />

        <button
          className="text-text-2 hover:text-text-white cursor-pointer transition-colors"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tab Content */}
      <Modal.Content className="flex min-h-[340px] w-full flex-col items-start p-0">
        <AnimatePresence mode="wait">
          {activeTab === 'RECORD' ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex w-full flex-1 flex-col"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              key="record"
              transition={{ duration: 0.2 }}
            >
              <RecordTab onCancel={onClose} onConfirm={handleConfirm} />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex w-full flex-1 flex-col"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
              key="import"
              transition={{ duration: 0.2 }}
            >
              <ImportTab onAdvance={handleImport} onCancel={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </Modal.Content>
    </Modal.Root>
  );
}
