import React from 'react';
import {
  CouncilMode,
  AIProviderMeta,
  CouncilAnalysisDocument,
  ChatConversation,
} from '../types';
import { ChatView } from './ChatView';

interface CouncilViewProps {
  providers: AIProviderMeta[];
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  defaultMode: CouncilMode;
  onAnalysisComplete: (analysis: CouncilAnalysisDocument) => void;
  onOpenMap?: (prompt?: string) => void;
  activeConversation?: ChatConversation | null;
  onNewChat?: () => void;
  onSaveConversation?: (conversation: ChatConversation) => void;
}

export const CouncilView: React.FC<CouncilViewProps> = (props) => {
  return <ChatView {...props} />;
};
