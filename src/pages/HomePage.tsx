import { useNavigate } from '@tanstack/react-router';
import Lottie from 'lottie-react';
import { FileText, Sparkles, Video } from 'lucide-react';

import googleMeetLogo from '@/assets/google-meet-logo.svg';
import loadingBotAnimation from '@/assets/loading-bot-message.json';
import microsoftTeamsLogo from '@/assets/microsoft-teams-logo.svg';
import zoomLogo from '@/assets/zoom-logo.svg';
import ChatInput from '@/components/chat/ChatInput';
import { useToast } from '@/contexts/toastContext';
import { useCurrentUser } from '@/contexts/user/userContext';
import { ActionCard, SuggestionItem } from '@/features/home';

// ============================================================================
// Constants
// ============================================================================

const ACTIONS = [
  {
    description: 'Adicione arquivos para aumentar o contexto da sua empresa',
    icon: <FileText className="text-text-gray" size={24} />,
    title: 'Salvar documento',
    to: '/app/knowledge',
  },
  {
    description: 'Grave uma reunião em diferentes plataformas online e acesse a qualquer momento.',
    icon: (
      <div className="flex items-center gap-1.5">
        <img alt="Google Meet" src={googleMeetLogo} />
        <img alt="Microsoft Teams" src={microsoftTeamsLogo} />
        <img alt="Zoom" src={zoomLogo} />
      </div>
    ),
    title: 'Gravar Reunião',
    to: '/app/meeting',
  },
  {
    description: 'Faça upload de reuniões pré gravadas e acesse a qualquer momento.',
    icon: <Video className="text-text-gray" size={24} />,
    title: 'Importar Reunião',
    to: '/app/meeting',
  },
] as const;

const SUGGESTIONS = [
  {
    description: 'Esta é uma sugestão personalizada de acordo com o seu negócio.',
    title: 'Planejar campanha de marketing',
  },
  {
    description: 'Esta é uma sugestão personalizada de acordo com o seu negócio.',
    title: 'Realizar planejamento de gastos da empresa',
  },
  {
    description: 'Esta é uma sugestão personalizada de acordo com o seu negócio.',
    title: 'Analisar funil de vendas',
  },
] as const;

// ============================================================================
// Component
// ============================================================================

export default function HomePage() {
  const user = useCurrentUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const displayName = user.name ?? 'usuário';

  const handleChatSubmit = (data: { files: File[]; text: string }) => {
    void navigate({ search: { q: data.text }, to: '/app/chat' });
  };

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto px-4 py-8 md:px-8 lg:py-12">
      <div className="flex w-full max-w-[800px] flex-col items-center gap-8">
        {/* ─── Greeting ─── */}
        <div className="flex items-center gap-3">
          <Lottie animationData={loadingBotAnimation} className="size-12" loop />
          <h1 className="text-subtitle-m text-text-white font-semibold italic">
            Olá{displayName ? `, ${displayName}` : ''}, seja bem-vindo!
          </h1>
        </div>

        {/* ─── Chat Input ─── */}
        <ChatInput
          onSendMessage={handleChatSubmit}
          onValidationError={(message) => {
            showToast(message, 'error');
          }}
        />

        {/* ─── Ações ─── */}
        <section className="flex w-full flex-col gap-4">
          <h2 className="text-body-l text-text-white font-semibold">Ações</h2>

          <div className="flex flex-col gap-4 md:flex-row">
            {ACTIONS.map((action) => (
              <ActionCard
                description={action.description}
                icon={action.icon}
                key={action.title}
                title={action.title}
                to={action.to}
              />
            ))}
          </div>
        </section>

        {/* ─── Sugestões Inteligentes ─── */}
        <section className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-body-l text-text-white font-semibold">Sugestões inteligentes</h2>
            <Sparkles size={20} />
          </div>

          <div className="flex flex-col gap-3">
            {SUGGESTIONS.map((suggestion) => (
              <SuggestionItem
                description={suggestion.description}
                disabled
                key={suggestion.title}
                title={suggestion.title}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
