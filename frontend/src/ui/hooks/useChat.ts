import { useState, useCallback } from 'react';
import { BookApiService } from '@/infrastructure/api/BookApiService';

interface Message {
  role: 'user' | 'assistant' | 'tool' | 'model';
  content?: string;
  parts?: { text: string }[];
  toolCallId?: string;
  name?: string;
  toolCalls?: any[];
}

export function useChat(onUpdate: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', parts: [{ text }] };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const data = await BookApiService.chat(text, messages);
      // Replace the local history with the full, rich history from the backend
      if (data.messages) {
        setMessages(data.messages);
      } else {
        const modelMsg: Message = { role: 'assistant', content: data.text, parts: [{ text: data.text }] };
        setMessages(prev => [...prev, modelMsg]);
      }

      if (data.hasAction) {
        onUpdate();
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.error || 'Ops, tive um problema de conexão. Verifique se o backend está rodando.';
      
      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: errorMessage }]
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, onUpdate]);

  return {
    messages,
    isTyping,
    sendMessage
  };
}
