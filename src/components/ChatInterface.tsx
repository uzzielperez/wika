import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Loader2, 
  Copy, 
  RotateCcw,
  Download,
  BookOpen
} from 'lucide-react';
import { Message, Language, AudioOptions } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  selectedLanguage: Language;
  audioOptions: AudioOptions;
  onSendMessage: (message: string) => void;
  onPlayAudio: (messageId: string) => void;
  onPauseAudio: () => void;
  onGenerateAudio: (messageId: string) => void;
  onDownloadAudio: (messageId: string) => void;
  onCreateAudiobook: () => void;
  playingAudioId: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  selectedLanguage,
  audioOptions,
  onSendMessage,
  onPlayAudio,
  onPauseAudio,
  onGenerateAudio,
  onDownloadAudio,
  onCreateAudiobook,
  playingAudioId,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    onSendMessage(inputText);
    setInputText('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const AudioWaveform = () => (
    <div className="flex items-center gap-1">
      <div className="w-1 bg-claude-accent rounded-full audio-wave"></div>
      <div className="w-1 bg-claude-accent rounded-full audio-wave"></div>
      <div className="w-1 bg-claude-accent rounded-full audio-wave"></div>
      <div className="w-1 bg-claude-accent rounded-full audio-wave"></div>
      <div className="w-1 bg-claude-accent rounded-full audio-wave"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-claude-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-claude-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-claude-accent/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">{selectedLanguage.flag}</span>
          </div>
          <div>
            <h1 className="text-claude-text font-semibold">Learning {selectedLanguage.name}</h1>
            <p className="text-claude-text-secondary text-sm">
              AI-powered language practice
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {messages.filter(m => !m.isUser).length > 0 && (
            <button
              onClick={onCreateAudiobook}
              className="flex items-center gap-2 px-3 py-2 bg-claude-accent/20 hover:bg-claude-accent/30 text-claude-accent rounded-lg transition-colors"
            >
              <BookOpen size={16} />
              <span className="text-sm">Create Audiobook</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-claude-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">{selectedLanguage.flag}</span>
              </div>
              <h3 className="text-xl font-semibold text-claude-text mb-2">
                Start practicing {selectedLanguage.name}!
              </h3>
              <p className="text-claude-text-secondary max-w-md">
                Type a message below to begin your conversation. I'll help you learn through natural dialogue
                and provide audio pronunciation for every response.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.isUser ? 'ml-12' : 'mr-12'}`}>
                  <div
                    className={`p-4 rounded-xl ${
                      message.isUser
                        ? 'bg-claude-accent text-white'
                        : 'bg-gray-800 text-claude-text border border-claude-border'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {!message.isUser && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(message.text)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Copy text"
                          >
                            <Copy size={14} />
                          </button>
                          
                          {message.isGeneratingAudio ? (
                            <div className="flex items-center gap-2 text-claude-accent">
                              <Loader2 size={14} className="animate-spin" />
                              <span className="text-xs">Generating audio...</span>
                            </div>
                          ) : message.audioUrl ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => 
                                  playingAudioId === message.id 
                                    ? onPauseAudio() 
                                    : onPlayAudio(message.id)
                                }
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                title={playingAudioId === message.id ? 'Pause' : 'Play audio'}
                              >
                                {playingAudioId === message.id ? (
                                  <div className="flex items-center gap-1">
                                    <Pause size={14} />
                                    <AudioWaveform />
                                  </div>
                                ) : (
                                  <Play size={14} />
                                )}
                              </button>
                              <button
                                onClick={() => onDownloadAudio(message.id)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                title="Download audio"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onGenerateAudio(message.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors text-claude-text-secondary hover:text-claude-accent"
                              title="Generate audio"
                            >
                              <Volume2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mr-12"
              >
                <div className="max-w-[80%] p-4 rounded-xl bg-gray-800 border border-claude-border">
                  <div className="flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-claude-accent" />
                    <span className="text-claude-text-secondary">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-claude-border">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Type your message in ${selectedLanguage.name}...`}
              className="w-full min-h-[44px] max-h-[120px] px-4 py-3 bg-gray-800 border border-claude-border rounded-xl text-claude-text placeholder-claude-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-claude-accent"
              disabled={isLoading}
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`p-3 rounded-xl transition-all duration-200 ${
              inputText.trim() && !isLoading
                ? 'bg-claude-accent hover:bg-claude-accent/80 text-white'
                : 'bg-gray-700 text-claude-text-secondary cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-3 text-xs text-claude-text-secondary">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {audioOptions.autoPlay && (
            <div className="flex items-center gap-1">
              <Volume2 size={12} />
              <span>Auto-play enabled</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
