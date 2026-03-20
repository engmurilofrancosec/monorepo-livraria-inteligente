import { GoogleGenerativeAI, Tool, Content } from "@google/generative-ai";
import { AiMessage, AiProviderResponse, IAiProvider } from "../../application/ports/IAiProvider";

export class GeminiAdapter implements IAiProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;
  public readonly providerName = "Gemini";

  constructor(apiKey: string, systemInstruction: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      } as any
    });
  }

  async generateResponse(messages: AiMessage[], tools: any[]): Promise<AiProviderResponse> {
    const contents: Content[] = this.mapMessagesToGemini(messages);

    // In Gemini SDK, tools are passed during model initialization or per request.
    // For simplicity in this adapter, we'll assume tools are passed per request if needed, 
    // but the SDK works better if they are initialized. 
    // We'll re-init the model if tools change, or just pass them in generateContent.

    const result = await this.model.generateContent({
      contents,
      tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts || [];

    const content = response.text() || "";
    const toolCalls = parts
      .filter((p: any) => p.functionCall)
      .map((p: any) => ({
        name: p.functionCall.name,
        args: p.functionCall.args
      }));

    return { content, toolCalls };
  }

  private mapMessagesToGemini(messages: AiMessage[]): Content[] {
    return messages
      .filter(m => m.role !== 'system') // System is handled in constructor for Gemini
      .map(m => {
        if (m.role === 'tool') {
          return {
            role: 'user', // Gemini expects tool responses as 'user' or via specific response objects
            parts: [{
              functionResponse: {
                name: m.name!,
                response: { content: m.content }
              }
            }]
          } as any;
        }

        const parts: any[] = [{ text: m.content }];

        if (m.toolCalls) {
          m.toolCalls.forEach(tc => {
            parts.push({
              functionCall: {
                name: tc.name,
                args: tc.args
              }
            });
          });
        }

        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts
        };
      });
  }
}
