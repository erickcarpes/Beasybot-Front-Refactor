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
  Video,
} from 'lucide-react';
import { useMemo } from 'react';

import type { DropdownItem } from '@/components/ui/DropdownMenu';

import googleMeetLogo from '@/assets/google-meet-logo.svg';
import microsoftTeamsLogo from '@/assets/microsoft-teams-logo.svg';
import zoomLogo from '@/assets/zoom-logo.svg';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { getParticipantsLabel, type Meeting } from '@/features/meeting';
import { cn } from '@/utils/cn';

interface MeetingCardProps extends Meeting {
  onDelete: (meetingId: string) => void;
  onView?: (meeting: Meeting) => void;
}

const statusConfig: Record<
  Meeting['status'],
  { animation?: string; color: string; icon: LucideIcon; label: string }
> = {
  COMPLETED: {
    color: 'text-green',
    icon: Check,
    label: 'Concluída',
  },
  DENIED: {
    color: 'text-red',
    icon: UserX,
    label: 'Permissão negada',
  },
  FAILED: {
    color: 'text-red',
    icon: CircleX,
    label: 'Falhou',
  },
  PENDING: {
    animation: 'animate-spin',
    color: 'text-yellow',
    icon: LoaderCircle,
    label: 'Aguardando',
  },
  PROCESSING: {
    animation: 'animate-spin',
    color: 'text-orange',
    icon: LoaderCircle,
    label: 'Transcrevendo',
  },
  RECORDING: {
    animation: 'animate-wiggle animate-pulse',
    color: 'text-red',
    icon: AudioLines,
    label: 'Gravando',
  },
  WAITING_ROOM: {
    color: 'text-text-gray',
    icon: Users,
    label: 'Sala de espera',
  },
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const getPlatformIcon = (url?: string) => {
  if (!url) return <Video className="text-text-gray" size={20} />;
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('meet.google') || lowerUrl.includes('google.com')) {
    return <img alt="Google Meet" className="size-5" src={googleMeetLogo} />;
  }
  if (lowerUrl.includes('teams.microsoft') || lowerUrl.includes('teams.live')) {
    return <img alt="Microsoft Teams" className="size-5" src={microsoftTeamsLogo} />;
  }
  if (lowerUrl.includes('zoom.us')) {
    return <img alt="Zoom" className="size-5" src={zoomLogo} />;
  }

  return <Video className="text-text-gray" size={20} />;
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
  url,
}: Readonly<MeetingCardProps>) {
  const { animation, color, icon: StatusIcon, label } = statusConfig[status];
  const participantsLabel = getParticipantsLabel(participants);

  const formattedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, [createdAt]);

  const meetingRecord: Meeting = {
    createdAt,
    duration,
    fileUrl,
    id,
    insights,
    participants,
    status,
    summary,
    title,
    url: fileUrl || url,
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

  const StatusIconComponent = StatusIcon;

  return (
    <article
      className={cn(
        'group border-border-dark-gray bg-component-gradient relative flex flex-col rounded-2xl border transition-all duration-300',
        status === 'COMPLETED'
          ? 'hover:border-border-gray cursor-pointer hover:-translate-y-1 hover:shadow-xl'
          : 'opacity-90',
      )}
      onClick={() => {
        if (status === 'COMPLETED' && onView) {
          onView(meetingRecord);
        }
      }}
    >
      {/* Decorative top gradient glow */}
      <div className="absolute inset-x-0 top-0 h-24 rounded-t-2xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col p-5">
        {/* Header: Platform + Menu */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/5 shadow-inner ring-1 ring-white/5">
              {getPlatformIcon(url)}
            </div>

            {/* Status Badge */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm ring-1 ring-inset',
                status === 'COMPLETED'
                  ? 'bg-green/10 text-green ring-green/20'
                  : status === 'RECORDING' || status === 'FAILED'
                    ? 'bg-red/10 text-red ring-red/20'
                    : status === 'PENDING' || status === 'PROCESSING'
                      ? 'bg-yellow/10 text-yellow ring-yellow/20'
                      : 'bg-gray/10 text-text-gray ring-gray/20',
              )}
            >
              <StatusIconComponent className={cn(animation)} size={12} />
              {label}
            </div>
          </div>

          <DropdownMenu items={menuItems} />
        </div>

        {/* Title */}
        <h3 className="text-body-l text-text-white mb-3 line-clamp-2 leading-tight font-semibold tracking-tight">
          {title || 'Nova Reunião'}
        </h3>

        {/* Summary */}
        <p className="text-body-s text-text-gray/90 mb-6 line-clamp-3 leading-relaxed">
          {summary || 'Nenhum resumo disponível para esta reunião.'}
        </p>

        {/* Footer: Metadata Grid */}
        <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-3 border-t border-white/5 pt-4">
          <div className="text-text-gray flex items-center gap-2">
            <Calendar className="size-3.5 opacity-60" />
            <span className="text-[11px] font-medium">{formattedDate}</span>
          </div>

          <div className="text-text-gray flex items-center gap-2">
            <Clock className="size-3.5 opacity-60" />
            <span className="text-[11px] font-medium">{formatDuration(duration)}</span>
          </div>

          <div className="text-text-gray col-span-2 flex items-center gap-2">
            <Users className="size-3.5 opacity-60" />
            <span className="truncate text-[11px] font-medium">{participantsLabel}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
