import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, ChatCompletionOptions, AiProviderConfig } from '../interfaces/ai-provider.interface';

@Injectable()
export class ClaudeProvider implements AiProvider {
  private config: AiProviderConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
      model: this.configService.get<string>('AI_MODEL') || 'claude-sonnet-4-20250514',
      maxTokens: this.configService.get<number>('AI_MAX_TOKENS') || 4096,
      temperature: this.configService.get<number>('AI_TEMPERATURE') || 0.7,
    };
  }

  async generateChatCompletion(options: ChatCompletionOptions): Promise<string> {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: this.config.apiKey });

    const systemMsg = options.messages.find(m => m.role === 'system');
    const otherMessages = options.messages.filter(m => m.role !== 'system');

    const response = await client.messages.create({
      model: this.config.model,
      max_tokens: options.maxTokens ?? this.config.maxTokens,
      temperature: options.temperature ?? this.config.temperature,
      system: systemMsg?.content,
      messages: otherMessages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }
}
