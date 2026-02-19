import { APP_VERSION, SETTINGS_TABS, type SettingsTab, type SettingsTabItem } from '../constants';

interface SettingsSidebarProps {
  readonly activeTab: SettingsTab;
  readonly onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <aside className="bg-component-sidebar flex w-[280px] flex-col justify-between border-r border-[#363636] p-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-body-mb text-text-white pl-2">Configurações</h2>

        <nav className="flex flex-col gap-1">
          {SETTINGS_TABS.map((tab: SettingsTabItem) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                className={`text-body-s flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 hover:cursor-pointer ${
                  isActive
                    ? 'bg-component-hover/20 text-text-white font-medium'
                    : 'text-text-gray hover:bg-component-hover/10 hover:text-text-white'
                }`}
                key={tab.key}
                onClick={() => {
                  onTabChange(tab.key);
                }}
                type="button"
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="text-body-xs text-text-gray pl-2">{APP_VERSION}</div>
    </aside>
  );
}
