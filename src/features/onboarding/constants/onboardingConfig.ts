import type { Step, StepId } from '../types';

// ============================================================================
// Helpers
// ============================================================================

export const toneOfVoiceDescription = (value: string): string => {
  const descriptions: Record<string, string> = {
    FORMAL: 'Qual a sua opinião em relação a este tom de voz?',
    FRIENDLY: '👉 E aí, prefere que eu fale assim? 😃✨',
    INFORMAL: 'O que achou desse tom de voz?',
  };

  return descriptions[value] || 'Escolha um tom de voz';
};

// ============================================================================
// Step Configuration
// ============================================================================

export const ONBOARDING_CONFIG: Record<StepId, Step> = {
  step1: {
    apiId: 'usageFocus',
    id: 'step1',
    options: [
      { label: 'Organizar e estruturar meu negócio', value: 'ORGANIZE_BUSINESS' },
      { label: 'Tomar decisões baseadas em dados', value: 'DATA_DRIVEN_DECISIONS' },
      { label: 'Economizar tempo no meu dia a dia', value: 'SAVE_TIME' },
      { label: 'Ter insights sobre a minha operação', value: 'OPERATIONAL_INSIGHTS' },
    ],
    text: (userName: string | undefined) =>
      `Olá ${userName?.trim() ? userName : 'Usuário'}, vamos customizar sua plataforma? Qual será o seu foco principal de uso?`,
    type: 'options',
  },
  step2: {
    apiId: 'companyName',
    id: 'step2',
    placeholder: 'Nome da sua empresa',
    text: 'Ok, e qual o nome da sua empresa?',
    type: 'input',
  },
  step3: {
    apiId: 'businessSegment',
    id: 'step3',
    options: [
      { label: 'Indústria', value: 'INDUSTRY' },
      { label: 'Comércio', value: 'COMMERCE' },
      { label: 'Agronegócio', value: 'AGRIBUSINESS' },
      { label: 'Serviços', value: 'SERVICES' },
    ],
    text: 'Qual é o segmento da sua empresa?',
    type: 'options',
  },
  step4: {
    apiId: 'jobRole',
    id: 'step4',
    options: [
      { label: 'CEO', value: 'CEO' },
      { label: 'Diretor', value: 'DIRECTOR' },
      { label: 'Gestor', value: 'MANAGER' },
      { label: 'Funcionário', value: 'EMPLOYEE' },
    ],
    text: 'E qual o seu cargo dentro dessa empresa?',
    type: 'options',
  },
  step5: {
    apiId: 'preferredTone',
    id: 'step5',
    options: [
      { label: 'Formal', value: 'FORMAL' },
      { label: 'Informal', value: 'INFORMAL' },
      { label: 'Amigável', value: 'FRIENDLY' },
    ],
    text: 'Como você prefere que seja o meu tom de voz?',
    type: 'options',
  },
  step6: {
    apiId: 'importantLinks',
    id: 'step6',
    placeholder: 'Cole aqui o link do Instagram e do website',
    text: 'Por favor, insira os links do Instagram e do site da sua empresa. Essas informações permitem integrar sua presença digital à plataforma.',
    type: 'input',
  },
  step7: {
    id: 'step7',
    text: 'Com base nas informações fornecidas, vou elaborar uma breve descrição da sua empresa.',
    type: 'review',
  },
  stepFinal: {
    id: 'stepFinal',
    options: [
      { label: 'Enviar arquivos', value: 'send-files' },
      { label: 'Deixar para depois', value: 'skip-files' },
    ],
    text: 'Beleza 😁, que tal você me enviar alguns arquivos da sua empresa para eu personalizar a sua experiência?',
    type: 'options',
  },
} as const;

// ============================================================================
// Step Order
// ============================================================================

/** Ordem de execução dos steps */
export const STEP_ORDER: StepId[] = [
  'step1',
  'step2',
  'step3',
  'step4',
  'step5',
  'step6',
  'step7',
  'stepFinal',
];

/** Total de steps para cálculo de progresso */
export const TOTAL_STEPS = STEP_ORDER.length;
