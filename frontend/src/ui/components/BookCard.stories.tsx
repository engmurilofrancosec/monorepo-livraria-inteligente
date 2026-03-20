import type { Meta, StoryObj } from '@storybook/react';
import BookCard from './BookCard';

const meta: Meta<typeof BookCard> = {
  title: 'Components/BookCard',
  component: BookCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BookCard>;

export const Reading: Story = {
  args: {
    book: {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Software Engineering',
      status: 'Lendo',
      rating: 4,
      description: 'A handbook of agile software craftsmanship.',
    },
    onUpdate: () => {},
    onEdit: () => {},
  },
};

export const Finished: Story = {
  args: {
    book: {
      id: '2',
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt & David Thomas',
      category: 'Software Engineering',
      status: 'Lido',
      rating: 5,
      description: 'Your journey to mastery.',
    },
    onUpdate: () => {},
    onEdit: () => {},
  },
};

export const Abandoned: Story = {
  args: {
    book: {
      id: '3',
      title: 'Legacy Code from Hell',
      author: 'Unknown',
      category: 'Horror',
      status: 'Abandonado',
      rating: 1,
      description: 'I just couldn\'t take it anymore.',
    },
    onUpdate: () => {},
    onEdit: () => {},
  },
};
