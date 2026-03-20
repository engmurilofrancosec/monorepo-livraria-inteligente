import type { Meta, StoryObj } from '@storybook/react';
import BookFormModal from './BookFormModal';

const meta: Meta<typeof BookFormModal> = {
  title: 'Components/BookFormModal',
  component: BookFormModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookFormModal>;

export const Create: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onUpdate: () => {},
    bookToEdit: null,
  },
};

export const Edit: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onUpdate: () => {},
    bookToEdit: {
      id: '1',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      category: 'Software Engineering',
      status: 'Lendo',
      rating: 5,
      description: 'A craftsman\'s guide to software structure and design.',
    },
  },
};
