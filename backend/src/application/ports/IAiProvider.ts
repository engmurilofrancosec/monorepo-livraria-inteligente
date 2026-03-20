export interface AiMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: any[];
  toolCallId?: string;
  name?: string;
}

export interface AiProviderResponse {
  content: string;
  toolCalls?: any[];
}

export interface IAiProvider {
  readonly providerName: string;
  generateResponse(messages: AiMessage[], tools: any[]): Promise<AiProviderResponse>;
}
