import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Languages, 
  Volume2, 
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import type { Conversation, Language } from '../types';
import { LANGUAGES } from '../constants/languages';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedLanguage: Language;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onLanguageChange: (language: Language) => void;
  onToggleAudioSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  selectedLanguage,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onLanguageChange,
  onToggleAudioSettings,
}) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div className="w-80 bg-claude-sidebar border-r border-claude-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-claude-border">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 px-4 py-3 bg-claude-accent hover:bg-claude-accent/80 text-white rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          New Conversation
        </button>
      </div>

      {/* Language Selector */}
      <div className="p-4 border-b border-claude-border relative">
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-claude-bg hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Languages size={20} className="text-claude-accent" />
          <span className="flex-1 text-left text-claude-text">
            {selectedLanguage.flag} {selectedLanguage.name}
          </span>
          <MoreHorizontal size={16} className="text-claude-text-secondary" />
        </button>

        {showLanguageDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-4 right-4 bg-claude-bg border border-claude-border rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto"
          >
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language);
                  setShowLanguageDropdown(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left ${
                  selectedLanguage.code === language.code ? 'bg-claude-accent/20' : ''
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <span className="text-claude-text">{language.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-claude-text-secondary">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new conversation to begin learning!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`group relative mb-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-claude-accent/20 border border-claude-accent/30'
                    : 'hover:bg-claude-bg'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
                onMouseEnter={() => setHoveredConversation(conversation.id)}
                onMouseLeave={() => setHoveredConversation(null)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-claude-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">
                      {LANGUAGES.find(l => l.code === conversation.language)?.flag || '🌐'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-claude-text font-medium text-sm mb-1">
                      {truncateTitle(conversation.title)}
                    </h3>
                    <p className="text-claude-text-secondary text-xs">
                      {formatDate(conversation.updatedAt)} • {conversation.messages.length} messages
                    </p>
                  </div>
                  {hoveredConversation === conversation.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="flex-shrink-0 p-1 text-claude-text-secondary hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="p-4 border-t border-claude-border">
        <button
          onClick={onToggleAudioSettings}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-claude-bg rounded-lg transition-colors"
        >
          <Volume2 size={20} className="text-claude-accent" />
          <span className="text-claude-text">Audio Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
