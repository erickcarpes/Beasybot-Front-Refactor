import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { SETTINGS_TABS, type SettingsTab } from '../constants';
import SettingsContent from './SettingsContent';
import SettingsSidebar from './SettingsSidebar';

interface SettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          {/* Modal Container */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="bg-component-default border-border-dark-gray relative flex h-[85vh] w-[90vw] max-w-[1200px] overflow-hidden rounded-2xl border shadow-2xl"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Close Button */}
            <button
              className="text-text-gray hover:text-text-white absolute top-6 right-6 z-10 p-2 transition-colors hover:cursor-pointer"
              onClick={onClose}
              type="button"
            >
              <X size={24} />
            </button>

            {/* Sidebar */}
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Area */}
            <div className="bg-background flex-1">
              <div className="flex h-full flex-col">
                {/* Header of content (Optional, usually breadcrumb or title) */}
                <div className="border-border-dark-gray flex h-20 items-center border-b px-10">
                  <h2 className="text-heading-s text-text-white font-bold">
                    {SETTINGS_TABS.find((t) => t.key === activeTab)?.label}
                  </h2>
                </div>

                {/* Content */}
                <SettingsContent activeTab={activeTab} />
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
