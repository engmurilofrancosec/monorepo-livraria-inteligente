import type { Meta, StoryObj } from '@storybook/react';
import Chat from './Chat';

const meta: Meta<typeof Chat> = {
  title: 'Components/Chat',
  component: Chat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chat>;

export const Default: Story = {
  args: {
    onUpdate: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-[400px] border-l border-white/5">
        <Story />
      </div>
    ),
  ],
};
