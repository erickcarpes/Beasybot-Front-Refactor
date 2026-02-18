import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, Lightbulb, Play, Users, X } from 'lucide-react';

import { type Meeting } from '@/features/meeting';
import { getParticipantsLabel } from '@/features/meeting';

import { ChatInput } from '../../chat';

interface MeetingDetailPanelProps {
  readonly meeting: Meeting | null;
  readonly onClose: () => void;
  readonly onSendMessage?: (meetingId: string, message: string) => void;
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function MeetingDetailPanel({
  meeting,
  onClose,
  onSendMessage,
}: MeetingDetailPanelProps) {
  const participantsLabel = meeting ? getParticipantsLabel(meeting.participants) : '';
  const formattedDate = meeting
    ? new Date(meeting.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';
  const formattedTime = meeting
    ? new Date(meeting.createdAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <AnimatePresence>
      {meeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-components border-stroke-3 flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border shadow-2xl"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="border-stroke-2 flex items-start justify-between gap-3 border-b p-6 pb-4">
              <div className="flex-1">
                <h2 className="text-heading-s text-text-white font-semibold">
                  {meeting.title || 'Reunião'}
                </h2>
                <div className="text-body-xs text-text-2 mt-2 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formattedDate} • {formattedTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {formatDuration(meeting.duration)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={13} />
                    {participantsLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {meeting.fileUrl && (
                  <button
                    className="button-neutral-no-border flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium hover:cursor-pointer"
                    onClick={() => window.open(meeting.fileUrl, '_blank')}
                    type="button"
                  >
                    <Play size={14} />
                    Ver gravação
                  </button>
                )}
                <button
                  className="text-text-2 hover:text-text-white cursor-pointer transition-colors"
                  onClick={onClose}
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="conversation-list-scrollbar flex-1 overflow-y-auto p-6">
              {/* Summary */}
              {meeting.summary && (
                <section className="mb-6">
                  <h3 className="text-body-m text-text-white mb-2 font-semibold">Resumo</h3>
                  <p className="text-body-s text-text-2 leading-relaxed">{meeting.summary}</p>
                </section>
              )}

              {/* Insights */}
              {meeting.insights.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-body-m text-text-white mb-3 font-semibold">Insights</h3>
                  <div className="flex flex-col gap-2">
                    {meeting.insights.map((insight, index) => (
                      <div
                        className="border-stroke-2 bg-component-pressed flex items-start gap-3 rounded-xl border p-3"
                        key={index}
                      >
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
                          <Lightbulb className="text-amber-400" size={12} />
                        </div>
                        <p className="text-body-s text-text-2 leading-relaxed">{insight}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Participants */}
              {meeting.participants.length > 0 && (
                <section>
                  <h3 className="text-body-m text-text-white mb-3 font-semibold">Participantes</h3>
                  <div className="flex flex-wrap gap-2">
                    {meeting.participants.map((participant, index) => (
                      <span
                        className="border-stroke-2 bg-component-hover rounded-full border px-3 py-1 text-xs text-white/70"
                        key={index}
                      >
                        {participant || 'Não identificado'}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-stroke-2 flex items-center justify-center border-t p-4">
              <ChatInput
                onSendMessage={({ text }) => {
                  if (text.trim()) {
                    onSendMessage?.(meeting.id, text.trim());
                  }
                }}
                placeholder="Pergunte algo sobre essa reunião..."
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
