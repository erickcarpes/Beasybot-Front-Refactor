import { useMemo, useState } from 'react';

import GoogleMeetLogo from '@/assets/google-meet-logo.svg';
import MicrosoftTeamsLogo from '@/assets/microsoft-teams-logo.svg';
import ZoomLogo from '@/assets/zoom-logo.svg';
import Button from '@/components/ui/Button';
import InputLabel from '@/components/ui/InputLabel';

import type { MeetingRequest } from '../services/meeting';

// ============================================================================
// Types
// ============================================================================

interface RecordTabProps {
  readonly onCancel: () => void;
  readonly onConfirm: (data: Omit<MeetingRequest, 'userId'>) => void;
}

// ============================================================================
// Constants
// ============================================================================

const MEETING_PATTERNS = [
  /^https?:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i,
  /^https:\/\/teams\.microsoft\.com\/meet\/[\w-]+(\?.*)?/i,
  /^https?:\/\/([\w-]+\.)?zoom\.us\/j\/\d+(\?pwd=[^\s&]+)?/i,
];

const normalizeLink = (value: string) => {
  if (!value.trim()) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `https://${value}`;
};

const isValidMeetingLink = (value: string) => {
  const normalized = normalizeLink(value);
  if (!normalized) return false;

  try {
    new URL(normalized);
    return MEETING_PATTERNS.some((pattern) => pattern.test(normalized));
  } catch {
    return false;
  }
};

// ============================================================================
// Component
// ============================================================================

export default function RecordTab({ onCancel, onConfirm }: RecordTabProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const normalizedLink = useMemo(() => normalizeLink(url), [url]);
  const isValid = useMemo(() => title.trim().length > 0 && isValidMeetingLink(url), [url, title]);

  const titleError =
    hasSubmitted && title.trim().length === 0 ? 'Informe o nome da reunião' : undefined;
  const linkError = url && !isValidMeetingLink(url) ? 'Link inválido' : undefined;

  const handleConfirm = () => {
    setHasSubmitted(true);
    if (!isValid) return;

    onConfirm({ title: title.trim(), url: normalizedLink });
  };

  return (
    <>
      <p className="text-body-m text-text-2 mb-6">
        Entre na reunião, em seguida envie o link para iniciar a gravação. Apenas uma gravação por
        vez.
      </p>

      <div className="flex flex-col gap-4">
        <InputLabel
          error={titleError}
          label="Nome da reunião"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Digite o nome da reunião"
          value={title}
        />
        <div className="relative">
          <InputLabel
            className="text-text-white w-full bg-transparent pr-32 text-sm outline-none"
            error={linkError}
            label="Link da reunião"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="Cole aqui o link da sua reunião"
            size={'full'}
            value={url}
            variant={linkError ? 'error' : 'default'}
          />
          <div
            className={`pointer-events-none absolute top-2 right-3 bottom-0 flex items-center gap-4 transition-opacity duration-200 ${url ? 'opacity-0' : 'opacity-100'} `}
          >
            <img alt="Zoom" className="h-5 w-5" src={ZoomLogo} />
            <img alt="Teams" className="h-5 w-5" src={MicrosoftTeamsLogo} />
            <img alt="Google Meet" className="h-5 w-5" src={GoogleMeetLogo} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full justify-between gap-3">
        <Button className="flex-1" onClick={onCancel} size="full" type="button" variant="neutral">
          Cancelar
        </Button>
        <Button
          className="flex-1"
          disabled={!isValid}
          onClick={handleConfirm}
          size="full"
          type="button"
          variant="primary"
        >
          Confirmar
        </Button>
      </div>
    </>
  );
}
