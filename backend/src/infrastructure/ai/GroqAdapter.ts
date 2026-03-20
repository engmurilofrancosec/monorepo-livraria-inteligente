import { AiMessage, AiProviderResponse, IAiProvider } from "../../application/ports/IAiProvider";
import { Groq } from 'groq-sdk';

export class GroqAdapter implements IAiProvider {
  private groq: Groq;
  public readonly providerName = "Groq";

  constructor(apiKey: string, private systemInstruction: string) {
    this.groq = new Groq({ apiKey });
  }

  async generateResponse(messages: AiMessage[], tools: any[]): Promise<AiProviderResponse> {
    const groqMessages: any[] = [
      { role: "system", content: this.systemInstruction },
      ...messages.map(m => {
        if (m.role === 'tool') {
          return {
            role: "tool",
            tool_call_id: m.toolCallId,
            content: m.content
          };
        }
        
        const role = m.role === 'assistant' ? 'assistant' : m.role;
        const msg: any = {
          role: role,
          content: m.content || ""
        };

        if (m.toolCalls && role === 'assistant') {
          msg.tool_calls = m.toolCalls.map((tc, index) => ({
            id: tc.id || `call_${Date.now()}_${index}`,
            type: "function",
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.args)
            }
          }));
        }

        return msg;
      })
    ];

    const groqTools = tools.map(t => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters
      }
    }));

    const response = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      tools: groqTools.length > 0 ? groqTools : undefined,
      tool_choice: groqTools.length > 0 ? "auto" : undefined,
      temperature: 0
    });

    const choice = response.choices[0];
    const content = choice.message.content || "";
    const toolCalls = choice.message.tool_calls?.map((tc: any) => ({
      id: tc.id,
      name: tc.function.name,
      args: JSON.parse(tc.function.arguments)
    }));

    return { content, toolCalls };
  }
}
