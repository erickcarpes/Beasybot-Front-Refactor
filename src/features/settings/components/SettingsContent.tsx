import { motion } from 'framer-motion';

import type { SettingsTab } from '../constants';

import CompanySummaryTab from './tabs/CompanySummaryTab';
import IntegrationsTab from './tabs/IntegrationsTab';
import PlanAndSubscriptionTab from './tabs/PlanAndSubscriptionTab';
import PreferencesTab from './tabs/PreferencesTab';
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
        {activeTab === 'PROFILE' && <ProfileTab />}
        {activeTab === 'PREFERENCES' && <PreferencesTab />}
        {activeTab === 'COMPANY_SUMMARY' && <CompanySummaryTab />}
        {activeTab === 'PLAN' && <PlanAndSubscriptionTab />}
        {activeTab === 'INTEGRATIONS' && <IntegrationsTab />}
        {activeTab !== 'PROFILE' &&
          activeTab !== 'PREFERENCES' &&
          activeTab !== 'COMPANY_SUMMARY' &&
          activeTab !== 'PLAN' &&
          activeTab !== 'INTEGRATIONS' && (
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
