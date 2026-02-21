const API_KEY = process.env.GEMINI_API_KEY ?? '';
const MODEL = 'gemini-2.0-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiRequest {
  system_instruction?: { parts: { text: string }[] };
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export async function chatWithBuddy(
  systemPrompt: string,
  history: GeminiMessage[],
): Promise<string> {
  const body: GeminiRequest = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: history,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    throw new RateLimitError('API quota exceeded — using demo mode.');
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return text;
}
