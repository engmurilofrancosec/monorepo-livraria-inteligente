import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Chat from '../ui/components/Chat';
import api from '../infrastructure/api/client';
import { Mock } from 'vitest';

vi.mock('../infrastructure/api/client', () => ({
  default: {
    post: vi.fn()
  }
}));

const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe('Chat Component', () => {
  it('renders initial state correctly', () => {
    render(<Chat onUpdate={vi.fn()} />);
    
    expect(screen.getByText('Assistente Murilo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Converse com o assistente...')).toBeInTheDocument();
  });

  it('adds user message and calls API on submit', async () => {
    (api.post as Mock).mockResolvedValue({ 
      data: { text: 'Resposta do backend', hasAction: false } 
    });

    render(<Chat onUpdate={vi.fn()} />);

    const input = screen.getByPlaceholderText('Converse com o assistente...');
    const submitBtn = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Teste de mensagem' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Teste de mensagem')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/chat', {
        message: 'Teste de mensagem',
        history: [] // No prior messages
      });
      expect(screen.getByText('Resposta do backend')).toBeInTheDocument();
    });
  });

  it('calls onUpdate callback if API responds with hasAction', async () => {
    const mockUpdate = vi.fn();
    (api.post as Mock).mockResolvedValue({ 
      data: { text: 'Atualizando...', hasAction: true } 
    });

    render(<Chat onUpdate={mockUpdate} />);

    const input = screen.getByPlaceholderText('Converse com o assistente...');
    fireEvent.change(input, { target: { value: 'Atualize...' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
