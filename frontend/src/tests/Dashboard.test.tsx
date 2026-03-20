import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../ui/pages/Dashboard';
import api from '../infrastructure/api/client';

// Mock the API and child components
vi.mock('../infrastructure/api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn(),
    delete: vi.fn()
  }
}));

vi.mock('../ui/components/Chat', () => ({
  default: () => <div data-testid="chat-mock">Mock Chat</div>
}));

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const Reorder = {
    Group: ({ children, ...props }: any) => <div data-testid="reorder-group">{children}</div>,
    Item: ({ children, ...props }: any) => <div data-testid="reorder-item">{children}</div>
  };
  return {
    ...actual,
    Reorder,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Dashboard Page', () => {
  it('renders correctly and fetches books on mount', async () => {
    render(<Dashboard />);

    expect(api.get).toHaveBeenCalledWith('/books');
    
    // UI elements
    expect(screen.getByText(/Gerenciador de Livros/i)).toBeInTheDocument();
  });

  it('opens the add book modal when Novo Livro is clicked', async () => {
    render(<Dashboard />);
    
    const addButton = screen.getByText('Novo Livro');
    fireEvent.click(addButton);

    // Modal appears
    expect(screen.getByText('Novo Livro', { selector: 'h2' })).toBeInTheDocument();
  });

  it('toggles mobile chat when FAB is clicked', async () => {
    render(<Dashboard />);
    
    // As in Dashboard.tsx, the FAB toggles the chat dialog specifically. We check if Chat is rendered inside the mobile drawer.
    // The mobile drawer chat renders along with the desktop chat, so there will be two Mock Chats when open.
    const fabButton = screen.getByRole('button', { name: '' }); 
    expect(screen.getAllByTestId('chat-mock')).toHaveLength(1); // Desktop only

    fireEvent.click(fabButton);
    expect(screen.getAllByTestId('chat-mock')).toHaveLength(2); // Desktop + Mobile
  });
});
