import Modal from '@/components/ui/Modal';

import { useForgotPasswordFlow } from '../hooks/useForgotPasswordFlow';
import NewPasswordStep from './steps/NewPasswordStep';
import RequestResetStep from './steps/RequestResetStep';
import VerifyCodeStep from './steps/VerifyCodeStep';

interface ForgotPasswordFlowProps {
  readonly initialEmail?: string;
  readonly initialStep?: 'NEW_PASSWORD' | 'REQUEST_RESET' | 'VERIFY_CODE';
  readonly initialTokenId?: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export default function ForgotPasswordFlow({
  initialEmail,
  initialStep,
  initialTokenId,
  isOpen,
  onClose,
}: ForgotPasswordFlowProps) {
  const {
    currentStep,
    email,
    handleNewPasswordNext,
    handleRequestResetNext,
    handleVerifyCodeNext,
    handleVerifyCodeResend,
    isConfirmResetPending,
    isRequestResetPending,
    isValidateResetPending,
  } = useForgotPasswordFlow(onClose, {
    initialEmail,
    initialStep,
    initialTokenId,
  });

  if (!isOpen) return null;

  return (
    <Modal.Root>
      {currentStep === 'REQUEST_RESET' && (
        <RequestResetStep isLoading={isRequestResetPending} onNext={handleRequestResetNext} />
      )}
      {currentStep === 'VERIFY_CODE' && (
        <VerifyCodeStep
          email={email}
          isLoading={isValidateResetPending}
          isResending={isRequestResetPending}
          onNext={handleVerifyCodeNext}
          onResend={handleVerifyCodeResend}
        />
      )}
      {currentStep === 'NEW_PASSWORD' && (
        <NewPasswordStep isLoading={isConfirmResetPending} onNext={handleNewPasswordNext} />
      )}
    </Modal.Root>
  );
}
