import { motion } from 'framer-motion';

import type { SettingsTab } from '../constants';

import ProfileTab from './tabs/ProfileTab';

interface SettingsContentProps {
  readonly activeTab: SettingsTab;
}

export default function SettingsContent({ activeTab }: SettingsContentProps) {
  return (
    <div className="scrollbar-thin h-full flex-1 overflow-y-auto p-10">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        key={activeTab}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'PROFILE' ? (
          <ProfileTab />
        ) : (
          <div className="flex items-center justify-center p-20 text-center">
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-heading-s text-text-white font-bold">Em breve</h3>
              <p className="text-body-m text-text-gray">
                Esta funcionalidade estará disponível em breve.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
