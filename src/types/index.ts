export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
  isGeneratingAudio?: boolean;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  language: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  voice?: string;
}

export interface AudioOptions {
  autoPlay: boolean;
  speed: number;
  voice: string;
  loop: boolean;
}
