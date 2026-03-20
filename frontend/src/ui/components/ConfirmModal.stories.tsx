import type { Meta, StoryObj } from '@storybook/react';
import ConfirmModal from './ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Danger: Story = {
  args: {
    isOpen: true,
    title: 'Remover Livro',
    message: 'Tem certeza que deseja remover "O Hobbit"? Esta ação não pode ser desfeita e o livro será excluído permanentemente da sua biblioteca.',
    confirmText: 'Remover',
    cancelText: 'Cancelar',
    variant: 'danger',
    onClose: () => console.log('Close'),
    onConfirm: () => console.log('Confirm'),
  },
};

export const Info: Story = {
  args: {
    isOpen: true,
    title: 'Arquivar Livro',
    message: 'Deseja mover este livro para o arquivo? Ele ainda poderá ser acessado na seção de histórico.',
    confirmText: 'Arquivar',
    cancelText: 'Manter',
    variant: 'info',
    onClose: () => console.log('Close'),
    onConfirm: () => console.log('Confirm'),
  },
};
