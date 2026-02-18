import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import TermsModal from '../TermsModal';

describe('TermsModal', () => {
  const scrollToBottom = (content: HTMLElement) => {
    Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(content, 'clientHeight', { configurable: true, value: 200 });
    content.scrollTop = 950;
    fireEvent.scroll(content, { target: { scrollTop: 950 } });
  };

  test('keeps accept button disabled until content is scrolled', () => {
    render(<TermsModal isOpen onAccept={vi.fn()} onClose={vi.fn()} />);

    const acceptButton = screen.getByRole('button', { name: /aceitar termos/i });
    expect(acceptButton).toBeDisabled();

    const scrollable = screen.getByText(/última atualização:/i).parentElement;
    expect(scrollable).toBeInTheDocument();

    if (scrollable) {
      scrollToBottom(scrollable);
    }

    expect(acceptButton).toBeEnabled();
  });

  test('calls onAccept and onClose when user accepts after scrolling', () => {
    const onAccept = vi.fn();
    const onClose = vi.fn();

    render(<TermsModal isOpen onAccept={onAccept} onClose={onClose} />);

    const scrollable = screen.getByText(/última atualização:/i).parentElement;
    if (scrollable) {
      scrollToBottom(scrollable);
    }

    const acceptButton = screen.getByRole('button', { name: /aceitar termos/i });
    fireEvent.click(acceptButton);

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closes when the Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<TermsModal isOpen onAccept={vi.fn()} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});
