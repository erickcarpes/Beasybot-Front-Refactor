import { OnboardingChat } from '@/features/onboarding';

/**
 * Página de onboarding — tela fullscreen (sem sidebar) com fluxo de chat.
 * Renderizada em `/app/onboarding`, fora do layout `(main)`.
 */
export default function OnboardingPage() {
  return <OnboardingChat />;
}
