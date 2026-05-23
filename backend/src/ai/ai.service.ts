import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type Provider = 'claude' | 'openai' | 'groq';

// Models per provider — change here to switch globally
const MODELS: Record<Provider, string> = {
  claude: 'claude-sonnet-4-6',
  openai: 'gpt-4o-mini',
  groq: 'llama-3.3-70b-versatile',
};

const SYSTEM_PROMPT = `Tu es e-Anatra, un assistant pédagogique intelligent spécialisé dans l'éducation francophone.
Ton rôle est d'aider les élèves à comprendre les matières scolaires.

Règles :
- Réponds toujours en français
- Adapte tes explications au niveau de l'élève (primaire, collège, lycée, université)
- Explique étape par étape quand c'est possible
- Utilise des exemples concrets et accessibles
- Sois encourageant et bienveillant
- Utilise le markdown pour structurer tes réponses (titres, listes, code)
- Sois concis mais complet
`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly provider: Provider;
  private anthropic?: Anthropic;
  private openai?: OpenAI;
  private groq?: Groq;

  constructor(private config: ConfigService) {
    this.provider = (config.get<string>('AI_PROVIDER', 'claude') as Provider);

    if (this.provider === 'claude') {
      const key = config.get<string>('ANTHROPIC_API_KEY');
      if (key) this.anthropic = new Anthropic({ apiKey: key });
    } else if (this.provider === 'openai') {
      const key = config.get<string>('OPENAI_API_KEY');
      if (key) this.openai = new OpenAI({ apiKey: key });
    } else if (this.provider === 'groq') {
      const key = config.get<string>('GROQ_API_KEY');
      if (key) this.groq = new Groq({ apiKey: key });
    }
  }

  async chat(messages: ChatMessage[], userLevel?: string, customSystem?: string): Promise<string> {
    const baseSystem = customSystem ?? SYSTEM_PROMPT;
    const systemWithLevel = userLevel
      ? `${baseSystem}\nNiveau de l'élève : ${userLevel}`
      : baseSystem;

    try {
      if (this.provider === 'claude' && this.anthropic) {
        return await this.chatWithClaude(messages, systemWithLevel);
      }
      if (this.provider === 'openai' && this.openai) {
        return await this.chatWithOpenAI(messages, systemWithLevel);
      }
      if (this.provider === 'groq' && this.groq) {
        return await this.chatWithGroq(messages, systemWithLevel);
      }
      // Fallback: mock response for development without API keys
      return this.mockResponse(messages[messages.length - 1]?.content ?? '');
    } catch (error) {
      this.logger.error('AI chat error:', error);
      return 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.';
    }
  }

  async generateQuiz(subject: string, level: string, count: number): Promise<string> {
    const prompt = `Génère un quiz de ${count} questions sur la matière "${subject}" pour le niveau "${level}".

IMPORTANT : Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.

Format attendu :
{
  "title": "Titre du quiz",
  "questions": [
    {
      "question": "La question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explication détaillée de la bonne réponse"
    }
  ]
}

Règles :
- 4 options par question
- correctIndex est l'index (0-3) de la bonne réponse
- Les questions doivent être adaptées au niveau ${level}
- Les explications doivent être claires et pédagogiques`;

    const quizSystem = 'Tu es un générateur de quiz pédagogique. Réponds uniquement avec du JSON valide.';
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];

    try {
      if (this.provider === 'claude' && this.anthropic) {
        return await this.chatWithClaude(messages, quizSystem);
      }
      if (this.provider === 'openai' && this.openai) {
        return await this.chatWithOpenAI(messages, quizSystem);
      }
      if (this.provider === 'groq' && this.groq) {
        return await this.chatWithGroq(messages, quizSystem);
      }
      return this.mockQuiz(subject, level, count);
    } catch {
      return this.mockQuiz(subject, level, count);
    }
  }

  private async chatWithClaude(messages: ChatMessage[], system: string): Promise<string> {
    const response = await this.anthropic!.messages.create({
      model: MODELS.claude,
      max_tokens: 2048,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  }

  private async chatWithOpenAI(messages: ChatMessage[], system: string): Promise<string> {
    const response = await this.openai!.chat.completions.create({
      model: MODELS.openai,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    return response.choices[0]?.message?.content ?? '';
  }

  private async chatWithGroq(messages: ChatMessage[], system: string): Promise<string> {
    const response = await this.groq!.chat.completions.create({
      model: MODELS.groq,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    return response.choices[0]?.message?.content ?? '';
  }

  private mockResponse(question: string): string {
    return `Je suis en mode démonstration (aucune clé API configurée).

**Votre question :** ${question}

Pour activer les vraies réponses IA, configurez une clé API dans le fichier \`.env\` :
- \`ANTHROPIC_API_KEY\` pour Claude (recommandé)
- \`GROQ_API_KEY\` pour Groq/LLaMA (gratuit, très rapide)
- \`OPENAI_API_KEY\` pour GPT-4

En attendant, voici comment e-Anatra fonctionnerait avec une vraie clé API : je répondrais de façon détaillée, adaptée à votre niveau, avec des exemples concrets et des explications étape par étape.`;
  }

  private mockQuiz(subject: string, level: string, count: number): string {
    const questions = Array.from({ length: count }, (_, i) => ({
      question: `Question ${i + 1} de ${subject} (niveau ${level}) ?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: `Explication de la réponse correcte pour la question ${i + 1}.`,
    }));
    return JSON.stringify({ title: `Quiz ${subject} — ${level}`, questions });
  }
}
