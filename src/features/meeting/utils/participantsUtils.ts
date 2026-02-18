export const getParticipantsLabel = (participants?: string[]): string => {
  if (!participants || participants.length === 0) {
    return 'Nenhum participante identificado';
  }

  const unidentified = participants.every((participant) => participant.length <= 1);

  if (unidentified) {
    return participants.length === 1 ? 'Não identificado' : 'Não identificados';
  }

  return participants.join(', ');
};
