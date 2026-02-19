import { Building2, CreditCard, LayoutGrid, Settings, User } from 'lucide-react';

export const APP_VERSION = 'v1.0.2';

export type SettingsTab = 'COMPANY_SUMMARY' | 'INTEGRATIONS' | 'PLAN' | 'PREFERENCES' | 'PROFILE';

export interface SettingsTabItem {
  icon: React.ElementType;
  key: SettingsTab;
  label: string;
}

export const SETTINGS_TABS: SettingsTabItem[] = [
  {
    icon: User,
    key: 'PROFILE',
    label: 'Perfil e usuário',
  },
  {
    icon: Settings,
    key: 'PREFERENCES',
    label: 'Preferências',
  },
  {
    icon: Building2,
    key: 'COMPANY_SUMMARY',
    label: 'Resumo da empresa',
  },
  {
    icon: CreditCard,
    key: 'PLAN',
    label: 'Plano e assinatura',
  },
  {
    icon: LayoutGrid,
    key: 'INTEGRATIONS',
    label: 'Integrações',
  },
];
