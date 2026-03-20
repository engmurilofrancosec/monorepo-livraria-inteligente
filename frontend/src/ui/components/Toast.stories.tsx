import type { Meta, StoryObj } from '@storybook/react';
import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    message: 'Livro salvo com sucesso!',
    type: 'success',
    isVisible: true,
    onClose: () => {},
  },
};

export const Error: Story = {
  args: {
    message: 'Erro ao salvar o livro.',
    type: 'error',
    isVisible: true,
    onClose: () => {},
  },
};

export const Info: Story = {
  args: {
    message: 'Você tem uma nova recomendação AI.',
    type: 'info',
    isVisible: true,
    onClose: () => {},
  },
};
