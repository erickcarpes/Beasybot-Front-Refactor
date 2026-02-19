// ============================================================================
// Step Types
// ============================================================================

export interface ChatMessage {
  /** Conteúdo textual da mensagem */
  readonly content: string;
  /** ID único da mensagem */
  readonly id: string;
  /** Quem enviou */
  readonly role: MessageRole;
}

export type MessageRole = 'bot' | 'user';

export interface OnboardingPayload {
  readonly businessSegment?: string;
  readonly companyName?: string;
  readonly importantLinks?: string;
  readonly jobRole?: string;
  readonly preferredTone?: string;
  readonly usageFocus?: string;
}

export interface Option {
  readonly label: string;
  readonly value: string;
}

// ============================================================================
// Chat Message Types
// ============================================================================

export interface Step {
  /** Chave do campo enviado à API */
  readonly apiId?: string;
  /** Função ou texto de descrição auxiliar */
  readonly description?: ((value: string) => string) | string;
  /** Identificador do step */
  readonly id: StepId;
  /** Opções para steps do tipo 'options' */
  readonly options?: readonly Option[];
  /** Placeholder para steps do tipo 'input' */
  readonly placeholder?: string;
  /** Texto/pergunta do bot (pode depender do nome do usuário) */
  readonly text: ((userName: string | undefined) => string) | string;
  /** Tipo de interação */
  readonly type: StepType;
}

export type StepId =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'stepFinal';

// ============================================================================
// Onboarding Data
// ============================================================================

export type StepType = 'input' | 'options' | 'review';
