import {
  AudioLines,
  Calendar,
  Check,
  CircleX,
  Clock,
  Eye,
  LoaderCircle,
  type LucideIcon,
  Play,
  Trash2,
  Users,
  UserX,
} from 'lucide-react';

import type { DropdownItem } from '@/components/ui/DropdownMenu';

import DropdownMenu from '@/components/ui/DropdownMenu';
import { type Meeting } from '@/features/meeting';
import { getParticipantsLabel } from '@/features/meeting';
import { cn } from '@/utils/cn';

interface MeetingCardProps extends Meeting {
  onDelete: (meetingId: string) => void;
  onView?: (meeting: Meeting) => void;
}

const statusConfig: Record<
  Meeting['status'],
  { animation?: string; color: string; icon: LucideIcon; label: string }
> = {
  COMPLETED: { color: 'bg-green-accent text-text-white', icon: Check, label: 'Concluída' },
  DENIED: { color: 'bg-fail-error text-text-white', icon: UserX, label: 'Permissão negada' },
  FAILED: { color: 'bg-fail-error text-text-white', icon: CircleX, label: 'Falhou' },
  PENDING: {
    animation: 'animate-spin',
    color: 'bg-text-2 text-text-white',
    icon: LoaderCircle,
    label: 'Aguardando',
  },
  PROCESSING: {
    animation: 'animate-spin',
    color: 'bg-[#9949BF] text-text-white',
    icon: LoaderCircle,
    label: 'Transcrevendo',
  },
  RECORDING: {
    animation: 'animate-wiggle',
    color: 'bg-[#C95252] text-text-white',
    icon: AudioLines,
    label: 'Gravando',
  },
  WAITING_ROOM: { color: 'bg-text-2 text-text-white', icon: Users, label: 'Sala de espera' },
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function MeetingCard({
  createdAt,
  duration,
  fileUrl,
  id,
  insights,
  onDelete,
  onView,
  participants,
  status,
  summary,
  title,
}: Readonly<MeetingCardProps>) {
  const { animation, color, icon: Icon, label } = statusConfig[status];
  const participantsLabel = getParticipantsLabel(participants);
  const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const meetingRecord: Meeting = {
    createdAt,
    duration,
    fileUrl: fileUrl,
    id,
    insights,
    participants,
    status,
    summary,
    title,
    url: fileUrl,
  };

  const menuItems: DropdownItem[] = [
    fileUrl && {
      icon: Play,
      label: 'Ver gravação',
      onClick: () => window.open(fileUrl, '_blank'),
    },
    onView && {
      icon: Eye,
      label: 'Ver detalhes',
      onClick: () => {
        onView(meetingRecord);
      },
    },
    {
      icon: Trash2,
      label: 'Excluir reunião',
      onClick: () => {
        onDelete(id);
      },
      variant: 'destructive',
    },
  ].filter(Boolean);

  return (
    <article
      className={cn(
        'border-stroke-2 bg-components flex h-full flex-col justify-between rounded-2xl border p-5 shadow-[8px_8px_6px_0_rgba(22,21,21,0.6)] transition-transform duration-200',
        status === 'COMPLETED' ? 'cursor-pointer hover:scale-[1.01]' : '',
      )}
      onClick={() => {
        if (status === 'COMPLETED' && onView) {
          onView(meetingRecord);
        }
      }}
    >
      <header className="flex items-start justify-between gap-3 pb-4">
        <h3 className="text-body-m text-text-white leading-tight font-semibold">
          {title || 'Reunião'}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold',
              color,
            )}
          >
            {label}
            <Icon className={animation} size={14} />
          </span>
          <DropdownMenu items={menuItems} />
        </div>
      </header>

      <div className="text-body-xs text-color-2 flex flex-col gap-2 pb-4">
        <div className="flex items-center gap-2">
          <Users size={14} />
          <span className="truncate">{participantsLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      <hr className="border-stroke-2" />
      <p className="text-text-white line-clamp-4 pt-4 text-sm leading-5">{summary}</p>
    </article>
  );
}
