import type { Meta, StoryObj } from '@storybook/react';
import StarRating from './StarRating';

const meta: Meta<typeof StarRating> = {
  title: 'Components/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {
  args: {
    rating: 3,
  },
};

export const Empty: Story = {
  args: {
    rating: 0,
  },
};

export const Full: Story = {
  args: {
    rating: 5,
  },
};
