import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ChatCompletionOptions, AiProviderConfig } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenaiProvider implements AiProvider {
  private config: AiProviderConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      model: this.configService.get<string>('AI_MODEL') || 'gpt-4o',
      maxTokens: this.configService.get<number>('AI_MAX_TOKENS') || 4096,
      temperature: this.configService.get<number>('AI_TEMPERATURE') || 0.7,
    };
  }

  async generateChatCompletion(options: ChatCompletionOptions): Promise<string> {
    const OpenAI = await import('openai');
    const client = new OpenAI.default({ apiKey: this.config.apiKey });

    const response = await client.chat.completions.create({
      model: this.config.model,
      max_tokens: options.maxTokens ?? this.config.maxTokens,
      temperature: options.temperature ?? this.config.temperature,
      messages: options.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    return response.choices[0]?.message?.content || '';
  }
}
