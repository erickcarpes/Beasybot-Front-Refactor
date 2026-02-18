import { FileText, Video } from 'lucide-react';

import googleMeetLogo from '@/assets/google-meet-logo.svg';
import microsoftTeamsLogo from '@/assets/microsoft-teams-logo.svg';
import zoomLogo from '@/assets/zoom-logo.svg';

export const HOME_ACTIONS = [
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
