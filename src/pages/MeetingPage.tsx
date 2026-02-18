import { useCallback, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import { useCurrentUser } from '@/contexts/user/userContext';
import {
  type Meeting,
  MeetingCard,
  MeetingCardSkeleton,
  MeetingCreationModal,
  MeetingDetailPanel,
  useMeetings,
} from '@/features/meeting';

export default function MeetingPage() {
  const user = useCurrentUser();
  const { createMeeting, deleteMeeting, isLoading, meetings } = useMeetings(user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const filteredMeetings = useMemo(() => {
    if (!searchFilter.trim()) return meetings;
    const query = searchFilter.toLowerCase();
    return meetings.filter(
      (m) => m.title.toLowerCase().includes(query) || m.summary.toLowerCase().includes(query),
    );
  }, [meetings, searchFilter]);

  const handleViewMeeting = useCallback((meeting: Meeting) => {
    setSelectedMeeting(meeting);
  }, []);

  const layoutContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MeetingCardSkeleton count={6} />
        </div>
      );
    }

    if (filteredMeetings.length === 0) {
      return (
        <div className="border-stroke-2 bg-components flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed">
          <p className="text-body-m text-text-white">Nenhuma reunião registrada ainda.</p>
          <p className="text-body-xs text-color-2">
            Clique em &quot;Salvar reunião&quot; para começar a gravar.
          </p>
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            size="medium"
            variant="primary"
          >
            Salvar reunião
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMeetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            {...meeting}
            onDelete={deleteMeeting}
            onView={handleViewMeeting}
          />
        ))}
      </div>
    );
  }, [isLoading, filteredMeetings, deleteMeeting, handleViewMeeting]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex min-h-full w-full flex-col px-4 py-8 md:px-8 lg:py-12">
        <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-subtitle-m text-text-white font-semibold">Minhas reuniões</h1>
              <p className="text-body-s text-text-2 mt-1">
                Registre, acesse e gerencie todas as reuniões do seu time.
              </p>
            </div>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[320px]">
                <SearchBar onSearch={setSearchFilter} placeholder="Buscar reunião..." />
              </div>

              <Button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                size="medium"
                variant="primary"
              >
                Salvar reunião
              </Button>
            </div>
          </div>

          {layoutContent}
        </div>
      </div>

      <MeetingCreationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={createMeeting}
      />

      <MeetingDetailPanel
        meeting={selectedMeeting}
        onClose={() => {
          setSelectedMeeting(null);
        }}
      />
    </div>
  );
}
